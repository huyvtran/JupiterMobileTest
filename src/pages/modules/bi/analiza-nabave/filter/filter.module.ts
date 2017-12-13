import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaNabaveFilter } from './filter';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    BiAnalizaNabaveFilter
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaNabaveFilter),
    ComponentsModule
  ],
  entryComponents: [
    BiAnalizaNabaveFilter
  ]
})
export class BiAnalizaNabaveFilterModule {}
