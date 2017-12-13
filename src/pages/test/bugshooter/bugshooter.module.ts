import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TestBugshooterPage} from './bugshooter';

import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    declarations: [TestBugshooterPage],
    imports: [
        IonicPageModule.forChild(TestBugshooterPage),
        ComponentsModule
    ],
    exports: [TestBugshooterPage]
})
export class TestBugshooterPageModule {}