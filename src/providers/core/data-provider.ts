import { Platform } from 'ionic-angular';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { ConstProvider } from './const-provider';
import { VariableProvider } from './variable-provider';
import { ModulesProvider } from './modules-provider';
import { ErrorProvider } from './error-provider';
import * as ICore from '../../interfaces/iCore';
import { StorageProvider } from './storage-provider';
import { AppUnlockStorageProvider } from './app-unlock-storage-provider';
import { concat } from 'rxjs/operator/concat';

declare var cordova:any;

@Injectable()
export class DataProvider {

    response: any = [];
    errorShown: boolean = false;
    logErrors: boolean = true;

    constructor(public http: Http
        , private constants: ConstProvider
        , private variable: VariableProvider
        , private storage: StorageProvider
        , private error: ErrorProvider
        , private appUnlockStorageProvider: AppUnlockStorageProvider
        , private platform : Platform, 
    ) {

    }

    //getData(dataModel: ICore.IData, showLoader?: boolean, customApiEndPoint?: string, spinApiEndPoint?: string, jupiterSystem?: boolean, tokenRequired: boolean = true):Observable<Response>
    getData(dataModel: ICore.IData, properties?: ICore.IPropertiesCore): Observable<Response> {

        let propertiesDefinition = {
            showLoader: properties ? (properties.showLoader == false ? properties.showLoader : true) : true,
            tokenRequired: properties ? (properties.tokenRequired == false ? properties.tokenRequired : true) : true,
            errorMessageResponse: properties ? (properties.errorMessageResponse ? properties.errorMessageResponse : false) : false,
            errorMessageType: properties ? (properties.errorMessageType ? properties.errorMessageType : null) : null,
            errorMessageCloseButton: properties ? (properties.errorMessageCloseButton ? properties.errorMessageCloseButton : false) : false,
            spinApiEndPoint: properties ? (properties.spinApiEndPoint ? properties.spinApiEndPoint : null) : null,
            customApiEndPoint: properties ? (properties.customApiEndPoint ? properties.customApiEndPoint : null) : null,
            jupiterSystem: properties ? (properties.jupiterSystem ? properties.jupiterSystem : false) : false

        }

        try {
            if (propertiesDefinition.showLoader == true) {
                this.variable.loaderActive = true;
            }

            //dodavanje query parametara koji su zajednicki
            let db = this.variable.company ? this.variable.company.db : null;
            let operaterId = this.variable.company ? this.variable.company.operateriid : null;
            //2018.11 - stari način dohvata "operaterId" koji se mijenja nakon ponovnog logiranja
            //ako je korisnik neodjavljen koristi se ovaj način:
            if (operaterId == null)
                operaterId = ModulesProvider.storageRoot ? ModulesProvider.storageRoot.operateriid : null ;

            let login = VariableProvider.jupiterSystemData ? VariableProvider.jupiterSystemData.user.login : null;



            let definition = {
                operaterId: operaterId,
                login: login,
                db: propertiesDefinition.jupiterSystem ? "JupiterSystem" : db,
                queries: dataModel.queries,
                logs: dataModel.logs,
                files: dataModel.files
            }


            let strData = JSON.stringify(definition);

            var url = "";
            if (this.variable.loginData != null)
                url = this.variable.loginData.serverPath + 'dataToken';
            //var url = this.constants.serviceUrl + 'data';

            //ako postoji api end point idi na spin servis core url
            if (propertiesDefinition.spinApiEndPoint != null && propertiesDefinition.spinApiEndPoint != "")
                url = this.constants.spinApiCore + propertiesDefinition.spinApiEndPoint;

            

            //ako u modelu postoji files end poin idi na service url 
            if (dataModel.files != null && dataModel.files.endpoint != "" && dataModel.files.endpoint != null)
                url = this.variable.loginData.serverPath + dataModel.files.endpoint;

            if (propertiesDefinition.customApiEndPoint != null && propertiesDefinition.customApiEndPoint != "") {
                //url = this.constants.serviceCustomUrl + customApiEndPoint;
                //url = "http://localhost:56554/api/" + propertiesDefinition.customApiEndPoint;
                url = this.variable.customWebApi + propertiesDefinition.customApiEndPoint;
            }

            var opt = this.getAuthorizedOptions(propertiesDefinition.tokenRequired);

            return this.doRequest(url, strData, opt, propertiesDefinition);


        } catch (err) {
            this.deactivateLoader();
            if (propertiesDefinition.errorMessageResponse)
                throw err;
        }
    }

