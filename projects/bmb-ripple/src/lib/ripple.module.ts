import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { RippleDirective } from './ripple.directive';

@NgModule({
  declarations: [RippleDirective],
  imports: [CommonModule, BrowserModule],
  exports: [RippleDirective],
})
export class RippleModule {}
