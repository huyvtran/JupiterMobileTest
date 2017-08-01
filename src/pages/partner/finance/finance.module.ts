import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerFinancePage } from '../finance/finance';

import {ChartsModule} from 'ng2-charts/charts/charts';
import '../../../../node_modules/chart.js/dist/Chart.bundle.min.js'; 


@NgModule({
  declarations: [
    PartnerFinancePage
  ],
  imports: [
    IonicPageModule.forChild(PartnerFinancePage),
    ChartsModule
  ],
  entryComponents: [
    PartnerFinancePage
  ]
})
export class PartnerFinancePageModule {}
