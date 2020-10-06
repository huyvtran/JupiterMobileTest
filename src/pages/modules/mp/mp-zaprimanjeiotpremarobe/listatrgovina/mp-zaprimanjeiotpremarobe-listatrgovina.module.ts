import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPZaprimanjeiotpremarobeListatrgovinaPage } from './mp-zaprimanjeiotpremarobe-listatrgovina';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPZaprimanjeiotpremarobeListatrgovinaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPZaprimanjeiotpremarobeListatrgovinaPage),
    ComponentsModule
  ],
  exports: [
    MPZaprimanjeiotpremarobeListatrgovinaPage
  ]
})
export class MPZaprimanjeiotpremarobeListatrgovinaPageModule {}
