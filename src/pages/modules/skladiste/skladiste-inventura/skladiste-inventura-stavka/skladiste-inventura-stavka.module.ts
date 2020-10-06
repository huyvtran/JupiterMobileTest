import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


import { ComponentsModule } from '../../../../../components/components.module';
import { SkladisteInventuraStavkaPage } from './skladiste-inventura-stavka';

@NgModule({
  declarations: [
    SkladisteInventuraStavkaPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladisteInventuraStavkaPage),
    ComponentsModule
  ],
  entryComponents: [
    SkladisteInventuraStavkaPage
  ]
})
export class SkladisteInventuraStavkaPageModule {}