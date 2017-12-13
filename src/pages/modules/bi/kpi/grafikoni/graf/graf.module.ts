import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerKpiGrafPage } from './graf';

import { ComponentsModule } from '../../../../../../components/components.module';

@NgModule({
  declarations: [
    ManagerKpiGrafPage
  ],
  imports: [
    IonicPageModule.forChild(ManagerKpiGrafPage),
    ComponentsModule
  ],
  entryComponents: [
    ManagerKpiGrafPage
  ]
})
export class ManagerKpiGrafPageModule {}
