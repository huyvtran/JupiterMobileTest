import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmImenikPage } from './imenik';
import { PipesModule } from '../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    HrmImenikPage
  ],
  imports: [
    IonicPageModule.forChild(HrmImenikPage),
    PipesModule,
    ComponentsModule
  ],
  entryComponents: [
    HrmImenikPage
  ]
})
export class HrmImenikPageModule {}
