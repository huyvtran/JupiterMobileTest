import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UtilityDMSV2FilterListPage} from './filter';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [UtilityDMSV2FilterListPage],
    imports: [
        IonicPageModule.forChild(UtilityDMSV2FilterListPage),
        ComponentsModule
    ],
    exports: [UtilityDMSV2FilterListPage]
})
export class UtilityDMSV2FilterListPageModule {}