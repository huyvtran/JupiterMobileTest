import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkladisteIzmjenaDokumentaPage } from './skladiste-izmjena-dokumenta';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    SkladisteIzmjenaDokumentaPage,
  ],
  imports: [
    IonicPageModule.forChild(SkladisteIzmjenaDokumentaPage),
    ComponentsModule
  ],
})
export class SkladisteIzmjenaDokumentaPageModule {}
