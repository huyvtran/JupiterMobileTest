import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmGodisnjiEvidencijaPage } from './evidencija';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmGodisnjiEvidencijaPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmGodisnjiEvidencijaPage),
    ComponentsModule
  ],
})
export class HrmGodisnjiEvidencijaPagePageModule {}
