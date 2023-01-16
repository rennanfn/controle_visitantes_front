import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appCapsDetect]',
})
export class CapsDetectDirective implements OnInit {
  @Output('capsLock') capsLock = new EventEmitter<boolean>();
  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('window:click', ['$event'])
  @HostListener('window:keydown.CapsLock', ['$event'])
  @HostListener('window:keydup.CapsLock', ['$event'])
  capsLockEnable(event: KeyboardEvent) {
    this.capsLock.emit(event.getModifierState('CapsLock'));
  }

  // @HostListener('window:keydup.CapsLock', ['$event'])
  // capsLockDisable(event: KeyboardEvent) {
  //   this.capsLock.emit(event.getModifierState('CapsLock'));
  // }
}
