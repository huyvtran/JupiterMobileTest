import {Injectable} from '@angular/core';

@Injectable()
export class HrmOdsustvaProvider {

    constructor() {
    }

    reviver(key, value) : any
    {
        if ('endTime' === key || 'startTime' === key) {
            return new Date(value);
        } else if ('employee' === key) {
            return value.toLowerCase();
        }
        return value;
    }

}
