import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPStanjeListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPStanjeListaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPStanjeListaPage),
    ComponentsModule
  ],
  exports: [
    MPStanjeListaPage
  ]
})
export class MPStanjeListaPageModule {}
