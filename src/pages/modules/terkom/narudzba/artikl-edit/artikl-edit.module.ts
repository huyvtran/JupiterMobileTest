import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomArtiklEditPage } from './artikl-edit';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomArtiklEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomArtiklEditPage),
    ComponentsModule
  ],
  exports: [
    TerkomArtiklEditPage
  ]
})
export class TerkomArtiklEditPageModule {}