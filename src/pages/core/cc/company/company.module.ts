import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcCompanyPage } from '../company/company';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcCompanyPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcCompanyPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcCompanyPage
  ]
})
export class CoreCcCompanyPageModule {}
