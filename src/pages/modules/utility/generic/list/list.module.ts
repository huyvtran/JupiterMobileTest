import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {GenericListPage} from './list';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [GenericListPage],
    imports: [
        IonicPageModule.forChild(GenericListPage),
        ComponentsModule
    ],
    exports: [GenericListPage]
})
export class GenericListPageModule {}