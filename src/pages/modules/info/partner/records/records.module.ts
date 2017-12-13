import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerRecordsPage } from './records';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    PartnerRecordsPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerRecordsPage),
    ComponentsModule
  ],
  entryComponents: [
    PartnerRecordsPage
  ]
})
export class PartnerRecordsPageModule {}
