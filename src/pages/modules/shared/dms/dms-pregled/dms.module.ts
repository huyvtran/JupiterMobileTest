import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DMSGenericPage} from './dms';
import { ComponentsModule } from '../../../../../components/components.module';


@NgModule({
    declarations: [DMSGenericPage],
    imports: [
        IonicPageModule.forChild(DMSGenericPage),
        ComponentsModule
    ],
    exports: [DMSGenericPage]
})
export class DMSGenericPageModule {}