import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerPersonsDetPage } from '../persons-det/persons-det';


@NgModule({
  declarations: [
    PartnerPersonsDetPage
  ],
  imports: [
    IonicPageModule.forChild(PartnerPersonsDetPage)
  ],
  entryComponents: [
    PartnerPersonsDetPage
  ]
})
export class PartnerPersonsDetPageModule {}
