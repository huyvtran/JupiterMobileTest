import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreLoginPage } from './login';

@NgModule({
  declarations: [
    CoreLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(CoreLoginPage),
  ],
  exports: [
    CoreLoginPage
  ]
})
export class CoreLoginPageModule {}
