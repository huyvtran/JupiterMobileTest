import { Component, ElementRef, Input, Renderer, ViewChild} from '@angular/core';

@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion-list.html'
})
export class AccordionListComponent {
  @Input() headerColor: string = '#ebebeb';
  @Input() textColor: string = '#333';
  @Input() contentColor: string = '#F9F9F9';
  @Input() title: string;
  @Input() hasMargin: boolean = true;


  @Input() hideNoteOnExpand: boolean = false;
  @Input() noteText: string = '';
  @Input() noteColor: string = '';

  @ViewChild('accordionContent') elementView: ElementRef;

  @Input() expanded: boolean = false;
  viewHeight: number;

  constructor(public renderer: Renderer) { 
    
  }

  ngAfterViewInit() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;
    //this.renderer.setElementStyle(this.elementView.nativeElement, 'height', 0 + 'px');
    //this.renderer.setElementStyle(this.elementView.nativeElement, 'height', '100%');
    this.setHeight();
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
    //const newHeight = this.expanded ? '100%' : '0px';
    //this.renderer.setElementStyle(this.elementView.nativeElement, 'height', newHeight);
    this.setHeight();
  }

  setHeight() {
    const height = this.expanded ? '100%' : '0px';

    this.renderer.setElementStyle(this.elementView.nativeElement, 'height', height);
  }

}
