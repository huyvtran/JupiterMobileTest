import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcApplicationsPage } from '../applications/applications';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcApplicationsPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcApplicationsPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcApplicationsPage
  ]
})
export class CoreCcApplicationsPageModule {}
