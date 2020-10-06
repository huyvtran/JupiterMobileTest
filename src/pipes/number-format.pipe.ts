import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {

    // transform(val : number) : string {
    //     // Format the output to display any way you want here. For instance:
    //     if(val !== undefined && val !== null) {
    //         return val.toLocaleString(/*arguments you need*/);
    //     } else {
    //         return '';
    //     }
    // }

    transform(value: number,
        decimalLength: number = 2): string {
        let numStr = value.toFixed(decimalLength);
        let num = numStr;
        if (value > 999 || value < - 999)
            num = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let result =num.split('.').join('$').split(',').join('#').split('$').join(',').split('#').join('.');
        
        return result;
    }
}