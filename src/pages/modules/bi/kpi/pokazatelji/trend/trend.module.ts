import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerKpiTrendPage } from './trend';

import { ComponentsModule } from '../../../../../../components/components.module';

@NgModule({
  declarations: [
    ManagerKpiTrendPage
  ],
  imports: [
    IonicPageModule.forChild(ManagerKpiTrendPage),
    ComponentsModule
  ],
  entryComponents: [
    ManagerKpiTrendPage
  ]
})
export class ManagerKpiTrendPageModule {}
