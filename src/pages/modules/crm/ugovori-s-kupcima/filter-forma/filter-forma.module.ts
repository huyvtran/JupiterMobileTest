import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMPregledUgovoraFilterFormaPage } from './filter-forma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMPregledUgovoraFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    CRMPregledUgovoraFilterFormaPage
  ]
})
export class CRMPregledUgovoraFilterFormaPageModule {}
