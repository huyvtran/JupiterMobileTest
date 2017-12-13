import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMUgovoriSDobavljacimaFilterFormaPage } from './filter-forma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    CRMUgovoriSDobavljacimaFilterFormaPage
  ]
})
export class CRMUgovoriSDobavljacimaFilterFormaPageModule {}
