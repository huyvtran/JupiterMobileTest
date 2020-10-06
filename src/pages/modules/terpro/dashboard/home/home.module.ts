import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproDashboardHomePage } from './home';

import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproDashboardHomePage,
  ],
  imports: [
    IonicPageModule.forChild(TerproDashboardHomePage),
    ComponentsModule
  ],
  exports: [
    TerproDashboardHomePage
  ]
})
export class TerproDashboardHomePageModule {}