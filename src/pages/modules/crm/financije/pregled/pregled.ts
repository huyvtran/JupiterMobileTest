import {Component} from '@angular/core';
import {NavController, IonicPage, ModalController} from 'ionic-angular';

import {Chart} from 'chart.js';
import {ViewChild} from '@angular/core';

import {CrmFinancijePregledProvider} from '../../../../../providers/crm-financije-pregled-provider';

import {NumberFormatPipe} from '../../../../../pipes/number-format.pipe';

import * as Moment from 'moment';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';

@IonicPage()
@Component({selector: 'page-crm-financije-pregled', 
    templateUrl: 'pregled.html',
    providers: [NumberFormatPipe] 
    })
export class CrmFinancijePregledPage extends BasePage {




    @ViewChild('barCanvas')barCanvas;
    
    godinaTekuca: number = new Date().getFullYear();
    godinaProsla: number = new Date().getFullYear() - 1;

    dataFin : any = [];
    items = [
        {
            caption: 'Dospjelo',
            name: 'nedospjelo'
        }, {
            caption: 'Nedospjelo',
            name: 'dospjelo'
        }, {
            caption: 'Saldo',
            name: 'saldo'
        }
    ]
    itemsZadnjeOld: any = [
        {
            caption: 'Zadnja uplata',
            value: '-',
            items: [
                {caption: "kupac", value: '-'},
                {caption: "dobavljač", value: '-'}
            ]
        }, {
            caption: 'Zadnje plaćanje',
            value: '-',
            items: [
                {caption: "kupac", value: '-'},
                {caption: "dobavljač", value: '-'}
            ]
        }
    ]

    itemsZadnje: any = {
        kupac: '-', dobavljac: '-',
    }


