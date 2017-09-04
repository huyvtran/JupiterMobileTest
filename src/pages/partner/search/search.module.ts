import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerSearchPage } from '../search/search';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    PartnerSearchPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerSearchPage),
    ComponentsModule
  ],
  entryComponents: [
    PartnerSearchPage
  ]
})
export class PartnerSearchPageModule {}
