import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Position } from './position';

@Directive({
  selector: '[bmbRipple]',
})
export class RippleDirective implements OnDestroy {
  @Input() centered: boolean;
  @Input() disabled: boolean;
  @Input() radius: number;
  @Input() unbounded = false;
  @Input() color = '#ccc';

  private timers: number[] = [];

  @HostListener('mousedown', ['$event']) handleMouseDown($event: MouseEvent): void {
    if (this.disabled) {
      return;
    }

    this.onMouseDown($event);
  }

  constructor(
    @Inject(DOCUMENT) private document,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }

  private onMouseDown(event: MouseEvent): void {
    const containerRect = this.element.nativeElement.getBoundingClientRect();
    const clientRect: Position = {
      left: event.clientX,
      top: event.clientY,
    };

    // if radius is not set, we should calculate it, and get furthest corner to fill all available space
    const radius =
      this.radius || this.getDistanceToFurthestCorner(containerRect, event.clientX, event.clientY);

    const calculatedPosition = this.getPosition(containerRect, clientRect, radius);
    const ripple = this.getStyledRipple(calculatedPosition, radius);

    this.updateContainerStyles();
    this.addToDomAndRemoveAfterTimeout(ripple, 1000);
  }

  private updateContainerStyles(): void {
    if (!this.unbounded) {
      this.element.nativeElement.style.overflow = 'hidden';
      this.element.nativeElement.style.position = 'relative';
    } else {
      this.element.nativeElement.style.overflow = 'auto';
      this.element.nativeElement.style.position = 'inherit';
    }
  }

  private addToDomAndRemoveAfterTimeout(element: HTMLElement, timeout: number = 1000): void {
    this.renderer.appendChild(this.element.nativeElement, element);

    const timer = setTimeout(() => {
      this.renderer.removeChild(this.element.nativeElement, element);
    }, timeout);

    this.timers.push(timer);
  }

  private getStyledRipple(pos: Position, radius: number): HTMLElement {
    const ripple = document.createElement('div');

    ripple.classList.add('ripple-element');
    ripple.style.left = `${pos.left}px`;
    ripple.style.top = `${pos.top}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.width = `${radius * 2}px`;
    ripple.style.backgroundColor = `${this.color}`;

    return ripple;
  }

  private getDistanceToFurthestCorner(containerRect: ClientRect, x: number, y: number): number {
    const distX = Math.max(Math.abs(x - containerRect.left), Math.abs(x - containerRect.right));
    const distY = Math.max(Math.abs(y - containerRect.top), Math.abs(y - containerRect.bottom));

    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
  }

  private getPosition(containerRect: ClientRect, clientRect: Position, radius: number): Position {
    if (this.centered) {
      return !this.unbounded
        ? this.getCenteredBoundedPosition(containerRect, radius)
        : this.getCenteredUnboundedPosition(containerRect, radius);
    }

    return !this.unbounded
      ? this.getBoundedPosition(containerRect, clientRect, radius)
      : this.getUnboundedPosition(clientRect, radius);
  }

  private getCenteredBoundedPosition(containerRect: ClientRect, radius: number): Position {
    return {
      left: containerRect.width / 2 - radius,
      top: containerRect.height / 2 - radius,
    };
  }

  private getCenteredUnboundedPosition(containerRect: ClientRect, radius: number): Position {
    return {
      left: containerRect.left + containerRect.width / 2 - radius,
      top: containerRect.top + containerRect.height / 2 - radius,
    };
  }

  private getUnboundedPosition(clientRect: Position, radius: number): Position {
    return {
      left: clientRect.left - radius,
      top: clientRect.top - radius,
    };
  }

  private getBoundedPosition(
    containerRect: ClientRect,
    clientRect: Position,
    radius: number
  ): Position {
    return {
      left: clientRect.left - containerRect.left - radius,
      top: clientRect.top - containerRect.top - radius,
    };
  }
}