    chartConfig = {
        type: 'bar',
        data: {
            labels: [
                "kupac", "dobavljač"
            ],
            datasets: []
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            },
            legend: {
                display: false
            },
            chartArea: {
                backgroundColor: 'rgba(251, 85, 85, 0.4)'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 5
                }
            // }
            // ,animation: {
            //     duration: 1,
            //     onComplete: function () {
            //         var chartInstance = this.chart,
            //             ctx = chartInstance.ctx;
            //             //Chart.defaults.global.defaultFontSize
            //         ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            //         ctx.textAlign = 'center';
            //         ctx.textBaseline = 'bottom';
        
            //         this.data.datasets.forEach(function (dataset, i) {
            //             var meta = chartInstance.controller.getDatasetMeta(i);
            //             meta.data.forEach(function (bar, index) {
            //                 //var data = dataset.data[index];                            
            //                 var data = dataset.label;
            //                 ctx.fillText(data, bar._model.x, bar._model.y - 5);
            //             });
            //         });
            //     }
            }
        }
    };

    constructor(public navCtrl : NavController, private provider: CrmFinancijePregledProvider, private partnerInfoProvider : PartnerinfoProvider,  private modalCtrl : ModalController, private numberFormatPipe: NumberFormatPipe)
    {
        super();
        this.provider.initialized = false;
        this.setData();
    }

    setData() {
        if (this.provider.partnerid == null)
            return;

        this
        .getData()
        .then(x => {
            this.dataFin = x;
            this.afterGetData();
            this.configChart();
            this.provider.initialized = true;
        })
        .catch(ex => this.global.logError(ex, true));
    }

    getData() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobCrmFinancijskiPregled",
                    "params": {
                        "action": "promet",
                        "partneriid": this.provider.partnerid
                    },
                    "tablename": "promet"
                }, {
                    "query": "spMobCrmFinancijskiPregled",
                    "params": {
                        "action": "ukupno",
                        "partneriid": this.provider.partnerid
                    },
                    "singlerow": true,
                    "tablename": "ukupno"
                }, {
                    "query": "spMobCrmFinancijskiPregled",
                    "params": {
                        "action": "ostalo",
                        "partneriid": this.provider.partnerid
                    },
                    "singlerow": true,
                    "tablename": "ostalo"
                }
            ]
        }
        return this
            .global
            .getData(dataDef, true);

    }

    afterGetData() {
        try
        {
            // let zadnjauplata = this.dataFin.ostalo.zadnjauplata;
            // if (zadnjauplata != null) 
            // {
            //     this.itemsZadnje[0].value = Moment(this.dataFin.ostalo.zadnjauplata).format("DD.MM.YYYY");
            // }
            // let zadnjeplacanje = this.dataFin.ostalo.zadnjeplacanje;
            // if (zadnjeplacanje != null)
            // {
            //     zadnjeplacanje = this.numberFormatPipe.transform(this.dataFin.ostalo.zadnjeplacanje, 2);
            //     this.itemsZadnje[1].value = zadnjeplacanje    
            // }
            let kupacZadnjaUplata = this.dataFin.promet[0].zadnjauplata;
            let dobavljacZadnjaUplata = this.dataFin.promet[1].zadnjauplata;

            let kupacZadnjePlacanje = this.dataFin.promet[0].zadnjeplacanje;
            let dobavljacZadnjePlacanje = this.dataFin.promet[1].zadnjeplacanje;
            
            if (kupacZadnjaUplata != null)
                kupacZadnjaUplata=Moment(kupacZadnjaUplata).format("DD.MM.YYYY");
            if (dobavljacZadnjaUplata != null)
                dobavljacZadnjaUplata=Moment(dobavljacZadnjaUplata).format("DD.MM.YYYY");
            if (kupacZadnjePlacanje != null)
                kupacZadnjePlacanje=this.numberFormatPipe.transform(kupacZadnjePlacanje, 2);
            if (dobavljacZadnjePlacanje != null) {
                dobavljacZadnjePlacanje=this.numberFormatPipe.transform(dobavljacZadnjePlacanje, 2);
            }
                

            let txtKupac: string = "-", txtDobavljac: string = "-";
            if (kupacZadnjaUplata != null && kupacZadnjePlacanje != null) {
                txtKupac = "<span class='datum'>" + kupacZadnjaUplata + "</span><br>" + kupacZadnjePlacanje;
            }
            if (dobavljacZadnjaUplata != null && dobavljacZadnjePlacanje != null) {
                txtDobavljac = "<span class='datum'>" + dobavljacZadnjaUplata + "</span><br>" + dobavljacZadnjePlacanje;
            }
            this.itemsZadnje.kupac = txtKupac;
            this.itemsZadnje.dobavljac = txtDobavljac;

        } catch (ex) {
            this.global.logError(ex, false);
        }
        

        
    }

    getUkupno(item) {
        if (item != null) {
            if (this.dataFin.ukupno != null) {
                var sum = this.dataFin.ukupno[0][item.name];
                return sum;
            }

        }
    }

    trazilicaAuto(action) {
        this.global.modal = this
            .modalCtrl
            .create('SharedTrazilicaAutocompletePage', {action: action});
        this.global.modal.onDidDismiss(data => {
            if (data != null) {
                if (action == "partner") {
                    this.provider.partnerid = data.id;
                    this.provider.partner = data.naziv;
                }
            }
            this.global.modal = null;
            this.setData();
        });
        this.global.modal.present();
    }

    getHeaderColor(i) {
        var color = "#rgba(54,75,94,0.8)";
        if (this.dataFin == null || this.dataFin.ukupno == null)
        {
            return color;
        }
        try
        {
            console.log(this.dataFin.ukupno.saldo);
            if (this.dataFin.ukupno.saldo < 0)
                return "#cc0000";
            else if (this.dataFin.ukupno.saldo > 0)
                return "darkgreen";
            else
                return "rgba(54,75,94,0.8)";
        } catch(ex) 
        {
            this.global.logError(ex, false)
        }
        return color;
    }

    configChart() {
        this.chartConfig.data.datasets = [];
        var godina: number = new Date().getFullYear();
        var proslaGodina: number = godina - 1;
        var columns = [
            {
                name: "promet",
                caption: godina.toString(),
                bgColor: 'rgba(200, 0, 0, 0.6)',
                borderColor: 'rgba(200, 0, 0, 1)'
            }, {
                name: "prometpgytod",
                caption: proslaGodina.toString(),
                bgColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)'
            }, {
                name: "prometpgy",
                caption: proslaGodina.toString() + " (cijela)",
                bgColor: 'rgba(54, 162, 235, 0.3)',
                borderColor: 'rgba(54, 162, 235, 0.8)'
            }
        ]
        console.log(columns);

        columns.forEach(el => {
            if (el.name != "prometpgy" || this.provider.prometProslaGodina == true) {
                var values = [];
                for (var _i = 0; _i < 2; _i++) {
                    values.push(this.dataFin.promet[_i][el.name]);
                }
                var chartData = {
                    label: el.caption,
                    data: values,
                    backgroundColor: el.bgColor,
                    borderColor: el.borderColor,
                    borderWidth: 1
                };
                this
                    .chartConfig
                    .data
                    .datasets
                    .push(chartData);
            }
        });

        if (this.provider.initialized == false) {
            this.barCanvas.nativeElement.style.backgroundColor = '#f7f7f7';
            this.barCanvas.nativeElement.height = 160;
            this.provider.barChart = new Chart(this.barCanvas.nativeElement, this.chartConfig)
        } else {
            this.provider.barChart.update();
        }


    }

    getDataChart() {}

    checkPrometProslaGodina(e) {
        this.provider.prometProslaGodina = e.checked;
        this.configChart();
    }

    uIzradi() {
        this.global.uIzradi();
    }

    openDetail(item) {
        let title = item.nazivgrupe;

        this
            .navCtrl
            .push('CrmFinancijePregledDetPage', {akcija: item.akcija, title: title});
    }

    openZadnje(akcija) //kupac, dobavljac
    {
        this
            .navCtrl
            .push('CrmFinancijePregledZadnjeDetPage', {akcija: akcija});
    }

    partnerInfo() {
        this
            .partnerInfoProvider
            .InitStorage(this.provider.partnerid);
        this.global.pushPage("PartnerTabsPage");
    }
}
