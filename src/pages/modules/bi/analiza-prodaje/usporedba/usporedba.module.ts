import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaProdajeUsporedba } from './usporedba';
import { ComponentsModule } from '../../../../../components/components.module';
import { BiAnalizaProdajeUsporedbaItem } from './usporedba-item/usporedba-item';

import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    BiAnalizaProdajeUsporedba,
    BiAnalizaProdajeUsporedbaItem
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaProdajeUsporedba),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    BiAnalizaProdajeUsporedba,
    BiAnalizaProdajeUsporedbaItem
  ]
})
export class BiAnalizaProdajeUsporedbaModule {}
