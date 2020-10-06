import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AdminPregledLicenciPage } from './pregled-licenci';
import { ComponentsModule } from '../../../../../../components/components.module';
import { PipesModule } from '../../../../../../pipes/pipes.module';
@NgModule({
  declarations: [
    AdminPregledLicenciPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminPregledLicenciPage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    AdminPregledLicenciPage
  ]
})
export class AdminPregledLicenciPageModule {}
