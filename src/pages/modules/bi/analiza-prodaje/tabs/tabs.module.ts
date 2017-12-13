import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaProdajeTabs } from './tabs';


@NgModule({
  declarations: [
    BiAnalizaProdajeTabs
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaProdajeTabs)
  ],
  entryComponents: [
    BiAnalizaProdajeTabs
  ]
})
export class BiAnalizaProdajeTabsModule {}
