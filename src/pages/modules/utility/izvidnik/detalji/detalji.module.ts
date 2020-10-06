import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetaljiPage } from './detalji';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    DetaljiPage,
  ],
  imports: [
    IonicPageModule.forChild(DetaljiPage),
    ComponentsModule
  ],
})
export class DetaljiPageModule {}
