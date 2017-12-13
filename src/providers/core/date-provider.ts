import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import * as Moment from 'moment';

@Injectable()
export class DateProvider {

    type : string;
    doDanas?: boolean;
    inputvrijeme : any = {};

    constructor(public http : Http) {}

    getTime(type, doDanas?: boolean) {
        this.type = type;
        this.doDanas = doDanas;
        let result;
        switch (type) {
            case "d":
                result = this.getDay(0);
                break;
            case "-d":
                result = this.getDay(-1);
                break;
            case "+d":
                result = this.getDay(1);
                break;
            case "t":
                result = this.getWeek(0);
                break;
            case "-t":
                result = this.getWeek(-1);
                break;
            case "+t":
                result = this.getWeek(1);
                break;
            case "m":
                result = this.getMonth(0);
                break;
            case "-m":
                result = this.getMonth(-1);
                break;
            case "+m":
                result = this.getMonth(1);
                break;
            case "y":
                result = this.getYear(0);
                break;
            case "-y":
                result = this.getYear(-1);
                break;
            case "+y":
                result = this.getYear(1);
                break;
        }
        return result;
    }

    getDay(value : number) {
        let momentOd = Moment().add(value, 'day');
        let momentDo = Moment().add(value, 'day');
        return this.format(momentOd, momentDo)
    }

    getWeek(value : number) {
        var startDate = Moment()
            .startOf('isoWeek')
            .add(value, 'week');
        var endDate = startDate
            .clone()
            .endOf("isoWeek");

        return this.format(startDate, this.getEndDate(endDate))
    }

    getEndDate(date : Moment.Moment) : Moment.Moment {
        if(this.doDanas != true) {
            return date;
        }
        let danas = new Date();
        let danasDay = danas.getUTCDate();
        let danasMonth = danas.getUTCMonth();

        if (this.type == "y" || this.type == "m" || this.type == "t") {
            return Moment();
        } else if (this.type == "-y") 
            return Moment(new Date(date.year(), danasMonth, danasDay));
        else if (this.type == "-m") 
            return Moment(new Date(date.year(), date.month(), danasDay));
        
        return date;

    }

    getMonth(value : number) {
        var startDate = Moment()
            .startOf('month')
            .add(value, 'month');
        var endDate = startDate
            .clone()
            .endOf("month");

        return this.format(startDate, this.getEndDate(endDate))
    }

    getYear(value : number) {
        var startDate = Moment()
            .startOf('year')
            .add(value, 'year');
        var endDate = startDate
            .clone()
            .endOf("year");

        return this.format(startDate, this.getEndDate(endDate))
    }

    format(startDate : Moment.Moment, endDate : Moment.Moment) {
        if (this.inputvrijeme != null) {
            if (this.inputvrijeme.vrijemeod != null) {
                let momentOd = Moment(this.inputvrijeme.vrijemeod);
                startDate = startDate
                    .hours(momentOd.hours())
                    .minutes(momentOd.minutes());
            }
            if (this.inputvrijeme.vrijemedo != null) {
                let momentDo = Moment(this.inputvrijeme.vrijemedo);
                endDate = endDate
                    .hours(momentDo.hours())
                    .minutes(momentDo.minutes());
            }
        }
        var result = {
            start: startDate.format(),
            end: endDate.format(),
            type: this.type
        };
        return result;
    }
}
