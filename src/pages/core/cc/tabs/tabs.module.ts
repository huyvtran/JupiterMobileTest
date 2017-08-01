import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcTabsPage } from '../tabs/tabs';


@NgModule({
  declarations: [
    CoreCcTabsPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcTabsPage)
  ],
  entryComponents: [
    CoreCcTabsPage
  ]
})
export class CoreCcTabsPageModule {}
