import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladistePrijemniListStavkePregledPage } from './skladiste-prijemni-list-stavke-pregled';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladistePrijemniListStavkePregledPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladistePrijemniListStavkePregledPage),
    ComponentsModule
    
  ],
})
export class SkladistePrijemniListStavkePregledPageModule {}
