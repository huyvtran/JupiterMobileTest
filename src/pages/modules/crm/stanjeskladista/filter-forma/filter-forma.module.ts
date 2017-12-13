import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMStanjeSkladistaFilterFormaPage } from './filter-forma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMStanjeSkladistaFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMStanjeSkladistaFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    CRMStanjeSkladistaFilterFormaPage
  ]
})
export class CRMStanjeSkladistaFilterFormaPageModule {}
