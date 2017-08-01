import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestBugshooterPage } from './bugshooter';

@NgModule({
  declarations: [
    TestBugshooterPage,
  ],
  imports: [
    IonicPageModule.forChild(TestBugshooterPage)
  ],
  exports: [
    TestBugshooterPage
  ]
})
export class TestBugshooterPageModule {}
