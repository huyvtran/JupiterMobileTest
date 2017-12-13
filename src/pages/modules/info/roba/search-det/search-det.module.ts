import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaSearchDetPage } from './search-det';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    RobaSearchDetPage
  ],
  imports: [
    IonicPageModule.forChild(RobaSearchDetPage),
    ComponentsModule
  ],
  entryComponents: [
    RobaSearchDetPage
  ]
})
export class RobaSearchDetPageModule {}
