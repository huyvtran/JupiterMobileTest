import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DMSGenericDetailPage} from './dms-detail';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [DMSGenericDetailPage],
    imports: [
        IonicPageModule.forChild(DMSGenericDetailPage),
        ComponentsModule
    ],
    exports: [DMSGenericDetailPage]
})
export class DMSGenericDetailPageModule {}