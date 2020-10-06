import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraImovinaPronadjenaPage } from './imovinaPronadjena';

import { ComponentsModule } from '../../../../../components/components.module';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    UtilityInventuraImovinaPronadjenaPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraImovinaPronadjenaPage),
    PipesModule,
    ComponentsModule
  ],
  entryComponents: [
    UtilityInventuraImovinaPronadjenaPage
  ]
})
export class UtilityInventuraImovinaPronadjenaPageModule {}
