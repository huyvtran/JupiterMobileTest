import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMCjenikFilterFormaPage } from './filter-forma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMCjenikFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMCjenikFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    CRMCjenikFilterFormaPage
  ]
})
export class CRMCjenikFilterFormaPageModule {}
