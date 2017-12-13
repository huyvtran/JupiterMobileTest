import {Component} from '@angular/core';
import {IonicPage, ViewController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({selector: 'page-shared-property-list', templateUrl: 'property-list.html'})
export class SharedPropertyListPage {
    rdoGroup: any;
    rdoSort: any;
    chkWordWrap: any = false;

    constructor(params: NavParams, private viewCtrl: ViewController) {
        this.rdoGroup = params.get("group");
    }



    potvrdi() {
        let group = "";
        if (this.rdoGroup != undefined)
            group = this.rdoGroup;

        let params = {
             group: group,
             sort: this.rdoSort,
             wordWrap: this.chkWordWrap
        }
        this.viewCtrl.dismiss(params);
    }

}
