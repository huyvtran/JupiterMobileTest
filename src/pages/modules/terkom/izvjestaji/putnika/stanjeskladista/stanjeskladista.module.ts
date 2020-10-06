import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../../../../../components/components.module';
import { TerkomIzvjestajiPutnikaStanjeSkladistaPage } from './stanjeskladista';

@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaStanjeSkladistaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaStanjeSkladistaPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaStanjeSkladistaPage
  ]
})
export class TerkomIzvjestajiPutnikaStanjeSkladistaPageModule {}
