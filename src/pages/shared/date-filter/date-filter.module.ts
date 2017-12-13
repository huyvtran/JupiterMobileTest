import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedDateFilterPage } from './date-filter';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SharedDateFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(SharedDateFilterPage),
    ComponentsModule
  ],
  exports: [
    SharedDateFilterPage
  ]
})
export class SharedDateFilterPageModule {}
