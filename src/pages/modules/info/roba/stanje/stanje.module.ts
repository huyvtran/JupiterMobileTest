import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaStanjePage } from './stanje';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    RobaStanjePage
  ],
  imports: [
    IonicPageModule.forChild(RobaStanjePage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    RobaStanjePage
  ]
})
export class RobaStanjePageModule {}
