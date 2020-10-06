

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomLokacijaPage } from './lokacija';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    TerkomLokacijaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomLokacijaPage),
    ComponentsModule
  ],
})
export class TerkomLokacijaPageModule {}
