import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerInfoPage } from '../info/info';


@NgModule({
  declarations: [
    PartnerInfoPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerInfoPage)
  ],
  entryComponents: [
    PartnerInfoPage
  ]
})
export class PartnerInfoPageModule {}
