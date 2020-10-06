import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Inventura_ListatrgovinaPage } from './inventura_listatrgovina';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    Inventura_ListatrgovinaPage,
  ],
  imports: [
    IonicPageModule.forChild(Inventura_ListatrgovinaPage),
    ComponentsModule
  ],
  exports: [
    Inventura_ListatrgovinaPage
  ]
})
export class Inventura_ListatrgovinaPageModule {}
