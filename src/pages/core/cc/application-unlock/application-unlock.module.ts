import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcApplicationUnlockPage } from '../application-unlock/application-unlock';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcApplicationUnlockPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcApplicationUnlockPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcApplicationUnlockPage
  ]
})
export class CoreCcApplicationUnlockPageModule {}
