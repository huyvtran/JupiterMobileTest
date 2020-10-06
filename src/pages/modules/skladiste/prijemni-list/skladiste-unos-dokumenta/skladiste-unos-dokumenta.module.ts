import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladisteUnosDokumentaPage } from './skladiste-unos-dokumenta';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladisteUnosDokumentaPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladisteUnosDokumentaPage),
    ComponentsModule
  ],
})
export class SkladisteUnosDokumentaPageModule {}
