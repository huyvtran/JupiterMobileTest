import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomKlasaRobePage } from './klasa-robe';
import { ComponentsModule } from '../../../../../components/components.module';

 
@NgModule({
  declarations: [
    TerkomKlasaRobePage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomKlasaRobePage),
    ComponentsModule
  ],
  exports: [
    TerkomKlasaRobePage
  ]
})
export class TerkomKlasaRobePageModule {}