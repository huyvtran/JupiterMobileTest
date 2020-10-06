import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladistePrijemniListStavkaDonosPage } from './skladiste-prijemni-list-stavka-donos';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladistePrijemniListStavkaDonosPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladistePrijemniListStavkaDonosPage),
    ComponentsModule
  ],
})
export class SkladistePrijemniListStavkaDonosPageModule {}
