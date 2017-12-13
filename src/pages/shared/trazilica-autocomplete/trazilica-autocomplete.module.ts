import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedTrazilicaAutocompletePage } from './trazilica-autocomplete';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SharedTrazilicaAutocompletePage
  ],
  imports: [
    IonicPageModule.forChild(SharedTrazilicaAutocompletePage),
    ComponentsModule
  ],
  entryComponents: [
    SharedTrazilicaAutocompletePage
  ]
})
export class SharedTrazilicaAutocompletePageModule {}
