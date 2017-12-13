import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMInsertEditPage } from './insertedit';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMInsertEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMInsertEditPage),
    ComponentsModule
  ],
  exports: [
    CRMInsertEditPage
  ]
})
export class CRMInsertEditPageModule {}
