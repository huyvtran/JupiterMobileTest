import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaProdajeFilter } from './filter';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    BiAnalizaProdajeFilter
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaProdajeFilter),
    ComponentsModule
  ],
  entryComponents: [
    BiAnalizaProdajeFilter
  ]
})
export class BiAnalizaProdajeFilterModule {}
