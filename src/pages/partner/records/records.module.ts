import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerRecordsPage } from '../records/records';


@NgModule({
  declarations: [
    PartnerRecordsPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerRecordsPage)
  ],
  entryComponents: [
    PartnerRecordsPage
  ]
})
export class PartnerRecordsPageModule {}
