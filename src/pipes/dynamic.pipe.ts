import {
    Pipe,
    PipeTransform
} from '@angular/core';

import { DatePipe, DecimalPipe } from '@angular/common';

@Pipe({ name: 'dynamic' })
export class DynamicPipe extends DatePipe implements PipeTransform {

    transform(value: string, modifier: string) {

        if (!modifier) return value;
        // Evaluate pipe string
        return eval('this.' + modifier + '(\'' + value + '\')')
    }


    date(value: any): string {

        value = typeof value === 'string' ?
            Date.parse(value) : value;
        return super.transform(value, 'dd.MM.yyyy');
    }

    decimal(value: any): string {
  
        value = typeof value === 'string' ?   Number(value) : value;
        let numStr = value.toFixed(2);
        let num = numStr;
        if (value > 999 || value < - 999)
            num = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let result =num.split('.').join('$').split(',').join('#').split('$').join(',').split('#').join('.');
        
        return result;
    }
}

