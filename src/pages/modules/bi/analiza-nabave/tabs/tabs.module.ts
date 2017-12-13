import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaNabaveTabs } from './tabs';


@NgModule({
  declarations: [
    BiAnalizaNabaveTabs
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaNabaveTabs)
  ],
  entryComponents: [
    BiAnalizaNabaveTabs
  ]
})
export class BiAnalizaNabaveTabsModule {}
