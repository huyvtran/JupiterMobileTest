import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreCcFavoritesPage } from '../favorites/favorites';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CoreCcFavoritesPage
  ],
  imports: [
    IonicPageModule.forChild(CoreCcFavoritesPage),
    ComponentsModule
  ],
  entryComponents: [
    CoreCcFavoritesPage
  ]
})
export class CoreCcFavoritesPageModule {}
