import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MPInventuraPocetnaPage } from './mpinventurapocetna';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPInventuraPocetnaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPInventuraPocetnaPage),
    ComponentsModule
  ],
  exports: [
    MPInventuraPocetnaPage
  ]
})
export class MPInventuraPocetnaPageModule {}
