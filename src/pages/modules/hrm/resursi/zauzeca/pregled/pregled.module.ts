import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmResursiZauzecaPregledPage } from './pregled';

import { ComponentsModule } from '../../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmResursiZauzecaPregledPage
  ],
  imports: [
    IonicPageModule.forChild(HrmResursiZauzecaPregledPage),
    ComponentsModule
    
  ],
  exports: [
    HrmResursiZauzecaPregledPage
  ]
})
export class HrmResursiZauzecaPregledPageModule {}
