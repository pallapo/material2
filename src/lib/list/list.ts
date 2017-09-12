/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Optional,
  QueryList,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {MdLine, MdLineSetter} from '@angular/material/core';
import {CanDisableRipple, mixinDisableRipple} from '@angular/material/core';

// Boilerplate for applying mixins to MdList.
/** @docs-private */
export class MdListBase {}
export const _MdListMixinBase = mixinDisableRipple(MdListBase);

// Boilerplate for applying mixins to MdListItem.
/** @docs-private */
export class MdListItemBase {}
export const _MdListItemMixinBase = mixinDisableRipple(MdListItemBase);


/** Divider between items within a list. */
@Directive({
  selector: 'md-divider, mat-divider',
  host: {
    'role': 'separator',
    'aria-orientation': 'horizontal'
  }
})
export class MdListDivider {}

/** A Material Design list component. */
@Component({
  moduleId: module.id,
  selector: 'md-nav-list, mat-nav-list',
  host: {
    'role': 'navigation',
    'class': 'mat-nav-list'
  },
  templateUrl: 'list.html',
  styleUrls: ['list.css'],
  inputs: ['disableRipple'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdNavList extends _MdListMixinBase implements CanDisableRipple {}

@Component({
  moduleId: module.id,
  selector: 'md-list, mat-list',
  templateUrl: 'list.html',
  host: {'class': 'mat-list'},
  styleUrls: ['list.css'],
  inputs: ['disableRipple'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdList extends _MdListMixinBase implements CanDisableRipple {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-divider, mat-divider',
  host: {'class': 'mat-divider'}
})
export class MdDividerCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-list-avatar], [mat-list-avatar], [mdListAvatar], [matListAvatar]',
  host: {'class': 'mat-list-avatar'}
})
export class MdListAvatarCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-list-icon], [mat-list-icon], [mdListIcon], [matListIcon]',
  host: {'class': 'mat-list-icon'}
})
export class MdListIconCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-subheader], [mat-subheader], [mdSubheader], [matSubheader]',
  host: {'class': 'mat-subheader'}
})
export class MdListSubheaderCssMatStyler {}

/** An item within a Material Design list. */
@Component({
  moduleId: module.id,
  selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
  host: {
    'role': 'listitem',
    'class': 'mat-list-item',
    '(focus)': '_handleFocus()',
    '(blur)': '_handleBlur()',
  },
  inputs: ['disableRipple'],
  templateUrl: 'list-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdListItem extends _MdListItemMixinBase implements AfterContentInit, CanDisableRipple {
  private _lineSetter: MdLineSetter;
  private _isNavList: boolean = false;

  @ContentChildren(MdLine) _lines: QueryList<MdLine>;

  @ContentChild(MdListAvatarCssMatStyler)
  set _hasAvatar(avatar: MdListAvatarCssMatStyler) {
    if (avatar != null) {
      this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
    } else {
      this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
    }
  }

  constructor(private _renderer: Renderer2,
              private _element: ElementRef,
              @Optional() private _navList: MdNavList) {
    super();
    this._isNavList = !!_navList;
  }

  ngAfterContentInit() {
    this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
  }

  /** Whether this list item should show a ripple effect when clicked.  */
  _isRippleDisabled() {
    return !this._isNavList || this.disableRipple || this._navList.disableRipple;
  }

  _handleFocus() {
    this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
  }

  _handleBlur() {
    this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
  }

  /** Retrieves the DOM element of the component host. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }
}
