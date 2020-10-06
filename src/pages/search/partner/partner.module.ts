import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPartnerPage } from './partner';

import { PipesModule } from '../../../pipes/pipes.module';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SearchPartnerPage
  ],
  imports: [
    IonicPageModule.forChild(SearchPartnerPage),
    ComponentsModule,
    PipesModule
  ],
  entryComponents: [
    SearchPartnerPage
  ]
})
export class SearchPartnerPageModule {}
