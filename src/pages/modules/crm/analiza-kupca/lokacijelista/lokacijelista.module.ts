import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMAnalizaKupcaLokacijeListaPage } from './lokacijelista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMAnalizaKupcaLokacijeListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMAnalizaKupcaLokacijeListaPage),
    ComponentsModule
  ],
  exports: [
    CRMAnalizaKupcaLokacijeListaPage
  ]
})
export class CRMAnalizaKupcaLokacijeListaPageModule {}