    private doRequest(url, strData, opt, propertiesDef: ICore.IPropertiesCore): Observable<any> {
        if (this.platform.is('cordova')) {
            cordova.plugins.certificates.trustUnsecureCerts(true);
        }

        return this.http
            .post(url, strData, opt)
            .finally(() => {
                this.deactivateLoader();
            })
            .catch(err => {
                this.deactivateLoader();
                //this.error.logError(err);
                if (err && err.status === 401) {
                    return this.getNewAccessToken()
                        .flatMap((res): Observable<Response> => {
                            if (res != null && res.status === 200) {
                                this.response = res.json();
                                //this.constants.accessToken = this.response.AccessToken;
                                this.variable.loginData.accessToken = this.response.AccessToken;

                                //ToDo: !!!!spremiti topken u storage!!!!

                                //spremi podatkke o otkljucanim aplikacijama

                                this.processingCoreData(this.response);

                                this.sendLog().catch((err) => {
                                    this.logErrors = true;
                                }).then(() => this.logErrors = true)

                                //return this.doRequest(url, strData, this.getAuthorizedOptions(tokenRequired), tokenRequired)
                                return this.http.post(url, strData, this.getAuthorizedOptions(propertiesDef.tokenRequired))
                                    .retry(this.constants.dataRetryNumber)



                            }
                        })
                        //pokusaj 1 + 2 puta dohvatiti token
                        .retry(this.constants.dataRetryNumber)
                }
                else {
                    //ako zelimo prikaz greske
                    if (!propertiesDef.errorMessageResponse) {

                        if (propertiesDef.errorMessageType === "alert")
                            this.error.logError(err, true, 'alert')
                        else
                            this.error.logError(err, true, null, propertiesDef.errorMessageCloseButton);
                    }

                    // return greske u controller
                    throw err;
                }
            });


    }

    private getAuthorizedOptions(tokenRequired?: boolean): RequestOptions {
        let opt: RequestOptions
        let headers: Headers = new Headers

        //uzimanje tokena iz storagea
        if (tokenRequired != false) {
            console.log("potreban token")
            let jwt = this.variable.loginData.accessToken;

            if (jwt) {
                headers.append('Authorization', 'Bearer ' + jwt);
            }
        }
        headers.set('Content-Type', 'application/json');

        return opt = new RequestOptions({ headers: headers });

    }

    private sendLog(): Promise<any> {
        this.logErrors = false;

        let keyLogPages = this.constants.coreStorageKeys.logPages;
        try {
            return this.storage.getFromStorage(this.constants.coreStorageKeys.logPages, null, false)
                .then(val => {
                    var refreshToken = this.variable.loginData.refreshToken;
                    var logStr: string = null;
                    if (val != null) {
                        logStr = JSON.stringify(val);
                    }

                    let properties: ICore.IPropertiesCore = {
                        //errorMessageCloseButton: true
                        spinApiEndPoint: 'log'
                    }


                    let dataDef: ICore.IData = {
                        logs: {
                            log: logStr,
                            refreshtoken: refreshToken
                        }
                    }
                    console.log("getData:");
                    return this.getData(dataDef, properties).retry(this.constants.dataRetryNumber).toPromise();
                })
                .then(() => {
                    console.log("clear storage:");
                    this.storage.addToStorage(keyLogPages, null, null, false);
                }
                );

        }
        catch (ex) {
            console.log(ex);
        }

    }

    deactivateLoader() {
        this.variable.loaderActive = false;
    }

    getNewAccessToken(): Observable<Response> {

        var refreshToken = this.variable.loginData.refreshToken;
        let properties: ICore.IPropertiesCore = {
            tokenRequired: false,
            spinApiEndPoint: 'refreshToken'
        }
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spPinCoreQuery",
                    "params": {
                        "Action": "checkRefreshToken",
                        "RefreshToken": refreshToken
                    },
                    "tablename": "info",
                    "singlerow": true

                },
                {
                    "query": "spPinCoreQuery",
                    "params": {
                        "Action": "getUnlocked",
                        "RefreshToken": refreshToken
                    },
                    "tablename": "apps"
                }
            ]
        }

        return this.getData(dataDef, properties);


    }


    processingCoreData(coreData: any) {
        try {
            if (coreData != null && coreData.data != null && coreData.data.info != null) {
                console.log(coreData.data.info.serverpath);
                let serverpath = coreData.data.info.serverpath;
                this.storage.addToStorage(this.constants.coreStorageKeys.loginData, "serverPath", serverpath, false);
                this.variable.loginData.serverPath = serverpath;
            }
        }
        catch (ex) {
            this.error.logError(ex, true);
        }

        try {
            if (coreData != null && coreData.data != null && coreData.data.apps != null) {
                console.log("apps");
                console.log(coreData.data.apps);
                this.appUnlockStorageProvider.addToStorage(coreData.data.apps).then(() => {
                    this.appUnlockStorageProvider.getDataFromStorage();
                });
            }
        } catch (ex) {
            this.error.logError(ex, true);
        }
    }
}