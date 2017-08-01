import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerKpiGrafikoniPage } from '../grafikoni/grafikoni';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    ManagerKpiGrafikoniPage
  ],
  imports: [
    IonicPageModule.forChild(ManagerKpiGrafikoniPage),
    ComponentsModule
  ],
  entryComponents: [
    ManagerKpiGrafikoniPage
  ]
})
export class ManagerKpiGrafikoniPageModule {}
