import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladisteInventuraPage } from './skladiste-inventura';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    SkladisteInventuraPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladisteInventuraPage),
    ComponentsModule
  ],
  entryComponents: [
    SkladisteInventuraPage
  ]
})
export class SkladisteInventuraPageModule {}