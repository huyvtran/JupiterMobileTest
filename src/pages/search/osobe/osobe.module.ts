import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchOsobePage } from './osobe';

import { PipesModule } from '../../../pipes/pipes.module';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SearchOsobePage
  ],
  imports: [
    IonicPageModule.forChild(SearchOsobePage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    SearchOsobePage
  ]
})
export class SearchOsobePageModule {}
