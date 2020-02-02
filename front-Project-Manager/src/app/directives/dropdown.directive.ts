import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  @Output() public clickOutside = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  @HostListener('click', ['$event.target'])
  public onClick(targetElement) {

    if (targetElement.id === 'members') {
      return;
    }

    if (targetElement.id === 'profile-button') {
      return;
    }

    if (targetElement.id === 'burger-btn') {
      return;
    }

    const isCheckedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!isCheckedInside) {
      this.clickOutside.emit(null);
    }
  }
}
