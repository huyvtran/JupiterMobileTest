import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPZaprimanjeiotpremarobeVrstadokumentaPage } from './mp-zaprimanjeiotpremarobe-vrstadokumenta';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPZaprimanjeiotpremarobeVrstadokumentaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPZaprimanjeiotpremarobeVrstadokumentaPage),
    ComponentsModule
  ],
  exports: [
    MPZaprimanjeiotpremarobeVrstadokumentaPage
  ]
})
export class MPZaprimanjeiotpremarobeVrstadokumentaPageModule {}
