import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMUgovoriSDobavljacimaListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaListaPage),
    ComponentsModule
  ],
  exports: [
    CRMUgovoriSDobavljacimaListaPage
  ]
})
export class CRMUgovoriSDobavljacimaListaPageModule {}
