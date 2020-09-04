import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[decimalOnly]'
})
export class DecimalDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,12}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Alt', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) { }

  @HostListener('paste', ['$event']) onPaste(e) {

    // get and validate data from clipboard
    let value = e.clipboardData.getData('text/plain');
    if (isNaN(value)) {
      e.preventDefault();
    }
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let controlOrCommand = (event.ctrlKey === true || event.metaKey === true);
    let key: string = this.getName(event);
    if (this.specialKeys.indexOf(key) != -1 ||
      // Allow: Ctrl+A and Command+A
      (key == 'a' && controlOrCommand) ||
      // Allow: Ctrl+C and Command+C
      (key == 'c' && controlOrCommand) ||
      // Allow: Ctrl+V and Command+V
      (key == 'v' && controlOrCommand) ||
      // Allow: Ctrl+X and Command+X
      (key == 'x' && controlOrCommand)) {
      // let it happen, don't do anything
      return;
    }
    const current: string = this.el.nativeElement.value ? this.el.nativeElement.value.replace(/[,]*/g, '') : this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    if (isNaN(Number(next))) {
      event.preventDefault();
    }
    if (current == '') {
      return;
    }
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
  /**
    * Get key's name
    * @param e
    */
  getName(e): string {

    if (e.key) {

      return e.key;

    } else {

      // for old browsers
      if (e.keyCode && String.fromCharCode) {

        switch (e.keyCode) {
          case 8: return 'Backspace';
          case 9: return 'Tab';
          case 27: return 'Escape';
          case 37: return 'ArrowLeft';
          case 39: return 'ArrowRight';
          case 188: return ',';
          case 190: return '.';
          case 109: return '-'; // minus in numbpad
          case 173: return '-'; // minus in alphabet keyboard in firefox
          case 189: return '-'; // minus in alphabet keyboard in chrome
          default: return String.fromCharCode(e.keyCode);
        }
      }
    }
  }
}
