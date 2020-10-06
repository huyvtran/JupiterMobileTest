import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPZaprimanjeiotpremarobeOtvorenidokumentiPage } from './mp-zaprimanjeiotpremarobe-otvorenidokumenti';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPZaprimanjeiotpremarobeOtvorenidokumentiPage,
  ],
  imports: [
    IonicPageModule.forChild(MPZaprimanjeiotpremarobeOtvorenidokumentiPage),
    ComponentsModule
  ],
  exports: [
    MPZaprimanjeiotpremarobeOtvorenidokumentiPage
  ]
})
export class MPZaprimanjeiotpremarobeOtvorenidokumentiPageModule {}
