import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IzvidnikArkodiPage } from './arkodi';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    IzvidnikArkodiPage
  ],
  imports: [
    IonicPageModule.forChild(IzvidnikArkodiPage),
    PipesModule,
    ComponentsModule
  ],
  entryComponents: [
    IzvidnikArkodiPage
  ]
})
export class IzvidnikArkodiPageModule {}
