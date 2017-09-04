import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerLocationDetPage } from '../location-det/location-det';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    PartnerLocationDetPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerLocationDetPage),
    ComponentsModule
  ],
  entryComponents: [
    PartnerLocationDetPage
  ]
})
export class PartnerLocationDetPageModule {}
