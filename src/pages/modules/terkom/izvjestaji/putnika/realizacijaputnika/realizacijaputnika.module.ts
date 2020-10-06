import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaRealizacijaPutnikaPage } from './realizacijaputnika';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaRealizacijaPutnikaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaRealizacijaPutnikaPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaRealizacijaPutnikaPage
  ]
})
export class TerkomIzvjestajiPutnikaRealizacijaPutnikaPageModule {}