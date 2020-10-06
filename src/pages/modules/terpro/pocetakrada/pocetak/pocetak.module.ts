import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproPocetakRadaPage } from './pocetak';

import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproPocetakRadaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproPocetakRadaPage),
    ComponentsModule
  ],
  exports: [
    TerproPocetakRadaPage
  ]
})
export class TerproPocetakRadaPageModule {}