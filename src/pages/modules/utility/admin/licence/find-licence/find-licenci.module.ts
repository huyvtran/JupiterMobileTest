import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AdminFindLicencePage } from './find-licenci';
import { ComponentsModule } from '../../../../../../components/components.module';
import { PipesModule } from '../../../../../../pipes/pipes.module';
@NgModule({
  declarations: [
    AdminFindLicencePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminFindLicencePage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    AdminFindLicencePage
  ]
})
export class AdminFindLicencePageModule {}
