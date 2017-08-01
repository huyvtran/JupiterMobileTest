import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerKpiPokazeteljiPage } from '../pokazatelji/pokazatelji';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    ManagerKpiPokazeteljiPage
  ],
  imports: [
    IonicPageModule.forChild(ManagerKpiPokazeteljiPage),
    ComponentsModule
  ],
  entryComponents: [
    ManagerKpiPokazeteljiPage
  ]
})
export class ManagerKpiPokazeteljiPageModule {}
