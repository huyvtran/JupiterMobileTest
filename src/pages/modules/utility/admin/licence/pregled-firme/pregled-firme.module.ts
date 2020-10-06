import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AdminPregledFirmePage } from './pregled-firme';
import { ComponentsModule } from '../../../../../../components/components.module';
import { PipesModule } from '../../../../../../pipes/pipes.module';
@NgModule({
  declarations: [
    AdminPregledFirmePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminPregledFirmePage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    AdminPregledFirmePage
  ]
})
export class AdminPregledFirmePageModule {}
