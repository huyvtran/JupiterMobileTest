import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController, ModalController, Modal, AlertController, Form, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasePage } from '../../../../../../providers/base/base-page';
import * as ICore from '../../../../../../interfaces/iCore';

@IonicPage()
@Component({ selector: 'page-admin-find-licenci', templateUrl: 'find-licenci.html' })
export class AdminFindLicencePage extends BasePage {

    licence: any = [];
    sifarnici: any = []
    serverId: number;
    expanded: boolean = true;
    submitAttempt: boolean = false;

    form: FormGroup;
    loginid: number = null;
    sifra: string = null;
    manufacturerid: number = null
    modelid: number = null
    constructor(private toastCtrl: ToastController, public formBuilder: FormBuilder, private navCtrl: NavController, private viewCtrl: ViewController, private navParams: NavParams, private alertController: AlertController, private modal: ModalController) {
        super();
        this.serverId = this.navParams.get('tvrtka');

        this.form = formBuilder.group({
            sifra: [this.sifra, Validators.maxLength(8)],

            login: [this.loginid],
            manufacturer: [this.manufacturerid],
            model: [this.modelid],
        });
    }

    ionViewDidEnter() {
        this.getData().then((res) => {
            this.sifarnici = res;
            console.log(this.sifarnici)
        })
    }

    onCancel(controll) {

        if (controll === "login") {
            this.form.value.login = null;
            this.loginid = null;
        }
        else if (controll === "model") {
            this.form.value.model = null;
            this.modelid = null;
        }
        else if (controll === "manufacturer") {
            this.form.value.manufacturer = null;
            this.manufacturerid = null;
        }

    }

    searchLicence(form: FormGroup) {

        console.log(form)
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobAdminQuery",
                    "params": {
                        "action": "searchLicences",
                        "serverid": this.serverId,
                        "login": this.form.value.login,
                        "pin": this.form.value.sifra,
                        "devicemodel": this.form.value.model,
                        "devicemanufacturer": this.form.value.manufacturer
                    }
                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

    getData() {
        let dataDef: ICore.IData = {
            queries: [
                {
                    query: "spMobAdminQuery",
                    params: {
                        action: "logins",
                        serverid: this.serverId
                    }
                    ,
                    tablename: "logins"
                },
                {
                    query: "spMobAdminQuery",
                    params: {
                        action: "devicemanufacturers",
                        serverid: this.serverId
                    }
                    ,
                    tablename: "devicemanufacturers"
                },
                {
                    query: "spMobAdminQuery",
                    params: {
                        action: "devicemodels",
                        serverid: this.serverId
                    }
                    ,
                    tablename: "devicemodels"
                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }




    find() {
        console.log(this.form.value)

        if (!this.form.valid) {
            return;
        }
        this.submitAttempt = true;
        
        if (this.form.value.login == null && this.form.value.manufacturer == null && this.form.value.model == null && (this.form.value.sifra == null || this.form.value.sifra === "")) {

            let message = "Morate popuniti barem jedno polje u tražilici!";

            let toast = this
                .toastCtrl
                .create({ message: message, duration: 3000, position: 'bottom' });

            toast.present();
        }
        else{
            this.variable.loaderActive = true;
            this.searchLicence(this.form)
                .then((res) => {
                    this
                        .viewCtrl
                        .dismiss(res);
                })
        }   
    }






}
