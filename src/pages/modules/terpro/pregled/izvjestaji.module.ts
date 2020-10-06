

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproIzvjestajiPage } from './izvjestaji';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    TerproIzvjestajiPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproIzvjestajiPage),
    ComponentsModule
  ],
})
export class TerproIzvjestajiPageModule {}
