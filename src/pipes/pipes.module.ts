import { SearchPipe } from './search.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { HighlightifyPipe } from './highlightify.pipe';
import { NgModule } from '@angular/core';
import { CamelCaseFormatPipe } from './camelcase.pipe';
import { DynamicPipe } from './dynamic.pipe';

@NgModule({
    declarations: [
        SearchPipe,
        NumberFormatPipe,
        HighlightifyPipe,
        CamelCaseFormatPipe,
        DynamicPipe
    ],
    imports: [
 
    ],
    exports: [
        SearchPipe,
        NumberFormatPipe,
        HighlightifyPipe,
        CamelCaseFormatPipe,
        DynamicPipe
    ]
})
export class PipesModule {}