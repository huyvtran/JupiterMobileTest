import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMBiljeskeFilterFormaPage } from './filter-forma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMBiljeskeFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMBiljeskeFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    CRMBiljeskeFilterFormaPage
  ]
})
export class CRMBiljeskeFilterFormaPageModule {}
