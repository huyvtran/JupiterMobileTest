import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproIzvjestajiStanjeSkladistaKarticaPage } from './kartica';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproIzvjestajiStanjeSkladistaKarticaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproIzvjestajiStanjeSkladistaKarticaPage),
    ComponentsModule
  ],
  exports: [
    TerproIzvjestajiStanjeSkladistaKarticaPage
  ]
})
export class TerproIzvjestajiStanjeSkladistaKarticaPageModule {}