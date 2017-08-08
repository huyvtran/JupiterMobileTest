import {Component} from '@angular/core';
import {NavController, App, IonicPage, ToastController} from 'ionic-angular';
import {LOCALE_ID} from '@angular/core';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {EvidencijaProvider} from '../../../providers/evidencija-provider';
import {FavoritesProvider} from '../../../providers/core/favorites-provider';

@IonicPage()
@Component({
    selector: 'page-hrm-odsustva',
    templateUrl: 'odsustva.html',
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'hr-HR'
        }
    ]
})
export class HrmOdsustvaPage {
    public test : Array < any >;

    private datum : string = '-';

    tip : string;

    eventSource;
    evidencijaSource;
    najavaSource;

    viewTitle;
    isToday : boolean;
    calendar = {
        mode: 'month',
        //currentDate: new Date(2015, 12, 1),
        currentDate: new Date(),
        formatDayHeader: 'EE',
        formatDay: 'd',
        formatMonthTitle: 'MMMM yyyy',
        startingDayMonth: 1
    }; // these are the variable used by the calendar.

    constructor(public navCtrl : NavController, private app : App, private evidencija : EvidencijaProvider, private globalProvider : GlobalProvider, private favoritesProvider : FavoritesProvider, private toastCtrl: ToastController) {
        this.tip = "najava";
        this.init();
    }

    private init() {
        Promise
            .resolve()
            .then(() => {
                return this
                    .favoritesProvider
                    .init("HrmOdsustvaPage", "HRM - odsustva", "HRM - Ljudski resursi");
            });
    }
    ionViewDidEnter() {
        this
            .evidencija
            .getServerData()
            .then(data => {
                this.evidencijaSource = data.evidencija;
                this.najavaSource = data.najava;
                this.eventSource = data.najava;
            })
            .catch(err => {
                this.presentToastError(err._body);
            });
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }
    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);

    }
    changeMode(mode) {
        this.calendar.mode = mode;
    }
    today() {
        this.calendar.currentDate = new Date();
    }
    onTimeSelected(ev) {
        this.test = ev.events;
        this.datum = this.formatDate(ev.selectedTime);
        console.log(ev);
    }

    formatDate(date) : string {
        var mm = String(date.getMonth() + 1);
        var dd = String(date.getDate());
        var yy = String(date.getFullYear()).substring(2, 4);
        console.log(mm);
        console.log(dd);
        console.log(yy);
        if (mm.length == 1) 
            mm = "0" + mm;
        if (dd.length == 1) 
            dd = "0" + dd;
        return dd + '.' + mm + ". '" + yy;
    }

    onCurrentDateChanged(event : Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    markDisabled = (date : Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    selectedEvidencija() {
        this.eventSource = this.evidencijaSource; //this.createRandomEvents();
    }

    selectedNajava() {
        this.eventSource = this.najavaSource; //this.createRandomEvents();
    }


     doubleTap() {
        this.closePage();
    }

    closePage() {
        this.globalProvider.pullPage();
    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

}
