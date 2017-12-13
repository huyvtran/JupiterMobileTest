import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmOdsustvaPregledPage } from './pregled';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    HrmOdsustvaPregledPage
  ],
  imports: [
    IonicPageModule.forChild(HrmOdsustvaPregledPage),
    ComponentsModule
  ],
  entryComponents: [
    HrmOdsustvaPregledPage
  ]
})
export class HrmOdsustvaPregledPageModule {}
