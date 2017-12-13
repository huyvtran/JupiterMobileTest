import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Slides } from "ionic-angular";

import * as Moment from 'moment';

@Component({
    selector: 'datepicker',
    templateUrl: 'datepicker.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePicker {
    @ViewChild('datepicker') datepicker: Slides;
    @ViewChild('dateSwiperNext') dateSwiperNext: ElementRef;
    @ViewChild('dateSwiperPrev') dateSwiperPrev: ElementRef;

    //public dates: Date[];
    public dates: Date[];
    public data: any[];
    public selected: string;


    @Input("data")
    set dataProp(val: any[]) {
        this.data = val;
        this.dates = val.map(v => Moment(v.datum).toDate());
    }

    @Input("selected")
    set selectedProp(val: string) {
        //this.selected = Moment(val).format("YYYY-MM-DDT00:00:00");
        this.selected = val;

    }
    get selectedProp() {
        return this.selected;
    }

    @Input("selectedMonth")
    set selectedMonthProp(val: string) {
        this.setSlider();
    }
    // get selectedMonthProp() {
    //     return this.selected;
    // }

    @Output() change = new EventEmitter<string>();

    constructor() {
        
    }

    ngAfterViewInit() {
        this.datepicker.nextButton = this.dateSwiperNext.nativeElement;
        this.datepicker.prevButton = this.dateSwiperPrev.nativeElement;

        this.setSlider(); //inicijalno slajdanje do selektiranog (današnjeg dana)
    }

    onDateChange(date: string) {
        //if (this.selected.valueOf() != date.valueOf())
        // if (this.selected != date)
        //     this.change.emit(date);
        this.change.emit(date);
    }

    setSlider() {
        try {
            if (this.selected == null)
                return;

            let selectedDay = Moment(this.selected).date();
            let slideTo = 0;
            if (selectedDay > 4)
                slideTo = selectedDay - 4;
                
            let self = this;
            setTimeout(function() {
                self.datepicker.slideTo(slideTo, 500);
            }, 1200);
        } catch (ex) {}        
    }


}