import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnosIzvidaPage } from './unos-izvida';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UnosIzvidaPage,
  ],
  imports: [
    IonicPageModule.forChild(UnosIzvidaPage),
    ComponentsModule
  ],
})
export class UnosIzvidaPageModule {}
