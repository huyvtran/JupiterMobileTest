import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RobaTabsPage } from './tabs';


@NgModule({
  declarations: [
    RobaTabsPage
  ],
  imports: [
    IonicPageModule.forChild(RobaTabsPage)
  ],
  entryComponents: [
    RobaTabsPage
  ]
})
export class RobaTabsPageModule {}
