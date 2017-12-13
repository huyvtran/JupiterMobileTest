import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaNabaveUsporedba } from './usporedba';
import { ComponentsModule } from '../../../../../components/components.module';
import { BiAnalizaNabaveUsporedbaItem } from './usporedba-item/usporedba-item';

import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    BiAnalizaNabaveUsporedba,
    BiAnalizaNabaveUsporedbaItem
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaNabaveUsporedba),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    BiAnalizaNabaveUsporedba,
    BiAnalizaNabaveUsporedbaItem
  ]
})
export class BiAnalizaNabaveUsporedbaModule {}
