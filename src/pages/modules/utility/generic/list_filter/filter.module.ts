import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {GenericFilterListPage} from './filter';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [GenericFilterListPage],
    imports: [
        IonicPageModule.forChild(GenericFilterListPage),
        ComponentsModule
    ],
    exports: [GenericFilterListPage]
})
export class GenericFilterListPageModule {}