import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcProfilPage } from '../profil/profil';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcProfilPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcProfilPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcProfilPage
  ]
})
export class ProfilPageModule {}
