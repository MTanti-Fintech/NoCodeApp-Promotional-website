import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[appAlphabetOnly]'
})
export class AlphabetOnlyDirective {
  key;
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    const allowedKeys: number[] = [35, 36, 37, 38, 39, 40, 46];
    const notAllowedKeys: number[] = [106, 109, 111, 107]
    if (allowedKeys.includes(this.key)) {
      return;
    }
    if (notAllowedKeys.includes(this.key)) {
      event.preventDefault();
    }
    if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
      event.preventDefault();
    }
  }
}