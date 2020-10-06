

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaPage } from './izvjestaji';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaPage),
    ComponentsModule
  ],
})
export class TerkomIzvjestajiPutnikaPageModule {}
