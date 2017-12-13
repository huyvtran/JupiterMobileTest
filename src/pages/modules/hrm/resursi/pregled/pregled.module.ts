import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { HrmResursiPregledPage } from './pregled';

import { ComponentsModule } from '../../../../../components/components.module';
import { HrmResursiZauzeceItemComponent } from './zauzece-item/zauzece-item';


@NgModule({
  declarations: [
    HrmResursiPregledPage,
    HrmResursiZauzeceItemComponent
  ],
  imports: [
    IonicPageModule.forChild(HrmResursiPregledPage),
    ComponentsModule,
    IonicModule
  ],
  exports: [
    HrmResursiZauzeceItemComponent
  ]
})
export class HrmResursiPregledPageModule {}
