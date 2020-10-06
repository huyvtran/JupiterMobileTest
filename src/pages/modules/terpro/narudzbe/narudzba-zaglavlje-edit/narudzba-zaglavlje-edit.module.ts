import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproNarudzbaZaglavljeEditPage } from './narudzba-zaglavlje-edit';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproNarudzbaZaglavljeEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproNarudzbaZaglavljeEditPage),
    ComponentsModule
  ],
  exports: [
    TerproNarudzbaZaglavljeEditPage
  ]
})
export class TerproNarudzbaZaglavljeEditPageModule {}