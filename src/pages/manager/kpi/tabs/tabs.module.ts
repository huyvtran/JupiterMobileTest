import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerKpiTabsPage } from '../tabs/tabs';


@NgModule({
  declarations: [
    ManagerKpiTabsPage
  ],
  imports: [
    IonicPageModule.forChild(ManagerKpiTabsPage)
  ],
  entryComponents: [
    ManagerKpiTabsPage
  ]
})
export class ManagerKpiTabsPageModule {}
