import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreAppModulesPage } from '../modules/modules';

@NgModule({
  declarations: [
    CoreAppModulesPage
  ],
  imports: [
    IonicPageModule.forChild(CoreAppModulesPage)
  ],
  entryComponents: [
    CoreAppModulesPage
  ]
})
export class CoreAppModulesPageModule {}
