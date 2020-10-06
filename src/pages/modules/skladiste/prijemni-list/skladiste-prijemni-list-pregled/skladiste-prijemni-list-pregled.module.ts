import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladistePrijemniListPregledPage } from './skladiste-prijemni-list-pregled';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladistePrijemniListPregledPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladistePrijemniListPregledPage),
    ComponentsModule
  ],
})
export class SkladistePrijemniListPregledPageModule {}
