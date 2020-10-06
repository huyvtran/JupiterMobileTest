import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DMSListPage} from './list';
import { ComponentsModule } from '../../../../../components/components.module';



@NgModule({
    declarations: [DMSListPage],
    imports: [
        IonicPageModule.forChild(DMSListPage),
        ComponentsModule
    ],
    exports: [DMSListPage]
})
export class DMSListPageModule {}