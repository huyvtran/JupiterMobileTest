import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaKupacaFilter } from './filter';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    BiAnalizaKupacaFilter
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaKupacaFilter),
    ComponentsModule
  ],
  entryComponents: [
    BiAnalizaKupacaFilter
  ]
})
export class BiAnalizaKupacaFilterModule {}
