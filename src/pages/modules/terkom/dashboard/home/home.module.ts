import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomDashboardHomePage } from './home';

import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomDashboardHomePage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomDashboardHomePage),
    ComponentsModule
  ],
  exports: [
    TerkomDashboardHomePage
  ]
})
export class TerkomDashboardHomePageModule {}