import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


import { ComponentsModule } from '../../../../../../../components/components.module';
import { StavkaKontingentPage } from './stavka-kontingent';

@NgModule({
  declarations: [
    StavkaKontingentPage,
  ],
  imports: [
    IonicPageModule.forChild(StavkaKontingentPage),
    ComponentsModule
  ],
  entryComponents: [
    StavkaKontingentPage
  ]
})
export class StavkaKontingentPageModule {}