import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproObilazakAkcijaPage } from './obilazak-akcija';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproObilazakAkcijaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproObilazakAkcijaPage),
    ComponentsModule
  ],
  exports: [
    TerproObilazakAkcijaPage
  ]
})
export class TerproObilazakAkcijaPageModule {}