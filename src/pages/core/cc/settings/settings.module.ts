import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcSettingsPage } from '../settings/settings';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcSettingsPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcSettingsPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcSettingsPage
  ]
})
export class CoreCcSettingsPageModule {}
