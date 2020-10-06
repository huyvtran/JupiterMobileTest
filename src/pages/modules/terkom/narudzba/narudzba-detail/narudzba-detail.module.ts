import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomNarudzbaDetailPage } from './narudzba-detail';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomNarudzbaDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomNarudzbaDetailPage),
    ComponentsModule
  ],
  exports: [
    TerkomNarudzbaDetailPage
  ]
})
export class NarudzbaDetailPageModule {}