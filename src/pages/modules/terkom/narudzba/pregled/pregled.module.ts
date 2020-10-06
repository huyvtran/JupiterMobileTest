import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomNarudzbaPregledPage } from './pregled';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomNarudzbaPregledPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomNarudzbaPregledPage),
    ComponentsModule
  ],
  exports: [
    TerkomNarudzbaPregledPage
  ]
})
export class PregledPageModule {}