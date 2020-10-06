import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraImovinaOcekivanaPage } from './imovinaOcekivana';

import { ComponentsModule } from '../../../../../components/components.module';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    UtilityInventuraImovinaOcekivanaPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraImovinaOcekivanaPage),
    PipesModule,
    ComponentsModule
  ],
  entryComponents: [
    UtilityInventuraImovinaOcekivanaPage
  ]
})
export class UtilityInventuraImovinaOcekivanaPageModule {}
