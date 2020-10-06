import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RezultatiKontrolePage } from './rezultati-kontrole';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    RezultatiKontrolePage,
  ],
  imports: [
    IonicPageModule.forChild(RezultatiKontrolePage),
    ComponentsModule
  ],
})
export class RezultatiKontrolePageModule {}
