import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OsobaSearchDetPage } from './search-det';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    OsobaSearchDetPage
  ],
  imports: [
    IonicPageModule.forChild(OsobaSearchDetPage),
    ComponentsModule
  ],
  entryComponents: [
    OsobaSearchDetPage
  ]
})
export class OsobaSearchDetPageModule {}
