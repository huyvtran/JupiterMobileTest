import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaKupacaTabs } from './tabs';


@NgModule({
  declarations: [
    BiAnalizaKupacaTabs
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaKupacaTabs)
  ],
  entryComponents: [
    BiAnalizaKupacaTabs
  ]
})
export class BiAnalizaKupacaTabsModule {}
