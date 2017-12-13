import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiAnalizaTijekaNovcaTabs } from './tabs';


@NgModule({
  declarations: [
    BiAnalizaTijekaNovcaTabs
  ],
  imports: [
    IonicPageModule.forChild(BiAnalizaTijekaNovcaTabs)
  ],
  entryComponents: [
    BiAnalizaTijekaNovcaTabs
  ]
})
export class BiAnalizaTijekaNovcaTabsModule {}
