import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { GlobalProvider } from '../../../providers/global-provider';
import { PartnerinfoProvider } from '../../../providers/partnerinfo-provider';


@IonicPage()
@Component({
  selector: 'page-partner-finance',
  templateUrl: 'finance.html'
})
export class PartnerFinancePage {
  chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
 
  chartLabels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  chartType: string = 'line';
  chartLegend: boolean = true;
 
  chartData: any[] = [
      { data: [150000, 80123, 45125, 100000, 24234, 10000, 180500, 23234, 56666, 123334, 10000, 80000], label: '2012' },
      { data: [28000, 39632, 12544, 80254, 23444, 56777, 78888, 12000,90000,15000, 80000, 100000], label: '2013' },
      { data: [11000, 78525, 12258, 95000, 100000, 90000, 70000, 80000, 50000, 35000, 60000, 65000], label: '2014' },
      { data: [50000, 12589, 78541, 120000, 56000, 89000, 95000, 120000, 80000, 60000, 125000, 100000], label: '2015' },
      { data: [12550, 99000, 12535, 124500, 40000, 60000, 80000, 75000, 50500, 92000, 50000, 45000], label: '2016' }
  ];



  constructor(public navCtrl: NavController, private partner: PartnerinfoProvider, private globalProvider: GlobalProvider) {

  }

}
