/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  MdCommonModule,
  MdLineModule,
  MdPseudoCheckboxModule,
  MdRippleModule,
} from '@angular/material/core';
import {
  MdDividerCssMatStyler,
  MdList,
  MdListAvatarCssMatStyler,
  MdListDivider,
  MdListIconCssMatStyler,
  MdListItem,
  MdListSubheaderCssMatStyler,
} from './list';
import {MdListOption, MdSelectionList} from './selection-list';


@NgModule({
  imports: [MdLineModule, MdRippleModule, MdCommonModule, MdPseudoCheckboxModule, CommonModule],
  exports: [
    MdList,
    MdListItem,
    MdListDivider,
    MdListAvatarCssMatStyler,
    MdLineModule,
    MdCommonModule,
    MdListIconCssMatStyler,
    MdDividerCssMatStyler,
    MdListSubheaderCssMatStyler,
    MdPseudoCheckboxModule,
    MdSelectionList,
    MdListOption
  ],
  declarations: [
    MdList,
    MdListItem,
    MdListDivider,
    MdListAvatarCssMatStyler,
    MdListIconCssMatStyler,
    MdDividerCssMatStyler,
    MdListSubheaderCssMatStyler,
    MdSelectionList,
    MdListOption
  ],
})
export class MdListModule {}


export * from './list';
export * from './selection-list';
