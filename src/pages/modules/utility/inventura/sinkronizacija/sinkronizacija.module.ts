import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraSinkronizacijaPage } from './sinkronizacija';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityInventuraSinkronizacijaPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraSinkronizacijaPage),
    ComponentsModule
  ],
  entryComponents: [
    UtilityInventuraSinkronizacijaPage
  ]
})
export class UtilityInventuraSinkronizacijaPageModule {}
