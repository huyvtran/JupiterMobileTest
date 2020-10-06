import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraDialogModalPage } from './dialog-modal';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityInventuraDialogModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraDialogModalPage),
    ComponentsModule    
  ],
})
export class UtilityInventuraDialogModalPageModule {}

