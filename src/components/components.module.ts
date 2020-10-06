import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { DoubletapDirective } from './gesture-directive/doubletap-directive';
import { JsHeaderComponent } from './core/js-header/js-header';
import { JsHeaderModalComponent } from './core/js-header-modal/js-header-modal';
import { TerkomComponent } from './application/terkom/terkom-component';
import { TerproComponent } from './application/terpro/terpro-component';
import { JsContentComponent } from './core/js-content/js-content';
import { JsNoDataComponent } from './core/js-nodata/js-nodata';

import { AccordionListComponent } from './accordion-list/accordion-list';
import { DatePicker } from './datepicker/datepicker';
import { Autosize } from './autosize/autosize';
 
@NgModule({
    declarations: [
        DoubletapDirective,
        JsHeaderComponent,
        JsHeaderModalComponent,
        JsContentComponent,
		JsNoDataComponent,
        AccordionListComponent,
        DatePicker,
		Autosize,
        TerkomComponent,
        TerproComponent
    ],
    imports: [
         IonicModule
    ],
    exports: [
        DoubletapDirective,
        JsHeaderComponent,
        JsHeaderModalComponent,
        JsContentComponent,
		JsNoDataComponent,
        AccordionListComponent,
        DatePicker,
		Autosize,
        TerkomComponent,
        TerproComponent
    ]
})
export class ComponentsModule {}