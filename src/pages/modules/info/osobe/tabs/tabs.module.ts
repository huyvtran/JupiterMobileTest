import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OsobaTabsPage } from './tabs';


@NgModule({
  declarations: [
    OsobaTabsPage
  ],
  imports: [
    IonicPageModule.forChild(OsobaTabsPage)
  ],
  entryComponents: [
    OsobaTabsPage
  ]
})
export class RobaTabsPageModule {}
