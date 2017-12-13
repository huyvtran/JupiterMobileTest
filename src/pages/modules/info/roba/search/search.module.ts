import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaSearchPage } from './search';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    RobaSearchPage
  ],
  imports: [
    IonicPageModule.forChild(RobaSearchPage),
    ComponentsModule
  ],
  entryComponents: [
    RobaSearchPage
  ]
})
export class RobaSearchPageModule {}
