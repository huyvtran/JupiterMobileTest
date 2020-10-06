import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomObavijestDetailPage } from './obavijest-detail';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomObavijestDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomObavijestDetailPage),
    ComponentsModule
  ],
  exports: [
    TerkomObavijestDetailPage
  ]
})
export class TerkomObavijestDetailPageModule {}