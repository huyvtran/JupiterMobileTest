import {Component} from '@angular/core';
import {NavParams, IonicPage} from 'ionic-angular';
import {Chart} from 'chart.js';
import {ViewChild} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import {ManagerKpiProvider} from '../../../../../../providers/managerkpi-provider';


import {BasePage} from '../../../../../../providers/base/base-page';
import * as ICore from '../../../../../../interfaces/iCore';
import _ from 'lodash';

@IonicPage()
@Component({selector: 'page-manager-kpi-trend', templateUrl: 'trend.html'})
export class ManagerKpiTrendPage extends BasePage {
    wait : boolean = true;
    title : string;
    output : any = new Array < any > ();

    @ViewChild('barCanvas')barCanvas;
    barChart : any;
    item : any;

    data : any;

    kumulativ: boolean;

    d1 = [];
    d2 = [];

    ncn : number;
    

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

        console.log(navParams);
        this.kumulativ=false;
        // let labels = this.test.graf.map(x => x.gdatum) for (let entry of
        // this.myChartConfig.data.datasets) {     this.innerData.data = entry;
        // this.myChartConfig.data.datasets.push(this.innerData.data) }
        // this.myChartConfig.data.datasets[0].data = iznosi;

        this.item = navParams.data;
        this.ncn=navParams.data.nacin;
        //console.log(navParams.data);
        this.title = navParams.data.naziv;

        this.getData();
    }

    // rotateScreen() {
    //     console.log(this.screen.type)
    //     if (this.screen.type == 'landscape-primary') {
    //       this.screen.lock('portrait-primary');
    //     }
    //     else {
    //       this.screen.lock('landscape-primary')
    //     }
    // }


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
                    "query": "spMobKPITrendQuery",
                    "params": {
                        "datumdo": this.managerKpiProvider.datum,
                        "nacin": "0",
                        "manpokazateljiid": this.item.manpokazateljiid
                    },
                    "tablename":"trend"
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
                //console.log("11");
            });
    }

    promijenitrend() {
        console.log('Stanje:' + this.kumulativ);

        this.myChartConfig.data.datasets = [];

        // this.myChartConfig.data.datasets.forEach((dataset) => {
        //     dataset.data.pop();
        // });

        //this.barChart.update();

        if (this.kumulativ==true)
        {
            console.log(this.d2);
            for (let g1 of this.d2) {
                
                            this
                                    .myChartConfig
                                    .data
                                    .datasets
                                .push(g1);
                
                            }
                
        }
        else
        {
            console.log(this.d1);
            for (let g2 of this.d1) {
                
                            this
                                    .myChartConfig
                                    .data
                                    .datasets
                                .push(g2);
                
                            }
                

        }
        this.barChart.update();
      }

    configChart() {
        try
         {
            //console.log(this.myChartConfig);
            let groups : any;
            groups = _(this.data.trend)
                .groupBy(x => x.godina)
                .map((value, key) => ({pokazatelji: key, data: value}))
                .value();
            //console.log(groups);
            if (groups.length == 0)
                return;
            let i = 0
            for (let group of groups) {
                if (i == 0) {
                    let labels = group
                        .data
                        .map(x => x.gdatum)
                    this.myChartConfig.data.labels = labels;
                    //console.log(group);
                    //console.log(group.data[0].charttype);
                    let chartType = group.data[0].charttype;
                    this.myChartConfig.type = chartType;
                }
    
                let iznosi = group
                    .data
                    .map(x => x.iznos)
                   // console.log(iznosi);
                let naziv = group.data[0].godina;
                let backgroundColor = group.data[0].backgroundcolor;
                //let fillColour = group.data[0].bordercolor;

                var output = [];
                var sum = 0;
                
                // for(var i in iznosi){
                //   sum=sum+iznosi[i];
                //   output.push(sum)
                // }

                for(let i of iznosi){
                    sum=sum+i;
                    output.push(sum)
                  }
  

                console.log(output);

                let fill = group.data[0].fill;
                let innerData = {
                    label: naziv,
                    fill: fill,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    //fillColor: backgroundColor,
                    data: iznosi
                }

                let innerData1 = {
                    label: naziv,
                    fill: fill,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    //fillColor: backgroundColor,
                    data: output
                }
                // this
                //     .myChartConfig
                //     .data
                //     .datasets
                //     .push(innerData);
                //     console.log(innerData);
                this.d1.push(innerData);
                this.d2.push(innerData1);
                //this.d1.
                i++;
                
            }

            console.log(this.d1);

            for (let g1 of this.d1) {

            this
                    .myChartConfig
                    .data
                    .datasets
                .push(g1);

            }

            // this
            //     .myChartConfig
            //     .data
            //     .datasets
            // .push(this.d1.join(","));
            console.log(this.myChartConfig);
            this.barChart = new Chart(this.barCanvas.nativeElement, this.myChartConfig)
         } catch (ex) {
                this.global.logError(ex);
         }
        
    }
}