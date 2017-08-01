import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerSearchDetPage } from '../search-det/search-det';


@NgModule({
  declarations: [
    PartnerSearchDetPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerSearchDetPage)
  ],
  entryComponents: [
    PartnerSearchDetPage
  ]
})
export class PartnerSearchDetPageModule {}
