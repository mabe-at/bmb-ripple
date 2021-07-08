import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  centered = false;
  disabled = false;
  unbounded = false;
  radius = 100;
  color = '#ccc';
}
