import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaKomStanjePage } from './kom-stanje';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    RobaKomStanjePage
  ],
  imports: [
    IonicPageModule.forChild(RobaKomStanjePage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    RobaKomStanjePage
  ]
})
export class RobaKomStanjePageModule {}
