import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { StavkaSpremiPage } from './stavka-spremanje';


@NgModule({
  declarations: [
    StavkaSpremiPage,
  ],
  imports: [
    IonicPageModule.forChild( StavkaSpremiPage),
    ComponentsModule
  ],
  entryComponents: [
    StavkaSpremiPage
  ]
})
export class StavkaSpremiPageModule {}