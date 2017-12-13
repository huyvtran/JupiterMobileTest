import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedTrazilicaTreePage } from './trazilica-tree';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SharedTrazilicaTreePage,
  ],
  imports: [
    IonicPageModule.forChild(SharedTrazilicaTreePage),
    ComponentsModule
  ],
  exports: [
    SharedTrazilicaTreePage
  ]
})
export class SharedTrazilicaTreePageModule {}
