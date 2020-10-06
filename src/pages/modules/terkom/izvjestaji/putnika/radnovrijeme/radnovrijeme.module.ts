import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaRadnoVrijemePage } from './radnovrijeme';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaRadnoVrijemePage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaRadnoVrijemePage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaRadnoVrijemePage
  ]
})
export class TerkomIzvjestajiPutnikaRadnoVrijemePageModule {}