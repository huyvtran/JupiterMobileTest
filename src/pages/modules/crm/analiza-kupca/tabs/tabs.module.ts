import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMAnalizaKupcaTabsPage } from '../tabs/tabs';


@NgModule({
  declarations: [
    CRMAnalizaKupcaTabsPage
  ],
  imports: [
    IonicPageModule.forChild(CRMAnalizaKupcaTabsPage)
  ],
  entryComponents: [
    CRMAnalizaKupcaTabsPage
  ]
})
export class CRMAnalizaKupcaTabsPageModule {}
