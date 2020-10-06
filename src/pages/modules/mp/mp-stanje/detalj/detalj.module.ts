import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPStanjeDetaljPage } from './detalj';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPStanjeDetaljPage,
  ],
  imports: [
    IonicPageModule.forChild(MPStanjeDetaljPage),
    ComponentsModule
  ],
  exports: [
    MPStanjeDetaljPage
  ]
})
export class MPStanjeDetaljPageModule {}
