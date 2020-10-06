import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomObilazakAkcijaIzborPage } from './obilazak-akcija-izbor';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    TerkomObilazakAkcijaIzborPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomObilazakAkcijaIzborPage),
    ComponentsModule
  ],
  exports: [
    TerkomObilazakAkcijaIzborPage
  ]
})
export class ObilazakAkcijaIzborPageModule {}