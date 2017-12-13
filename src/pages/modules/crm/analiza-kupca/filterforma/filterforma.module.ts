import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMAnalizaKupcaFilerFormaPage } from './filterforma';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMAnalizaKupcaFilerFormaPage
  ],
  imports: [
    IonicPageModule.forChild(CRMAnalizaKupcaFilerFormaPage),
    ComponentsModule
  ],
  entryComponents: [
    CRMAnalizaKupcaFilerFormaPage
  ]
})
export class CRMAnalizaKupcaFilerFormaPageModule {}
