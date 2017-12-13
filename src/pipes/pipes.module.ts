import { SearchPipe } from './search.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { NgModule } from '@angular/core';
 
@NgModule({
    declarations: [
        SearchPipe,
        NumberFormatPipe
    ],
    imports: [
 
    ],
    exports: [
        SearchPipe,
        NumberFormatPipe
    ]
})
export class PipesModule {}