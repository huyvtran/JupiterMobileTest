import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmOdsustvaPregledDetailPage } from './pregled-detail';

import { ComponentsModule } from '../../../../../../components/components.module';


@NgModule({
  declarations: [
    HrmOdsustvaPregledDetailPage
  ],
  imports: [
    IonicPageModule.forChild(HrmOdsustvaPregledDetailPage),
    ComponentsModule
  ],
  entryComponents: [
    HrmOdsustvaPregledDetailPage
  ]
})
export class HrmOdsustvaPregledDetailPageModule {}
