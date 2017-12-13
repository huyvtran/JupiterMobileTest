import {Injectable} from '@angular/core';

import {CrmSharedProvider} from './crm-shared';

@Injectable()
export class CrmFinancijePregledProvider extends CrmSharedProvider {
    prometProslaGodina : boolean = false;
    initialized: boolean = false;

    barChart : any;

    constructor() {super()}
}
