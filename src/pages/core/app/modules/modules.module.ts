import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreAppModulesPage } from '../modules/modules';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreAppModulesPage
  ],
  imports: [
    IonicPageModule.forChild(CoreAppModulesPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreAppModulesPage
  ]
})
export class CoreAppModulesPageModule {}
