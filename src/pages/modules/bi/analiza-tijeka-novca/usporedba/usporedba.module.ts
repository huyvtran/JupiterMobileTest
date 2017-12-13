import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaTijekaNovcaUsporedba } from './usporedba';
import { ComponentsModule } from '../../../../../components/components.module';
import { BiAnalizaTijekaNovcaUsporedbaItem } from './usporedba-item/usporedba-item';

import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    BiAnalizaTijekaNovcaUsporedba,
    BiAnalizaTijekaNovcaUsporedbaItem
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaTijekaNovcaUsporedba),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    BiAnalizaTijekaNovcaUsporedba,
    BiAnalizaTijekaNovcaUsporedbaItem
  ]
})
export class BiAnalizaTijekaNovcaUsporedbaModule {}
