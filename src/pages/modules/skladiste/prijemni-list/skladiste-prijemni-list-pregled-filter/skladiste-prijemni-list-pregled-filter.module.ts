import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladistePrijemniListPregledFilterPage } from './skladiste-prijemni-list-pregled-filter';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladistePrijemniListPregledFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladistePrijemniListPregledFilterPage),
    ComponentsModule
  ],
})
export class SkladistePrijemniListPregledFilterPageModule {}
