import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerSearchDetPage } from './search-det';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    PartnerSearchDetPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerSearchDetPage),
    ComponentsModule
  ],
  entryComponents: [
    PartnerSearchDetPage
  ]
})
export class PartnerSearchDetPageModule {}
