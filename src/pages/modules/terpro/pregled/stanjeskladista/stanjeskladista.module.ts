import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproIzvjestajiStanjeSkladistaPage } from './stanjeskladista';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproIzvjestajiStanjeSkladistaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproIzvjestajiStanjeSkladistaPage),
    ComponentsModule
  ],
  exports: [
    TerproIzvjestajiStanjeSkladistaPage
  ]
})
export class TerproIzvjestajiStanjeSkladistaPageModule {}