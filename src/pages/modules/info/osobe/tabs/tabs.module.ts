import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OsobeTabsPage } from './tabs';


@NgModule({
  declarations: [
    OsobeTabsPage
  ],
  imports: [
    IonicPageModule.forChild(OsobeTabsPage)
  ],
  entryComponents: [
    OsobeTabsPage
  ]
})
export class OsobeTabsPageModule {}
