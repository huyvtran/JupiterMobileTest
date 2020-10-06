import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IzvidnikPage } from './izvidnik';

@NgModule({
  declarations: [
    IzvidnikPage,
  ],
  imports: [
    IonicPageModule.forChild(IzvidnikPage),
  ]
})
export class IzvidnikPageModule {}
