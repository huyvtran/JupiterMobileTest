import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaNabavaPage } from './nabava';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    RobaNabavaPage
  ],
  imports: [
    IonicPageModule.forChild(RobaNabavaPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    RobaNabavaPage
  ]
})
export class RobaNabavaPageModule {}
