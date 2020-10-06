import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerProKlasaRobePage } from './klasa-robe';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerProKlasaRobePage,
  ],
  imports: [
    IonicPageModule.forChild(TerProKlasaRobePage),
    ComponentsModule
  ],
  exports: [
    TerProKlasaRobePage
  ]
})
export class TerProKlasaRobePageModule {}