import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproNarudzbaPregledPage } from './pregled';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproNarudzbaPregledPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproNarudzbaPregledPage),
    ComponentsModule
  ],
  exports: [
    TerproNarudzbaPregledPage
  ]
})
export class TerproNarudzbaPregledPageModule {}