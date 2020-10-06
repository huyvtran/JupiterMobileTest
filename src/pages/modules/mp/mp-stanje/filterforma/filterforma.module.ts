import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPStanjeFilterFormaPage } from './filterforma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPStanjeFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPStanjeFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    MPStanjeFilterFormaPage
  ]
})
export class MPStanjeFilterFormaPageModule {}
