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

export interface Coords {
  x: number;
  y: number;
}

@Directive({
  selector: '[appRipple]',
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
    const clientRect: Coords = {
      x: event.clientX,
      y: event.clientY,
    };

    const radius =
      this.radius || this.getDistanceToFurthestCorner(containerRect, event.clientX, event.clientY);

    const calculatedCoords = this.getCoords(containerRect, clientRect, radius);

    const ripple = this.getStyledRipple(calculatedCoords, radius);

    if (!this.unbounded) {
      this.element.nativeElement.style.overflow = 'hidden';
      this.element.nativeElement.style.position = 'relative';
    }

    this.addToDomAndRemoveAfterTimeout(ripple, 1000);
  }

  private addToDomAndRemoveAfterTimeout(element: HTMLElement, timeout: number = 1000): void {
    this.renderer.appendChild(this.element.nativeElement, element);

    const timer = setTimeout(() => {
      this.renderer.removeChild(this.element.nativeElement, element);
    }, timeout);

    this.timers.push(timer);
  }

  private getStyledRipple(coords: Coords, radius: number): HTMLElement {
    const ripple = document.createElement('div');

    ripple.classList.add('ripple-element');
    ripple.style.left = `${coords.x}px`;
    ripple.style.top = `${coords.y}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.width = `${radius * 2}px`;
    ripple.style.backgroundColor = `${this.color}`;

    return ripple;
  }

  private getDistanceToFurthestCorner(rect: ClientRect, x: number, y: number): number {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));

    return Math.sqrt(distX * distX + distY * distY);
  }

  private getCoords(containerRect: ClientRect, clientRect: Coords, radius: number): Coords {
    if (this.centered) {
      return !this.unbounded
        ? this.getCenteredBoundedCoords(containerRect, radius)
        : this.getCenteredUnboundedCoords(containerRect, radius);
    }

    return !this.unbounded
      ? this.getBoundedCoords(containerRect, clientRect, radius)
      : this.getUnboundedCoords(clientRect, radius);
  }

  private getCenteredBoundedCoords(containerRect: ClientRect, radius: number): Coords {
    return {
      x: containerRect.width / 2 - radius,
      y: containerRect.height / 2 - radius,
    };
  }

  private getCenteredUnboundedCoords(containerRect: ClientRect, radius: number): Coords {
    return {
      x: containerRect.left + containerRect.width / 2 - radius,
      y: containerRect.top + containerRect.height / 2 - radius,
    };
  }

  private getUnboundedCoords(clientRect: Coords, radius: number): Coords {
    return {
      x: clientRect.x - radius,
      y: clientRect.y - radius,
    };
  }

  private getBoundedCoords(containerRect: ClientRect, clientRect: Coords, radius: number): Coords {
    return {
      x: clientRect.x - containerRect.left - radius,
      y: clientRect.y - containerRect.top - radius,
    };
  }
}
