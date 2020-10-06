import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproArtiklEditPage } from './artikl-edit';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproArtiklEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproArtiklEditPage),
    ComponentsModule
  ],
  exports: [
    TerproArtiklEditPage
  ]
})
export class TerproArtiklEditPageModule {}