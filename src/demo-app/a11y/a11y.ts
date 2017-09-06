import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'accessibility-home',
  template: `<p>Welcome to the accessibility demos for Angular Material!</p>`,
})
export class AccessibilityHome {}

@Component({
  moduleId: module.id,
  selector: 'accessibility-demo',
  templateUrl: 'a11y.html',
  styleUrls: ['a11y.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccessibilityDemo {
  @ViewChild('maincontent') mainContent: ElementRef;

  navItems = [
    {name: 'Home', route: '.'},
    {name: 'Autocomplete', route: 'autocomplete'},
    {name: 'Button toggle', route: 'button-toggle'},
    {name: 'Button', route: 'button'},
    {name: 'Card', route: 'card'},
    {name: 'Checkbox', route: 'checkbox'},
    {name: 'Chips', route: 'chips'},
    {name: 'Datepicker', route: 'datepicker'},
    {name: 'Dialog', route: 'dialog'},
    {name: 'Expansion panel', route: 'expansion'},
    {name: 'Grid list', route: 'grid-list'},
    {name: 'Icon', route: 'icon'},
    {name: 'Input', route: 'input'},
    {name: 'List', route: 'list'},
    {name: 'Menu', route: 'menu'},
    {name: 'Progress bar', route: 'progress-bar'},
    {name: 'Progress spinner', route: 'progress-spinner'},
    {name: 'Radio buttons', route: 'radio'},
    {name: 'Select', route: 'select'},
    {name: 'Sidenav', route: 'sidenav'},
    {name: 'Slide toggle', route: 'slide-toggle'},
    {name: 'Slider', route: 'slider'},
    {name: 'Snack bar', route: 'snack-bar'},
    {name: 'Tabs', route: 'tabs'},
    {name: 'Toolbar', route: 'toolbar'},
    {name: 'Tooltip', route: 'tooltip'},
  ];

  skipNavigation() {
    this.mainContent.nativeElement.scrollIntoView();
    this.mainContent.nativeElement.focus();
  }
}
