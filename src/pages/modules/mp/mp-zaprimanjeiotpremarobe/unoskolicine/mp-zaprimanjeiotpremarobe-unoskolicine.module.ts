import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPZaprimanjeiotpremarobeUnoskolicinePage } from './mp-zaprimanjeiotpremarobe-unoskolicine';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPZaprimanjeiotpremarobeUnoskolicinePage,
  ],
  imports: [
    IonicPageModule.forChild(MPZaprimanjeiotpremarobeUnoskolicinePage),
    ComponentsModule
  ],
  exports: [
    MPZaprimanjeiotpremarobeUnoskolicinePage
  ]
})
export class MPZaprimanjeiotpremarobeUnoskolicinePageModule {}
