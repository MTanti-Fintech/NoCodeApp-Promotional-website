import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";

@Directive({
  selector: "[track-onScroll]",
})
export class TrackScollDirective {
  constructor(private elementRef: ElementRef) {}
  @Input("trackEle") trackEle;
  @Output("selectMenu") selectMenu = new EventEmitter();
  @HostListener("window:scroll")
  TrackOnScroll() {
    const element = this.elementRef.nativeElement;
    const position = element.getBoundingClientRect();
    // checking whether fully visible
    if (position.top >= 0 && position.bottom <= window.innerHeight) {
      this.selectMenu.emit(this.trackEle);
    }
    // checking for partial visibility
    if (position.top < window.innerHeight && position.bottom >= 0) {
      this.selectMenu.emit(this.trackEle);
    }
  }
}
