import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmResursiZauzecaFilterPage } from './filter';

import { ComponentsModule } from '../../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmResursiZauzecaFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmResursiZauzecaFilterPage),
    ComponentsModule
  ],
})
export class HrmResursiZauzecaFilterPageModule {}
