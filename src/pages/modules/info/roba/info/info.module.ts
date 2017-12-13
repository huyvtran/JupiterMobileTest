import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaInfoPage } from './info';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    RobaInfoPage
  ],
  imports: [
    IonicPageModule.forChild(RobaInfoPage),
    ComponentsModule
  ],
  entryComponents: [
    RobaInfoPage
  ]
})
export class RobaInfoPageModule {}
