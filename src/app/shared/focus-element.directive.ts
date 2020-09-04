import { Directive, ElementRef, HostListener, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { NgModel, FormControl, NgControl } from '@angular/forms';
 
@Directive({
  selector: '[FocusElement]'
})
export class FocusElementDirective {
 
//   @Input() ngModel: FormControl;
//   @Output() ngModelChange = new EventEmitter();
  constructor(private _el: ElementRef , private control : NgControl) { }
 
  @HostListener('focus', ['$event']) onFocus(event) {
      this.control.control.markAsUntouched();
  }
}