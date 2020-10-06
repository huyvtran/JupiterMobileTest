import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadniNaloziDodajKontroluPage } from './radni-nalozi-dodaj-kontrolu';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    RadniNaloziDodajKontroluPage,
  ],
  imports: [
    IonicPageModule.forChild(RadniNaloziDodajKontroluPage),
    ComponentsModule
  ],
})
export class RadniNaloziDodajKontroluPageModule {}
