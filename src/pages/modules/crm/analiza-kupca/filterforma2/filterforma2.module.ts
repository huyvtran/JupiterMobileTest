import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMAnalizaKupcaFilerForma2Page } from './filterforma2';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMAnalizaKupcaFilerForma2Page
  ],
  imports: [
    IonicPageModule.forChild(CRMAnalizaKupcaFilerForma2Page),
    ComponentsModule
  ],
  entryComponents: [
    CRMAnalizaKupcaFilerForma2Page
  ]
})
export class CRMAnalizaKupcaFilerForma2PageModule {}
