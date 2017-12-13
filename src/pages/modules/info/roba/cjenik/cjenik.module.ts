import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaCjenikPage } from './cjenik';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    RobaCjenikPage
  ],
  imports: [
    IonicPageModule.forChild(RobaCjenikPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    RobaCjenikPage
  ]
})
export class RobaCjenikPageModule {}
