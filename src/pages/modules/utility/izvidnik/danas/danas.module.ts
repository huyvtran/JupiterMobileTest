import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DanasPage } from './danas';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    DanasPage
  ],
  imports: [
    IonicPageModule.forChild(DanasPage),
    ComponentsModule
  ],
})
export class DanasPageModule {}
