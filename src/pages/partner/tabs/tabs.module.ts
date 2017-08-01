import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerTabsPage } from '../tabs/tabs';


@NgModule({
  declarations: [
    PartnerTabsPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerTabsPage)
  ],
  entryComponents: [
    PartnerTabsPage
  ]
})
export class PartnerTabsPageModule {}
