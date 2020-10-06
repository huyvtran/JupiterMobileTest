

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomEvidencijaPosjetaPage } from './evidencija-posjeta';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    TerkomEvidencijaPosjetaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomEvidencijaPosjetaPage),
    ComponentsModule
  ],
})
export class TerkomEvidencijaPosjetaPageModule {}
