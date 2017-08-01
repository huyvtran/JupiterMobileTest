import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmOdsustvaPage } from '../odsustva/odsustva';

//import { ComponentsModule  } from '../../components/components.module.ts';
import { NgCalendarModule  } from 'ionic2-calendar';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    HrmOdsustvaPage
  ],
  imports: [
    IonicPageModule.forChild(HrmOdsustvaPage),
    NgCalendarModule,
    ComponentsModule
  ],
  entryComponents: [
    HrmOdsustvaPage
  ]
})
export class HrmOdsustvaPageModule {}
