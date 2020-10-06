import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HrmImenikDetPage } from './imenik-det';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmImenikDetPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmImenikDetPage),
    ComponentsModule
  ],
  exports: [
    HrmImenikDetPage
  ]
})
export class HrmImenikDetPageModule {}
