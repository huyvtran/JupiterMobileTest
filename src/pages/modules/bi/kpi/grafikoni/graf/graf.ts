import {Component} from '@angular/core';
import {NavParams, IonicPage} from 'ionic-angular';
import {Chart} from 'chart.js';
import {ViewChild} from '@angular/core';
import {ScreenOrientation} from '@ionic-native/screen-orientation';

import {ManagerKpiProvider} from '../../../../../../providers/managerkpi-provider';


import {BasePage} from '../../../../../../providers/base/base-page';
import * as ICore from '../../../../../../interfaces/iCore';
import _ from 'lodash';

@IonicPage()
@Component({selector: 'page-manager-kpi-graf', templateUrl: 'graf.html'})
export class ManagerKpiGrafPage extends BasePage {
    wait : boolean = true;
    title : string;
    output : any = new Array < any > ();

    @ViewChild('barCanvas') barCanvas;
    barChart : any;
    item : any;

    data : any;

    myChartConfig = {
        type: '',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            legend: {
                display: true
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    }

    constructor(public navParams : NavParams, private managerKpiProvider : ManagerKpiProvider, private screen: ScreenOrientation) {
        super();

        

        // let labels = this.test.graf.map(x => x.gdatum) for (let entry of
        // this.myChartConfig.data.datasets) {     this.innerData.data = entry;
        // this.myChartConfig.data.datasets.push(this.innerData.data) }
        // this.myChartConfig.data.datasets[0].data = iznosi;

        this.item = navParams.data;
        this.title = navParams.data.naziv;

        this.getData();
    }


    rotateScreen() {
        console.log(this.screen.type)
        if (this.screen.type == 'landscape-primary') {
          this.screen.lock('portrait-primary');
        }
        else {
          this.screen.lock('landscape-primary')
        }
    }
    

    ionViewDidLoad(){
        this.screen.lock('landscape')
    }
    ionViewWillLeave(){
        this.screen.lock('portrait-primary')
    }


    setDataDef() {
        let properties : ICore.IProperties = {
            showLoader: false
         }
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobKPIGrafQuery",
                    "params": {
                        "manpokgrafikonid": this.item.manpokgrafikonid,
                        "operateriid": "@@OperaterId",
                        "datumdo": this.managerKpiProvider.datum,
                        "korak": this.item.korak
                    },
                    "tablename": "graf"
                }
            ]
        }
        return this
            .global
            .getData(dataDef, properties);

    }

    getData() {
        //this.cards = [];
        this
            .setDataDef()
            .then(x => {
                this.data = x;
                this.configChart();
            });
    }

    configChart() {
        try
         {

            let groups : any;
            groups = _(this.data.graf)
                .groupBy(x => x.manpokazateljiid)
                .map((value, key) => ({pokazatelji: key, data: value}))
                .value();

            if (groups.length == 0)
                return;
            let i = 0
            for (let group of groups) {
                if (i == 0) {
                    let labels = group
                        .data
                        .map(x => x.gdatum)
                    this.myChartConfig.data.labels = labels;
                    let chartType = group.data[0].charttype;
                    this.myChartConfig.type = chartType;
                }
                
    
                let iznosi = group
                    .data
                    .map(x => x.iznos)
                let naziv = group.data[0].pokazateljnaziv;
                let backgroundColor = group.data[0].backgroundcolor;
                let fill = group.data[0].fill;
                let innerData = {
                    label: naziv,
                    fill: fill,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    data: iznosi
                }
                this
                    .myChartConfig
                    .data
                    .datasets
                    .push(innerData);
                i++;
                
            }

            this.barChart = new Chart(this.barCanvas.nativeElement, this.myChartConfig)
         } catch (ex) {
                this.global.logError(ex);
         }
        
    }
}