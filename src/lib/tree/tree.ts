import {
  ViewChild,
  Component,
  Directive,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  ViewContainerRef,
  Input,
  forwardRef,
  IterableDiffers,
  IterableDiffer,
  Inject,
  ViewEncapsulation,
  ElementRef,
  Renderer,
  IterableChangeRecord
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import {TreeDataSource, MdTreeViewData} from './data-source';
import {SelectionModel, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, HOME, ENTER, ESCAPE, FocusOriginMonitor} from '../core';
import {FocusKeyManager, Focusable} from '../core/a11y/focus-key-manager';

/** Height of each row in pixels (48 + 1px border) */
export const ROW_HEIGHT = 49;

/** Amount of rows to buffer around the view */
export const BUFFER = 3;

@Directive({selector: '[mdNodeDef]'})
export class MdNodeDef {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  selector: 'md-node',
})
export class MdNode  implements Focusable {
  constructor(private elementRef: ElementRef,
              private renderer: Renderer,
              @Inject(forwardRef(() => MdTree)) private tree: MdTree,
              private _focusOriginMonitor: FocusOriginMonitor) {
    this.renderer.setElementClass(elementRef.nativeElement, 'mat-node', true);
    this._focusOriginMonitor.monitor(this.elementRef.nativeElement, this.renderer, true);
  }

  /** Focuses the menu item. */
  focus(): void {
    this.renderer.invokeElementMethod(this._getHostElement(), 'focus');
  }

  /** Returns the host DOM element. */
  _getHostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}

@Directive({selector: '[mdNodePlaceholder]'})
export class MdNodePlaceholder {
  constructor(public viewContainer: ViewContainerRef) { }
}

@Component({
  selector: 'md-tree',
  styleUrls: ['./tree.css'],
  template: `
    <ng-container mdNodePlaceholder></ng-container>
    <ng-template #emptyNode><div class="mat-placeholder"></div></ng-template>
  `,
  host: {
    'class': 'mat-tree',
    '(keydown)': 'handleKeydown($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdTree {
  @Input() dataSource: TreeDataSource<any>;

  viewChange = new BehaviorSubject<MdTreeViewData>({start: 0, end: 20});

  private _dataDiffer: IterableDiffer<any> = null;

  private _keyManager: FocusKeyManager;
  @ContentChildren(MdNode) items: QueryList<MdNode>;
  @ContentChildren(MdNodeDef) nodeDefinitions: QueryList<MdNodeDef>;
  @ViewChild(MdNodePlaceholder) nodePlaceholder: MdNodePlaceholder;
  @ViewChild('emptyNode') emptyNodeTemplate: TemplateRef<any>;



  constructor(private _differs: IterableDiffers, private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {
    this._dataDiffer = this._differs.find([]).create();
  }

  ngOnInit() {
    Observable.fromEvent(this.elementRef.nativeElement, 'scroll')
      .debounceTime(100)
      .subscribe(() => this.scrollEvent());
  }

  ngAfterViewInit() {
    this._keyManager = new FocusKeyManager(this.items).withWrap();
    console.log(`this items ${this.items}`);
    this.dataSource.connectTree(this.viewChange).subscribe((result: any[]) => this.renderNodeChanges(result));
  }

  scrollToTop() {
    this.elementRef.nativeElement.scrollTop = 0;
  }

  scrollEvent() {
    console.log(`scroll event `);
    const scrollTop = this.elementRef.nativeElement.scrollTop;
    const elementHeight = this.elementRef.nativeElement.getBoundingClientRect().height;

    const topIndex = Math.floor(scrollTop / ROW_HEIGHT);

    const view = {
      start: Math.max(topIndex - BUFFER, 0),
      end: Math.ceil(topIndex + (elementHeight / ROW_HEIGHT)) + BUFFER
    };

    this.viewChange.next(view);
  }


  handleKeydown(event) {
    console.log(this.items.length);
    console.log(`Tree handle key down ${event.keyCode} Tree is ${this}`);
    if (event.keyCode == UP_ARROW) {
      this._keyManager.setPreviousItemActive();
      // Move to previous index scrollToIndex(focusIndex - 1)
      console.log(`// Move to previous index scrollToIndex(focusIndex - 1)`);
    } else if (event.keyCode == DOWN_ARROW) {
      this._keyManager.setNextItemActive();
      console.log(`// Move to next index scrollToIndex(focusIndex + 1)`);
      // Move to next index scrollToIndex(focusIndex + 1)
    } else if (event.keyCode == RIGHT_ARROW) {
      console.log(`// If focus expandable, expand, scrollToIndex(focusIndex + 1)`);
      // If focus expandable, expand, scrollToIndex(focusIndex + 1)
    } else if (event.keyCode == LEFT_ARROW) {
      console.log(`// goToParent(focusIndex), collapse parent node`);
      // goToParent(focusIndex), collapse parent node
    }
  }

  scrollToIndex(topIndex: number) {
    const elementHeight = this.elementRef.nativeElement.getBoundingClientRect().height;
    const view = {
      start: Math.max(topIndex - BUFFER, 0),
      end: Math.ceil(topIndex + (elementHeight / ROW_HEIGHT)) + BUFFER
    };
    console.log(view);
    this.viewChange.next(view);
    this.elementRef.nativeElement.scrollTop = topIndex * ROW_HEIGHT;
  }

  renderNodeChanges(dataNodes: any[]) {
    console.time('Rendering rows');
    const changes = this._dataDiffer.diff(dataNodes);
    if (!changes) { return; }

    const oldScrollTop = this.elementRef.nativeElement.scrollTop;
    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          console.log('Adding row ');
          this.addNode(dataNodes[currentIndex], currentIndex);
        } else if (currentIndex == null) {
          console.log('Removing a row ');
          this.nodePlaceholder.viewContainer.remove(adjustedPreviousIndex);
        } else {
          console.log('Moving a row');
          const view = this.nodePlaceholder.viewContainer.get(adjustedPreviousIndex);
          this.nodePlaceholder.viewContainer.move(view, currentIndex);
        }
      });

    // Scroll changes in the process of adding/removing rows. Reset it back to where it was
    // so that it (1) it does not shift and (2) a scroll event does not get triggered which
    // would cause a loop.
    this.elementRef.nativeElement.scrollTop = oldScrollTop;
    this.changeDetectorRef.detectChanges();
    console.timeEnd('Rendering rows');
  }

  addNode(data: any, currentIndex: number) {
    if (!!data) {
      let node = this.getNodeDefForItem(data);
      const context = {
        $implicit: data,
        level: this.dataSource.getLevel(data),// levelMap.get(this.dataSource.getKey(data)),
        expandable: !!this.dataSource.getChildren(data),
      };
      this.nodePlaceholder.viewContainer.createEmbeddedView(node.template, context, currentIndex);
    } else {
      this.nodePlaceholder.viewContainer.createEmbeddedView(this.emptyNodeTemplate, {}, currentIndex);
    }
  }

  gotoParent(node: any) {
    let parent = this.dataSource.getParent(node);
    let index = this.dataSource.getIndex(parent);
    console.log(index);
    this.scrollToIndex(index);
  }

  toggleExpand(node: any) {
    this.dataSource.expansionModel.toggle(node);
  }

  getNodeDefForItem(item: any) {
    // proof-of-concept: only supporting one row definition
    return this.nodeDefinitions.first;
  }
}