import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaTijekaNovcaFilter } from './filter';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    BiAnalizaTijekaNovcaFilter
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaTijekaNovcaFilter),
    ComponentsModule
  ],
  entryComponents: [
    BiAnalizaTijekaNovcaFilter
  ]
})
export class BiAnalizaTijekaNovcaFilterModule {}
