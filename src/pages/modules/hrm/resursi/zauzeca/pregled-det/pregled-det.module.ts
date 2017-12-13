import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmResursiZauzecaPregledDetPage } from './pregled-det';

import { ComponentsModule } from '../../../../../../components/components.module';


@NgModule({
  declarations: [
    HrmResursiZauzecaPregledDetPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmResursiZauzecaPregledDetPage),
    ComponentsModule
  ],
})
export class HrmResursiZauzecaPregledDetPageModule {}
