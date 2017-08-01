import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerPersonsPage } from '../persons/persons';
import { PipesModule } from '../../../pipes/pipes.module';


@NgModule({
  declarations: [
    PartnerPersonsPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerPersonsPage),
    PipesModule
  ],
  entryComponents: [
    PartnerPersonsPage
  ]
})
export class PartnerPersonsPageModule {}
