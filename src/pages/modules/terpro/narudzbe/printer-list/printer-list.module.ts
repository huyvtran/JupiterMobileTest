import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterListPage } from './printer-list';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    PrinterListPage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterListPage),
    ComponentsModule
  ],
  exports: [
    PrinterListPage
  ]
})
export class PrinterListPageModule {}
