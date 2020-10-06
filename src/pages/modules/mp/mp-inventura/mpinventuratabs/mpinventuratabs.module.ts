import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MPInventuraTabsPage } from '../mpinventuratabs/mpinventuratabs';


@NgModule({
  declarations: [
    MPInventuraTabsPage
  ],
  imports: [
    IonicPageModule.forChild(MPInventuraTabsPage)
  ],
  entryComponents: [
    MPInventuraTabsPage
  ]
})
export class MPInventuraTabsPageModule {}
