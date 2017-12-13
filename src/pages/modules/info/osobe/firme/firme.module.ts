import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OsobaFirmaPage } from './firme';
import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
  declarations: [
    OsobaFirmaPage
  ],
  imports: [
    IonicPageModule.forChild(OsobaFirmaPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    OsobaFirmaPage
  ]
})
export class OsobaFirmaPageModule {}
