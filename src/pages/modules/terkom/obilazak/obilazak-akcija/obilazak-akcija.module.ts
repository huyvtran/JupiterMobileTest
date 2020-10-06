import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomObilazakAkcijaPage } from './obilazak-akcija';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomObilazakAkcijaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomObilazakAkcijaPage),
    ComponentsModule
  ],
  exports: [
    TerkomObilazakAkcijaPage
  ]
})
export class TerkomObilazakAkcijaPageModule {}