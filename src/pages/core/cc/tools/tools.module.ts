import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcToolsPage } from '../tools/tools';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcToolsPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcToolsPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcToolsPage
  ]
})
export class CoreCcToolsPageModule {}
