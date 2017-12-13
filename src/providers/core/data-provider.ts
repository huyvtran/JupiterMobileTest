import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import {ConstProvider} from './const-provider';
import {VariableProvider} from './variable-provider';
import {ModulesProvider} from './modules-provider';
import {ErrorProvider} from './error-provider';
import * as ICore from '../../interfaces/iCore';
import {StorageProvider} from './storage-provider';
import {AppUnlockStorageProvider} from './app-unlock-storage-provider';

@Injectable()
export class DataProvider {

    response : any = [];
    errorShown: boolean = false;
    logErrors : boolean = true;

    constructor(public http: Http
        , private constants: ConstProvider
        , private variable: VariableProvider
        , private storage: StorageProvider
        , private error: ErrorProvider
        , private appUnlockStorageProvider: AppUnlockStorageProvider
    ){

    }


    getData(dataModel: ICore.IData, showLoader?: boolean, spinApiEndPoint?: string, jupiterSystem?: boolean, tokenRequired: boolean = true):Observable<Response>
    {    
        try
        {
            if (showLoader == true) {
                this.variable.loaderActive = true;          
            }
            //dodavanje query parametara koji su zajednicki
            let db = this.variable.company ? this.variable.company.db : null;
            let operaterId = ModulesProvider.storageRoot? ModulesProvider.storageRoot.operateriid : null;
            let login = VariableProvider.jupiterSystemData ? VariableProvider.jupiterSystemData.user.login : null;


            let definition = {
                operaterId: operaterId,
                login: login,
                db: jupiterSystem? "JupiterSystem" : db,
                queries: dataModel.queries,
                files : dataModel.files
            }
            
            let strData = JSON.stringify(definition);

            var url = "";
            if (this.variable.loginData != null)
                url = this.variable.loginData.serverPath + 'dataToken';
            //var url = this.constants.serviceUrl + 'data';
            
            //ako postoji api end point idi na spin servis core url
            if(spinApiEndPoint != null && spinApiEndPoint != "")
                url =  this.constants.spinApiCore + spinApiEndPoint;

            
            //ako u modelu postoji files end poin idi na service url 
            if(dataModel.files != null && dataModel.files.endpoint != "" && dataModel.files.endpoint != null)
                url =  this.variable.loginData.serverPath + dataModel.files.endpoint;

            var opt = this.getAuthorizedOptions(tokenRequired);

            return this.doRequest(url,strData,opt,tokenRequired);
           

         } catch (err) {
             console.log(err)
            this.deactivateLoader();
            //this.error.logError(err, true);
        }
    }

    private doRequest(url,strData,opt, tokenRequired) : Observable<Response>{

         return this.http
                .post(url, strData, opt)
                .finally(() => {
                    this.deactivateLoader();
                })
                .catch(err => {
                    console.log(err)
                    this.deactivateLoader();
                    //this.error.logError(err);
                    if (err && err.status === 401){
                        return  this.getNewAccessToken()
                            .flatMap((res) : Observable<Response> => {
                                if (res != null && res.status === 200) {
                                    this.response = res.json();
                                    //this.constants.accessToken = this.response.AccessToken;
                                    this.variable.loginData.accessToken = this.response.AccessToken;
                                    //spremi podatkke o otkljucanim aplikacijama

                                    this.processingCoreData(this.response);

                                    this.sendLog().toPromise().catch((err) => {
                                            console.log("greska");
                                            this.logErrors = true;
                                        }).then(() => this.logErrors = true)
                                    

                                    //return this.doRequest(url, strData, this.getAuthorizedOptions(tokenRequired), tokenRequired)
                                    return this.http.post(url, strData, this.getAuthorizedOptions(tokenRequired))
                                    .retry(this.constants.dataRetryNumber)

                                    
                                    
                                } 
                            })
                            //pokusaj 1 + 2 puta dohvatiti token
                            .retry(this.constants.dataRetryNumber)
                    }
                    else{
                        //this.error.logError(err,true);
                        if(this.logErrors)
                            this.error.logError(err,true);
                    }
                });   
 

    }

    private getAuthorizedOptions(tokenRequired?: boolean):RequestOptions{

        let opt : RequestOptions
        let headers : Headers = new Headers

        //uzimanje tokena iz storagea
        if(tokenRequired != false){
            console.log("potreban token")
            let jwt = this.variable.loginData.accessToken; 

            if (jwt) {
                headers.append('Authorization', 'Bearer ' + jwt);
            }
        }
        headers.set('Content-Type', 'application/json');

        return opt = new RequestOptions({headers: headers});

    }

    private sendLog():  Observable<Response>{
        this.logErrors = false;
        console.log("sendLog");
        try {
            var refreshToken = this.variable.loginData.refreshToken; 


            let dataDef: ICore.IData = {
                logs : {
                    log: this.constants.coreStorageKeys.logPages,
                    refreshtoken : refreshToken
                }
            }
            return this.getData(dataDef,false,"log",false,true);
        } 
        catch (ex) {
            console.log("greska")
        }
  
    }

    deactivateLoader() {
        this.variable.loaderActive = false;
    }

    getNewAccessToken(): Observable<Response>{
        
        var refreshToken = this.variable.loginData.refreshToken; 

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
                    "tablename" : "apps"
                }
            ]
        }

        return this.getData(dataDef,false,"refreshToken",false,false);

 
    }


    processingCoreData(coreData: any) 
    {
        console.log("processingCoreData");
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