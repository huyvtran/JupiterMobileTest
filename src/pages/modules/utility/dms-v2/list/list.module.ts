import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UtilityDMSV2ListPage} from './list';
import { ComponentsModule } from '../../../../../components/components.module';



@NgModule({
    declarations: [UtilityDMSV2ListPage],
    imports: [
        IonicPageModule.forChild(UtilityDMSV2ListPage),
        ComponentsModule
    ],
    exports: [UtilityDMSV2ListPage]
})
export class UtilityDMSV2ListPageModule {}