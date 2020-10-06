import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoModalPage } from './memo-modal';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MemoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoModalPage),
    ComponentsModule
  ],
})
export class MemoModalPageModule {}
