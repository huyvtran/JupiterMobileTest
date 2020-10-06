import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchRobaPage } from './roba';

import { PipesModule } from '../../../pipes/pipes.module';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SearchRobaPage
  ],
  imports: [
    IonicPageModule.forChild(SearchRobaPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    SearchRobaPage
  ]
})
export class SearchRobaPageModule {}
