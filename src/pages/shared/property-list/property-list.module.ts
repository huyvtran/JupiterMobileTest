import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedPropertyListPage } from './property-list';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SharedPropertyListPage,
  ],
  imports: [
    IonicPageModule.forChild(SharedPropertyListPage),
    ComponentsModule
  ],
  exports: [
    SharedPropertyListPage
  ]
})
export class SharedPropertyListPageModule {}
