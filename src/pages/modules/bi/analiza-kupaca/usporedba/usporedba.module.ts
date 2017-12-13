import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaKupacaUsporedba } from './usporedba';
import { ComponentsModule } from '../../../../../components/components.module';
import { BiAnalizaKupacaUsporedbaItem } from './usporedba-item/usporedba-item';

import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    BiAnalizaKupacaUsporedba,
    BiAnalizaKupacaUsporedbaItem
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaKupacaUsporedba),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    BiAnalizaKupacaUsporedba,
    BiAnalizaKupacaUsporedbaItem
  ]
})
export class BiAnalizaKupacaUsporedbaModule {}
