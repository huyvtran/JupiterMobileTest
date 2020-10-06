import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaDnevnoPage } from './dnevno';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaDnevnoPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaDnevnoPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaDnevnoPage
  ]
})
export class TerkomIzvjestajiPutnikaDnevnoPageModule {}

