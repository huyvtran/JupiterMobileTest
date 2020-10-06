import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproNarudzbaDetailPage } from './narudzba-detail';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproNarudzbaDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproNarudzbaDetailPage),
    ComponentsModule
  ],
  exports: [
    TerproNarudzbaDetailPage
  ]
})
export class NarudzbaDetailPageModule {}