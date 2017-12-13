import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmResursiPregledFilterPage } from './pregled-filter';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmResursiPregledFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmResursiPregledFilterPage),
    ComponentsModule
  ],
})
export class HrmResursiPregledFilterPageModule {}
