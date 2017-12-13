import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerPersonsDetPage } from './persons-det';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    PartnerPersonsDetPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerPersonsDetPage),
    ComponentsModule
  ],
  entryComponents: [
    PartnerPersonsDetPage
  ]
})
export class PartnerPersonsDetPageModule {}
