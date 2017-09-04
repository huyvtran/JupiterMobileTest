import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { DoubletapDirective } from './gesture-directive/doubletap-directive';
import { JsHeaderComponent } from './core/js-header/js-header';
 
@NgModule({
    declarations: [
        JsHeaderComponent,
        DoubletapDirective
    ],
    imports: [
         IonicModule
    ],
    exports: [
        JsHeaderComponent,
        DoubletapDirective
    ]
})
export class ComponentsModule {}