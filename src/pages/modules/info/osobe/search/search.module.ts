import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OsobaSearchPage } from './search';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    OsobaSearchPage
  ],
  imports: [
    IonicPageModule.forChild(OsobaSearchPage),
    ComponentsModule
  ],
  entryComponents: [
    OsobaSearchPage
  ]
})
export class OsobaSearchPageModule {}
