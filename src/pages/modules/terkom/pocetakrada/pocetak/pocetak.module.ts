import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomPocetakRadaPage } from './pocetak';

import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomPocetakRadaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomPocetakRadaPage),
    ComponentsModule
  ],
  exports: [
    TerkomPocetakRadaPage
  ]
})
export class TerkomDashboardHomePageModule {}