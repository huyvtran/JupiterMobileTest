import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladisteSearchModalPage } from './skladiste-search-modal';

import { ComponentsModule } from '../../../../../components/components.module';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SkladisteSearchModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladisteSearchModalPage),
    ComponentsModule,
    PipesModule
  ],
})
export class SkladisteSearchModalPageModule {}
