import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerPersonsPage } from '../persons/persons';
import { PipesModule } from '../../../pipes/pipes.module';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    PartnerPersonsPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerPersonsPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    PartnerPersonsPage
  ]
})
export class PartnerPersonsPageModule {}
