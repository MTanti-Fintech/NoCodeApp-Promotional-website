import { Directive, ElementRef, HostListener,Input } from '@angular/core';

@Directive({
  selector: '[scrollToElement]'
})
export class ScrollDirective {

  constructor(private _el:ElementRef) { }
  @Input('scrollToElement') val:any;
  @HostListener('click')onClick(){
    var selector=this.val;
     setTimeout(function() {
      document.getElementById(selector).scrollIntoView({behavior: 'smooth'});
  }, 400);
    
    /*let e:HTMLElement;
    e=this._el.nativeElement.value;
    */
  }
}