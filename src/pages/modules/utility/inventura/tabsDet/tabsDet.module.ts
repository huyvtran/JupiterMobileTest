import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraTabsDetPage } from '../tabsDet/tabsDet';


@NgModule({
  declarations: [
    UtilityInventuraTabsDetPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraTabsDetPage)
  ],
  entryComponents: [
    UtilityInventuraTabsDetPage
  ]
})
export class UtilityInventuraTabsDetPageModule {}
