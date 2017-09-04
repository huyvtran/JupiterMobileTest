import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerInfoPage } from '../info/info';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    PartnerInfoPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerInfoPage),
    ComponentsModule
  ],
  entryComponents: [
    PartnerInfoPage
  ]
})
export class PartnerInfoPageModule {}
