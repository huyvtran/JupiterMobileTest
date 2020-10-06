import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'camelCase'})
export class CamelCaseFormatPipe implements PipeTransform {

    // transform(val : number) : string {
    //     // Format the output to display any way you want here. For instance:
    //     if(val !== undefined && val !== null) {
    //         return val.toLocaleString(/*arguments you need*/);
    //     } else {
    //         return '';
    //     }
    // }


    transform(value: string): string {

    var words = value.split( ' ' );
    for ( var i = 0, len = words.length; i < len; i++ )
        words[i] = words[i].charAt( 0 ).toUpperCase() + words[i].slice( 1 );
    return words.join( ' ' );
}

}