import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladistePrijemniListStavkaUnosIzmjenaPage } from './skladiste-prijemni-list-stavka-unos-izmjena';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladistePrijemniListStavkaUnosIzmjenaPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladistePrijemniListStavkaUnosIzmjenaPage),
    ComponentsModule,
    PipesModule
  ],
})
export class SkladistePrijemniListStavkaUnosIzmjenaPageModule {}
