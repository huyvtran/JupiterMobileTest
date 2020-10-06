import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KolicinaModalPage } from './kolicina-modal';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    KolicinaModalPage,
  ],
  imports: [
    IonicPageModule.forChild(KolicinaModalPage),
    ComponentsModule    
  ],
})
export class KolicinaModalPageModule {}
