import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {GenericInfoPage} from './info';
import { ComponentsModule } from '../../../../../components/components.module';
import { PipesModule } from '../../../../../pipes/pipes.module';


@NgModule({
    declarations: [GenericInfoPage],
    imports: [
        IonicPageModule.forChild(GenericInfoPage),
        ComponentsModule,
        PipesModule
    ],
    exports: [GenericInfoPage]
})
export class GenericInfoPageModule {}