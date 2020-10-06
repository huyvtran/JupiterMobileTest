import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproObilazakAkcijaIzborPage } from './obilazak-akcija-izbor';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    TerproObilazakAkcijaIzborPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproObilazakAkcijaIzborPage),
    ComponentsModule
  ],
  exports: [
    TerproObilazakAkcijaIzborPage
  ]
})
export class TerproObilazakAkcijaIzborPageModule {}