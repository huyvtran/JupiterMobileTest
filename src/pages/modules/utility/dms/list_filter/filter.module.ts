import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DMSFilterListPage} from './filter';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [DMSFilterListPage],
    imports: [
        IonicPageModule.forChild(DMSFilterListPage),
        ComponentsModule
    ],
    exports: [DMSFilterListPage]
})
export class DMSFilterListPageModule {}