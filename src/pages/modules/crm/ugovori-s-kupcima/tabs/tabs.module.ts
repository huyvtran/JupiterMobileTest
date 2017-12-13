import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMPregledUgovoraTabsPage } from '../tabs/tabs';


@NgModule({
  declarations: [
    CRMPregledUgovoraTabsPage
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraTabsPage)
  ],
  entryComponents: [
    CRMPregledUgovoraTabsPage
  ]
})
export class CRMPregledUgovoraTabsPageModule {}
