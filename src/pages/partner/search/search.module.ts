import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerSearchPage } from '../search/search';


@NgModule({
  declarations: [
    PartnerSearchPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerSearchPage)
  ],
  entryComponents: [
    PartnerSearchPage
  ]
})
export class PartnerSearchPageModule {}
