import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerFinancePage } from '../finance/finance';

import {ChartsModule} from 'ng2-charts/charts/charts';
import '../../../../node_modules/chart.js/dist/Chart.bundle.min.js'; 

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    PartnerFinancePage
  ],
  imports: [
    IonicPageModule.forChild(PartnerFinancePage),
    ChartsModule,
    ComponentsModule
  ],
  entryComponents: [
    PartnerFinancePage
  ]
})
export class PartnerFinancePageModule {}
