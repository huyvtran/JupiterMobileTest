import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomObavijestiPage } from './obavijesti';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomObavijestiPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomObavijestiPage),
    ComponentsModule
  ],
  exports: [
    TerkomObavijestiPage
  ]
})
export class TerkomObavijestiPageModule {}