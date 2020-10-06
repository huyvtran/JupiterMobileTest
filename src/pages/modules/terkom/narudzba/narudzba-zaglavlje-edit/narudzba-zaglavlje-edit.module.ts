import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomNarudzbaZaglavljeEditPage } from './narudzba-zaglavlje-edit';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomNarudzbaZaglavljeEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomNarudzbaZaglavljeEditPage),
    ComponentsModule
  ],
  exports: [
    TerkomNarudzbaZaglavljeEditPage
  ]
})
export class TerkomNarudzbaZaglavljeEditPageModule {}