import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerLocationDetPage } from '../location-det/location-det';


@NgModule({
  declarations: [
    PartnerLocationDetPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerLocationDetPage)
  ],
  entryComponents: [
    PartnerLocationDetPage
  ]
})
export class PartnerLocationDetPageModule {}
