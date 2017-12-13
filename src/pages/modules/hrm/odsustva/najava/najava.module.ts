import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmOdsustvaNajavaPage } from './najava';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmOdsustvaNajavaPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HrmOdsustvaNajavaPage),
  ],
})
export class HrmOdsustvaNajavaPageModule {}
