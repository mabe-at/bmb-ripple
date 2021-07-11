# BmbRipple

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.14.

## How to install
```
npm install bmb-ripple --save-dev
```

## Add bmb-ripple to your module where you want to use it
```javascript
import { RippleModule } from 'bmb-ripple'; 
```

## Add styles
Add these styles below to your index.css
```css
.ripple-element {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  opacity: 0.75;
  animation: ripple 0.4s linear;
  z-index: -1;
}

@keyframes ripple {
  to {
    transform: scale(1);
    opacity: 0;
  }
}
```

## How to use

```html
<div
  bmbRipple
  [centered]="false"
  [disabled]="false"
  [unbounded]="false"
  [radius]="100"
  [color]="#ccc"
>
  Click me
</div>
```

## Code scaffolding

Run `ng generate component component-name --project bmb-ripple` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project bmb-ripple`.
> Note: Don't forget to add `--project bmb-ripple` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build bmb-ripple` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build bmb-ripple`, go to the dist folder `cd dist/bmb-ripple` and run `npm publish`.

## Running unit tests

Run `ng test bmb-ripple` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
