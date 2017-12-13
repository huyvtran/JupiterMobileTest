import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerKpiPokazeteljiPage } from '../pokazatelji/pokazatelji';

import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    ManagerKpiPokazeteljiPage
  ],
  imports: [
    IonicPageModule.forChild(ManagerKpiPokazeteljiPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    ManagerKpiPokazeteljiPage
  ]
})
export class ManagerKpiPokazeteljiPageModule {}
