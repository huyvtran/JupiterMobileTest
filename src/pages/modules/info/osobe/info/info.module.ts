import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OsobaInfoPage } from './info';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    OsobaInfoPage
  ],
  imports: [
    IonicPageModule.forChild(OsobaInfoPage),
    ComponentsModule
  ],
  entryComponents: [
    OsobaInfoPage
  ]
})
export class OsobaInfoPageModule {}
