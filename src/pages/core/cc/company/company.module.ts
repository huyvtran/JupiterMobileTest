import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcCompanyPage } from '../company/company';

@NgModule({
  declarations: [
    CoreCcCompanyPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcCompanyPage)
  ],
  entryComponents: [
    CoreCcCompanyPage
  ]
})
export class CoreCcCompanyPageModule {}
