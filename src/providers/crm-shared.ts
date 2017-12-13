import {Injectable} from '@angular/core';

@Injectable()
export class CrmSharedProvider {
    partnerid?: number;
    partner: string = "Tražilica partnera";

    constructor() {}
}
