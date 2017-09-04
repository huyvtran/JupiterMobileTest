import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerLocationPage } from '../location/location';
import { PipesModule } from '../../../pipes/pipes.module';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    PartnerLocationPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerLocationPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    PartnerLocationPage
  ]
})
export class PartnerLocationPageModule {}
