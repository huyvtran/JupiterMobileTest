import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


import { ComponentsModule } from '../../../../../../components/components.module';
import { StavkaIzmjenaPage } from './stavka-izmjena';


@NgModule({
  declarations: [
    StavkaIzmjenaPage,
  ],
  imports: [
    IonicPageModule.forChild(StavkaIzmjenaPage),
    ComponentsModule
  ],
  entryComponents: [
    StavkaIzmjenaPage
  ]
})
export class StavkaIzmjenaPageModule {}