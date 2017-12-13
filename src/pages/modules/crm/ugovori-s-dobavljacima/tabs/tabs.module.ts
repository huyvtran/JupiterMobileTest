import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMUgovoriSDobavljacimaTabsPage } from '../tabs/tabs';


@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaTabsPage
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaTabsPage)
  ],
  entryComponents: [
    CRMUgovoriSDobavljacimaTabsPage
  ]
})
export class CRMUgovoriSDobavljacimaTabsPageModule {}
