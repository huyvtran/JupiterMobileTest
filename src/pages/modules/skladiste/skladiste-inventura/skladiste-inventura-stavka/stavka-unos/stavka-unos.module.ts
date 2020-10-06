import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


import { ComponentsModule } from '../../../../../../components/components.module';
import { StavkaUnosPage } from './stavka-unos';

@NgModule({
  declarations: [
    StavkaUnosPage,
  ],
  imports: [
    IonicPageModule.forChild(StavkaUnosPage),
    ComponentsModule
  ],
  entryComponents: [
    StavkaUnosPage
  ]
})
export class StavkaUnosPageModule {}