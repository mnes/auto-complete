import { __decorate } from "tslib";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NguiAutoComplete } from './auto-complete.service';
let NguiAutoCompleteComponent = class NguiAutoCompleteComponent {
    /**
     * constructor
     */
    constructor(elementRef, autoComplete) {
        this.autoComplete = autoComplete;
        /**
         * public input properties
         */
        this.autocomplete = false;
        this.minChars = 0;
        this.acceptUserInput = true;
        this.loadingText = 'Loading';
        this.loadingTemplate = null;
        this.showInputTag = true;
        this.showDropdownOnInit = false;
        this.tabToSelect = true;
        this.matchFormatted = false;
        this.autoSelectFirstItem = false;
        this.selectOnBlur = false;
        this.reFocusAfterSelect = true;
        this.headerItemTemplate = null;
        this.ignoreAccents = true;
        this.noFiltering = false;
        this.valueSelected = new EventEmitter();
        this.customSelected = new EventEmitter();
        this.textEntered = new EventEmitter();
        this.dropdownVisible = false;
        this.isLoading = false;
        this.filteredList = [];
        this.minCharsEntered = false;
        this.itemIndex = null;
        this.timer = 0;
        this.delay = (() => {
            let timer = null;
            return (callback, ms) => {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        this.selectOnEnter = false;
        this.reloadListInDelay = (evt) => {
            const delayMs = this.isSrcArr() ? 10 : 500;
            const keyword = evt.target.value;
            // executing after user stopped typing
            this.delay(() => this.reloadList(keyword), delayMs);
        };
        this.inputElKeyHandler = (evt) => {
            const totalNumItem = this.filteredList.length;
            if (!this.selectOnEnter && this.autoSelectFirstItem && (0 !== totalNumItem)) {
                this.selectOnEnter = true;
            }
            switch (evt.keyCode) {
                case 27: // ESC, hide auto complete
                    this.selectOnEnter = false;
                    this.selectOne(undefined);
                    break;
                case 38: // UP, select the previous li el
                    if (0 === totalNumItem) {
                        return;
                    }
                    this.selectOnEnter = true;
                    this.itemIndex = (totalNumItem + this.itemIndex - 1) % totalNumItem;
                    this.scrollToView(this.itemIndex);
                    break;
                case 40: // DOWN, select the next li el or the first one
                    if (0 === totalNumItem) {
                        return;
                    }
                    this.selectOnEnter = true;
                    this.dropdownVisible = true;
                    let sum = this.itemIndex;
                    sum = (this.itemIndex === null) ? 0 : sum + 1;
                    this.itemIndex = (totalNumItem + sum) % totalNumItem;
                    this.scrollToView(this.itemIndex);
                    break;
                case 13: // ENTER, choose it!!
                    if (this.selectOnEnter) {
                        this.selectOne(this.filteredList[this.itemIndex]);
                    }
                    evt.preventDefault();
                    break;
                case 9: // TAB, choose if tab-to-select is enabled
                    if (this.tabToSelect) {
                        this.selectOne(this.filteredList[this.itemIndex]);
                    }
                    break;
            }
        };
        this.el = elementRef.nativeElement;
    }
    /**
     * user enters into input el, shows list to select, then select one
     */
    ngOnInit() {
        this.autoComplete.source = this.source;
        this.autoComplete.pathToData = this.pathToData;
        this.autoComplete.listFormatter = this.listFormatter;
        if (this.autoSelectFirstItem) {
            this.itemIndex = 0;
        }
        setTimeout(() => {
            if (this.autoCompleteInput && this.reFocusAfterSelect) {
                this.autoCompleteInput.nativeElement.focus();
            }
            if (this.showDropdownOnInit) {
                this.showDropdownList({ target: { value: '' } });
            }
        });
    }
    isSrcArr() {
        return Array.isArray(this.source);
    }
    showDropdownList(event) {
        this.dropdownVisible = true;
        this.reloadList(event.target.value);
    }
    hideDropdownList() {
        this.selectOnEnter = false;
        this.dropdownVisible = false;
    }
    findItemFromSelectValue(selectText) {
        const matchingItems = this.filteredList.filter((item) => ('' + item) === selectText);
        return matchingItems.length ? matchingItems[0] : null;
    }
    reloadList(keyword) {
        this.filteredList = [];
        if (keyword.length < (this.minChars || 0)) {
            this.minCharsEntered = false;
            return;
        }
        else {
            this.minCharsEntered = true;
        }
        if (this.isSrcArr()) { // local source
            this.isLoading = false;
            this.filteredList = this.autoComplete.filter(this.source, keyword, this.matchFormatted, this.ignoreAccents, this.noFiltering);
            if (this.maxNumList) {
                this.filteredList = this.filteredList.slice(0, this.maxNumList);
            }
        }
        else { // remote source
            this.isLoading = true;
            if (typeof this.source === 'function') {
                // custom function that returns observable
                this.source(keyword).subscribe((resp) => {
                    if (this.pathToData) {
                        const paths = this.pathToData.split('.');
                        paths.forEach((prop) => resp = resp[prop]);
                    }
                    this.filteredList = resp;
                    if (this.maxNumList) {
                        this.filteredList = this.filteredList.slice(0, this.maxNumList);
                    }
                }, (error) => null, () => this.isLoading = false // complete
                );
            }
            else {
                // remote source
                this.autoComplete.getRemoteData(keyword).subscribe((resp) => {
                    this.filteredList = resp ? resp : [];
                    if (this.maxNumList) {
                        this.filteredList = this.filteredList.slice(0, this.maxNumList);
                    }
                }, (error) => null, () => this.isLoading = false // complete
                );
            }
        }
    }
    selectOne(data) {
        if (!!data || data === '') {
            this.valueSelected.emit(data);
        }
        else {
            this.customSelected.emit(this.keyword);
        }
    }
    enterText(data) {
        this.textEntered.emit(data);
    }
    blurHandler(evt) {
        if (this.selectOnBlur) {
            this.selectOne(this.filteredList[this.itemIndex]);
        }
        this.hideDropdownList();
    }
    scrollToView(index) {
        const container = this.autoCompleteContainer.nativeElement;
        const ul = container.querySelector('ul');
        const li = ul.querySelector('li'); // just sample the first li to get height
        const liHeight = li.offsetHeight;
        const scrollTop = ul.scrollTop;
        const viewport = scrollTop + ul.offsetHeight;
        const scrollOffset = liHeight * index;
        if (scrollOffset < scrollTop || (scrollOffset + liHeight) > viewport) {
            ul.scrollTop = scrollOffset;
        }
    }
    trackByIndex(index, item) {
        return index;
    }
    get emptyList() {
        return !(this.isLoading ||
            (this.minCharsEntered && !this.isLoading && !this.filteredList.length) ||
            (this.filteredList.length));
    }
};
NguiAutoCompleteComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NguiAutoComplete }
];
__decorate([
    Input('autocomplete')
], NguiAutoCompleteComponent.prototype, "autocomplete", void 0);
__decorate([
    Input('list-formatter')
], NguiAutoCompleteComponent.prototype, "listFormatter", void 0);
__decorate([
    Input('source')
], NguiAutoCompleteComponent.prototype, "source", void 0);
__decorate([
    Input('path-to-data')
], NguiAutoCompleteComponent.prototype, "pathToData", void 0);
__decorate([
    Input('min-chars')
], NguiAutoCompleteComponent.prototype, "minChars", void 0);
__decorate([
    Input('placeholder')
], NguiAutoCompleteComponent.prototype, "placeholder", void 0);
__decorate([
    Input('blank-option-text')
], NguiAutoCompleteComponent.prototype, "blankOptionText", void 0);
__decorate([
    Input('no-match-found-text')
], NguiAutoCompleteComponent.prototype, "noMatchFoundText", void 0);
__decorate([
    Input('accept-user-input')
], NguiAutoCompleteComponent.prototype, "acceptUserInput", void 0);
__decorate([
    Input('loading-text')
], NguiAutoCompleteComponent.prototype, "loadingText", void 0);
__decorate([
    Input('loading-template')
], NguiAutoCompleteComponent.prototype, "loadingTemplate", void 0);
__decorate([
    Input('max-num-list')
], NguiAutoCompleteComponent.prototype, "maxNumList", void 0);
__decorate([
    Input('show-input-tag')
], NguiAutoCompleteComponent.prototype, "showInputTag", void 0);
__decorate([
    Input('show-dropdown-on-init')
], NguiAutoCompleteComponent.prototype, "showDropdownOnInit", void 0);
__decorate([
    Input('tab-to-select')
], NguiAutoCompleteComponent.prototype, "tabToSelect", void 0);
__decorate([
    Input('match-formatted')
], NguiAutoCompleteComponent.prototype, "matchFormatted", void 0);
__decorate([
    Input('auto-select-first-item')
], NguiAutoCompleteComponent.prototype, "autoSelectFirstItem", void 0);
__decorate([
    Input('select-on-blur')
], NguiAutoCompleteComponent.prototype, "selectOnBlur", void 0);
__decorate([
    Input('re-focus-after-select')
], NguiAutoCompleteComponent.prototype, "reFocusAfterSelect", void 0);
__decorate([
    Input('header-item-template')
], NguiAutoCompleteComponent.prototype, "headerItemTemplate", void 0);
__decorate([
    Input('ignore-accents')
], NguiAutoCompleteComponent.prototype, "ignoreAccents", void 0);
__decorate([
    Input("no-filtering")
], NguiAutoCompleteComponent.prototype, "noFiltering", void 0);
__decorate([
    Output()
], NguiAutoCompleteComponent.prototype, "valueSelected", void 0);
__decorate([
    Output()
], NguiAutoCompleteComponent.prototype, "customSelected", void 0);
__decorate([
    Output()
], NguiAutoCompleteComponent.prototype, "textEntered", void 0);
__decorate([
    ViewChild('autoCompleteInput')
], NguiAutoCompleteComponent.prototype, "autoCompleteInput", void 0);
__decorate([
    ViewChild('autoCompleteContainer')
], NguiAutoCompleteComponent.prototype, "autoCompleteContainer", void 0);
NguiAutoCompleteComponent = __decorate([
    Component({
        selector: 'ngui-auto-complete',
        template: `
    <div #autoCompleteContainer class="ngui-auto-complete">
      <!-- keyword input -->
      <input *ngIf="showInputTag"
             #autoCompleteInput class="keyword"
             [attr.autocomplete]="autocomplete ? 'null' : 'off'"
             placeholder="{{placeholder}}"
             (focus)="showDropdownList($event)"
             (blur)="blurHandler($event)"
             (keydown)="inputElKeyHandler($event)"
             (input)="reloadListInDelay($event)"
             [(ngModel)]="keyword"/>

      <!-- dropdown that user can select -->
      <ul *ngIf="dropdownVisible" [class.empty]="emptyList">
        <li *ngIf="isLoading && loadingTemplate" class="loading"
            [innerHTML]="loadingTemplate"></li>
        <li *ngIf="isLoading && !loadingTemplate" class="loading">{{loadingText}}</li>
        <li *ngIf="minCharsEntered && !isLoading && !filteredList.length"
            (mousedown)="selectOne('')"
            class="no-match-found">{{noMatchFoundText || 'No Result Found'}}
        </li>
        <li *ngIf="headerItemTemplate && filteredList.length" class="header-item"
            [innerHTML]="headerItemTemplate"></li>
        <li *ngIf="blankOptionText && filteredList.length"
            (mousedown)="selectOne('')"
            class="blank-item">{{blankOptionText}}
        </li>
        <li class="item"
            *ngFor="let item of filteredList; let i=index; trackBy: trackByIndex"
            (mousedown)="selectOne(item)"
            [ngClass]="{selected: i === itemIndex}"
            [innerHtml]="autoComplete.getFormattedListItem(item)">
        </li>
      </ul>

    </div>
  `,
        encapsulation: ViewEncapsulation.None,
        styles: [`
    @keyframes slideDown {
      0% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    .ngui-auto-complete {
      background-color: transparent;
    }

    .ngui-auto-complete > input {
      outline: none;
      border: 0;
      padding: 2px;
      box-sizing: border-box;
      background-clip: content-box;
    }

    .ngui-auto-complete > ul {
      background-color: #fff;
      margin: 0;
      width: 100%;
      overflow-y: auto;
      list-style-type: none;
      padding: 0;
      border: 1px solid #ccc;
      box-sizing: border-box;
      animation: slideDown 0.1s;
    }

    .ngui-auto-complete > ul.empty {
      display: none;
    }

    .ngui-auto-complete > ul li {
      padding: 2px 5px;
      border-bottom: 1px solid #eee;
    }

    .ngui-auto-complete > ul li.selected {
      background-color: #ccc;
    }

    .ngui-auto-complete > ul li:last-child {
      border-bottom: none;
    }

    .ngui-auto-complete > ul li:not(.header-item):hover {
      background-color: #ccc;
    }`]
    })
], NguiAutoCompleteComponent);
export { NguiAutoCompleteComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd1aS9hdXRvLWNvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG8tY29tcGxldGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pILE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBbUczRCxJQUFhLHlCQUF5QixHQUF0QyxNQUFhLHlCQUF5QjtJQXVEcEM7O09BRUc7SUFDSCxZQUFZLFVBQXNCLEVBQVMsWUFBOEI7UUFBOUIsaUJBQVksR0FBWixZQUFZLENBQWtCO1FBeER6RTs7V0FFRztRQUMyQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUl4QixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBSUwsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFDcEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFekIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDYix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDbkMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDakIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDaEIsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ2QsdUJBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQzNCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUNoQyxrQkFBYSxHQUFHLElBQUksQ0FBQztRQUM5QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUVuQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3BDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUszQyxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLGlCQUFZLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFJeEIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVWLFVBQUssR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNwQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsT0FBTyxDQUFDLFFBQWEsRUFBRSxFQUFVLEVBQUUsRUFBRTtnQkFDbkMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ0csa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFpQ3ZCLHNCQUFpQixHQUFHLENBQUMsR0FBUSxFQUFRLEVBQUU7WUFDNUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUMzQyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUVqQyxzQ0FBc0M7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQTtRQTJGTSxzQkFBaUIsR0FBRyxDQUFDLEdBQVEsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBRTlDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsRUFBRTtnQkFDM0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7YUFDM0I7WUFFRCxRQUFRLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ25CLEtBQUssRUFBRSxFQUFFLDBCQUEwQjtvQkFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7b0JBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzFCLE1BQU07Z0JBRVIsS0FBSyxFQUFFLEVBQUUsZ0NBQWdDO29CQUN2QyxJQUFJLENBQUMsS0FBSyxZQUFZLEVBQUU7d0JBQ3RCLE9BQU87cUJBQ1I7b0JBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUM7b0JBQ3BFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNsQyxNQUFNO2dCQUVSLEtBQUssRUFBRSxFQUFFLCtDQUErQztvQkFDdEQsSUFBSSxDQUFDLEtBQUssWUFBWSxFQUFFO3dCQUN0QixPQUFPO3FCQUNSO29CQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztvQkFDNUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDekIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQztvQkFDckQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2xDLE1BQU07Z0JBRVIsS0FBSyxFQUFFLEVBQUUscUJBQXFCO29CQUM1QixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztxQkFDbkQ7b0JBQ0QsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNyQixNQUFNO2dCQUVSLEtBQUssQ0FBQyxFQUFFLDBDQUEwQztvQkFDaEQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7cUJBQ25EO29CQUNELE1BQU07YUFDVDtRQUNILENBQUMsQ0FBQTtRQTNLQyxJQUFJLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7SUFDckMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUTtRQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMvQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3JELElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBQ0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDckQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUM5QztZQUNELElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUMzQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2FBQzlDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNiLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQVVNLGdCQUFnQixDQUFDLEtBQVU7UUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxnQkFBZ0I7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVNLHVCQUF1QixDQUFDLFVBQWtCO1FBQy9DLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQztRQUNyRixPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hELENBQUM7SUFFTSxVQUFVLENBQUMsT0FBZTtRQUUvQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBQzdCLE9BQU87U0FDUjthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFLLGVBQWU7WUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlILElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2pFO1NBRUY7YUFBTSxFQUFrQixnQkFBZ0I7WUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFFdEIsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO2dCQUNyQywwQ0FBMEM7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUM1QixDQUFDLElBQUksRUFBRSxFQUFFO29CQUVQLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3pDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDNUM7b0JBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3pCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUNqRTtnQkFDSCxDQUFDLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksRUFDZixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXO2lCQUN6QyxDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsZ0JBQWdCO2dCQUVoQixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNyQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDakU7Z0JBQ0gsQ0FBQyxFQUNELENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQ2YsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsV0FBVztpQkFDekMsQ0FBQzthQUNIO1NBQ0Y7SUFDSCxDQUFDO0lBRU0sU0FBUyxDQUFDLElBQVM7UUFDeEIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFTSxTQUFTLENBQUMsSUFBUztRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sV0FBVyxDQUFDLEdBQVE7UUFDekIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFtRE0sWUFBWSxDQUFDLEtBQUs7UUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQztRQUMzRCxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSx5Q0FBeUM7UUFDN0UsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztRQUNqQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDO1FBQy9CLE1BQU0sUUFBUSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEMsSUFBSSxZQUFZLEdBQUcsU0FBUyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxHQUFHLFFBQVEsRUFBRTtZQUNwRSxFQUFFLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFTSxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDN0IsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxDQUFDLENBQ04sSUFBSSxDQUFDLFNBQVM7WUFDZCxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDdEUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUMzQixDQUFDO0lBQ0osQ0FBQztDQUVGLENBQUE7O1lBdk15QixVQUFVO1lBQXVCLGdCQUFnQjs7QUFyRGxEO0lBQXRCLEtBQUssQ0FBQyxjQUFjLENBQUM7K0RBQTZCO0FBQzFCO0lBQXhCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztnRUFBNEM7QUFDbkQ7SUFBaEIsS0FBSyxDQUFDLFFBQVEsQ0FBQzt5REFBb0I7QUFDYjtJQUF0QixLQUFLLENBQUMsY0FBYyxDQUFDOzZEQUEyQjtBQUM3QjtJQUFuQixLQUFLLENBQUMsV0FBVyxDQUFDOzJEQUFxQjtBQUNsQjtJQUFyQixLQUFLLENBQUMsYUFBYSxDQUFDOzhEQUE0QjtBQUNyQjtJQUEzQixLQUFLLENBQUMsbUJBQW1CLENBQUM7a0VBQWdDO0FBQzdCO0lBQTdCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQzttRUFBaUM7QUFDbEM7SUFBM0IsS0FBSyxDQUFDLG1CQUFtQixDQUFDO2tFQUErQjtBQUNuQztJQUF0QixLQUFLLENBQUMsY0FBYyxDQUFDOzhEQUFnQztBQUMzQjtJQUExQixLQUFLLENBQUMsa0JBQWtCLENBQUM7a0VBQStCO0FBQ2xDO0lBQXRCLEtBQUssQ0FBQyxjQUFjLENBQUM7NkRBQTJCO0FBQ3hCO0lBQXhCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQzsrREFBNEI7QUFDcEI7SUFBL0IsS0FBSyxDQUFDLHVCQUF1QixDQUFDO3FFQUFtQztBQUMxQztJQUF2QixLQUFLLENBQUMsZUFBZSxDQUFDOzhEQUEyQjtBQUN4QjtJQUF6QixLQUFLLENBQUMsaUJBQWlCLENBQUM7aUVBQStCO0FBQ3ZCO0lBQWhDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztzRUFBb0M7QUFDM0M7SUFBeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDOytEQUE2QjtBQUNyQjtJQUEvQixLQUFLLENBQUMsdUJBQXVCLENBQUM7cUVBQWtDO0FBQ2xDO0lBQTlCLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztxRUFBa0M7QUFDdkM7SUFBeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDO2dFQUE2QjtBQUM5QjtJQUF0QixLQUFLLENBQUMsY0FBYyxDQUFDOzhEQUE4QjtBQUUxQztJQUFULE1BQU0sRUFBRTtnRUFBMkM7QUFDMUM7SUFBVCxNQUFNLEVBQUU7aUVBQTRDO0FBQzNDO0lBQVQsTUFBTSxFQUFFOzhEQUF5QztBQUVsQjtJQUEvQixTQUFTLENBQUMsbUJBQW1CLENBQUM7b0VBQXNDO0FBQ2pDO0lBQW5DLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQzt3RUFBMEM7QUFqQ2xFLHlCQUF5QjtJQWpHckMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG9CQUFvQjtRQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQ1Q7UUF3REQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBdkQ1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxREw7S0FHTCxDQUFDO0dBQ1cseUJBQXlCLENBaVFyQztTQWpRWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlIH0gZnJvbSAnLi9hdXRvLWNvbXBsZXRlLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3VpLWF1dG8tY29tcGxldGUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgI2F1dG9Db21wbGV0ZUNvbnRhaW5lciBjbGFzcz1cIm5ndWktYXV0by1jb21wbGV0ZVwiPlxuICAgICAgPCEtLSBrZXl3b3JkIGlucHV0IC0tPlxuICAgICAgPGlucHV0ICpuZ0lmPVwic2hvd0lucHV0VGFnXCJcbiAgICAgICAgICAgICAjYXV0b0NvbXBsZXRlSW5wdXQgY2xhc3M9XCJrZXl3b3JkXCJcbiAgICAgICAgICAgICBbYXR0ci5hdXRvY29tcGxldGVdPVwiYXV0b2NvbXBsZXRlID8gJ251bGwnIDogJ29mZidcIlxuICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwie3twbGFjZWhvbGRlcn19XCJcbiAgICAgICAgICAgICAoZm9jdXMpPVwic2hvd0Ryb3Bkb3duTGlzdCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAoYmx1cik9XCJibHVySGFuZGxlcigkZXZlbnQpXCJcbiAgICAgICAgICAgICAoa2V5ZG93bik9XCJpbnB1dEVsS2V5SGFuZGxlcigkZXZlbnQpXCJcbiAgICAgICAgICAgICAoaW5wdXQpPVwicmVsb2FkTGlzdEluRGVsYXkoJGV2ZW50KVwiXG4gICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJrZXl3b3JkXCIvPlxuXG4gICAgICA8IS0tIGRyb3Bkb3duIHRoYXQgdXNlciBjYW4gc2VsZWN0IC0tPlxuICAgICAgPHVsICpuZ0lmPVwiZHJvcGRvd25WaXNpYmxlXCIgW2NsYXNzLmVtcHR5XT1cImVtcHR5TGlzdFwiPlxuICAgICAgICA8bGkgKm5nSWY9XCJpc0xvYWRpbmcgJiYgbG9hZGluZ1RlbXBsYXRlXCIgY2xhc3M9XCJsb2FkaW5nXCJcbiAgICAgICAgICAgIFtpbm5lckhUTUxdPVwibG9hZGluZ1RlbXBsYXRlXCI+PC9saT5cbiAgICAgICAgPGxpICpuZ0lmPVwiaXNMb2FkaW5nICYmICFsb2FkaW5nVGVtcGxhdGVcIiBjbGFzcz1cImxvYWRpbmdcIj57e2xvYWRpbmdUZXh0fX08L2xpPlxuICAgICAgICA8bGkgKm5nSWY9XCJtaW5DaGFyc0VudGVyZWQgJiYgIWlzTG9hZGluZyAmJiAhZmlsdGVyZWRMaXN0Lmxlbmd0aFwiXG4gICAgICAgICAgICAobW91c2Vkb3duKT1cInNlbGVjdE9uZSgnJylcIlxuICAgICAgICAgICAgY2xhc3M9XCJuby1tYXRjaC1mb3VuZFwiPnt7bm9NYXRjaEZvdW5kVGV4dCB8fCAnTm8gUmVzdWx0IEZvdW5kJ319XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaSAqbmdJZj1cImhlYWRlckl0ZW1UZW1wbGF0ZSAmJiBmaWx0ZXJlZExpc3QubGVuZ3RoXCIgY2xhc3M9XCJoZWFkZXItaXRlbVwiXG4gICAgICAgICAgICBbaW5uZXJIVE1MXT1cImhlYWRlckl0ZW1UZW1wbGF0ZVwiPjwvbGk+XG4gICAgICAgIDxsaSAqbmdJZj1cImJsYW5rT3B0aW9uVGV4dCAmJiBmaWx0ZXJlZExpc3QubGVuZ3RoXCJcbiAgICAgICAgICAgIChtb3VzZWRvd24pPVwic2VsZWN0T25lKCcnKVwiXG4gICAgICAgICAgICBjbGFzcz1cImJsYW5rLWl0ZW1cIj57e2JsYW5rT3B0aW9uVGV4dH19XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaSBjbGFzcz1cIml0ZW1cIlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgZmlsdGVyZWRMaXN0OyBsZXQgaT1pbmRleDsgdHJhY2tCeTogdHJhY2tCeUluZGV4XCJcbiAgICAgICAgICAgIChtb3VzZWRvd24pPVwic2VsZWN0T25lKGl0ZW0pXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntzZWxlY3RlZDogaSA9PT0gaXRlbUluZGV4fVwiXG4gICAgICAgICAgICBbaW5uZXJIdG1sXT1cImF1dG9Db21wbGV0ZS5nZXRGb3JtYXR0ZWRMaXN0SXRlbShpdGVtKVwiPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cblxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgQGtleWZyYW1lcyBzbGlkZURvd24ge1xuICAgICAgMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTEwcHgpO1xuICAgICAgfVxuICAgICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwcHgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC5uZ3VpLWF1dG8tY29tcGxldGUge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgfVxuXG4gICAgLm5ndWktYXV0by1jb21wbGV0ZSA+IGlucHV0IHtcbiAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICBib3JkZXI6IDA7XG4gICAgICBwYWRkaW5nOiAycHg7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgYmFja2dyb3VuZC1jbGlwOiBjb250ZW50LWJveDtcbiAgICB9XG5cbiAgICAubmd1aS1hdXRvLWNvbXBsZXRlID4gdWwge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcbiAgICAgIHBhZGRpbmc6IDA7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIGFuaW1hdGlvbjogc2xpZGVEb3duIDAuMXM7XG4gICAgfVxuXG4gICAgLm5ndWktYXV0by1jb21wbGV0ZSA+IHVsLmVtcHR5IHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuXG4gICAgLm5ndWktYXV0by1jb21wbGV0ZSA+IHVsIGxpIHtcbiAgICAgIHBhZGRpbmc6IDJweCA1cHg7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTtcbiAgICB9XG5cbiAgICAubmd1aS1hdXRvLWNvbXBsZXRlID4gdWwgbGkuc2VsZWN0ZWQge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcbiAgICB9XG5cbiAgICAubmd1aS1hdXRvLWNvbXBsZXRlID4gdWwgbGk6bGFzdC1jaGlsZCB7XG4gICAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgIH1cblxuICAgIC5uZ3VpLWF1dG8tY29tcGxldGUgPiB1bCBsaTpub3QoLmhlYWRlci1pdGVtKTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICAgIH1gXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTmd1aUF1dG9Db21wbGV0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgLyoqXG4gICAqIHB1YmxpYyBpbnB1dCBwcm9wZXJ0aWVzXG4gICAqL1xuICBASW5wdXQoJ2F1dG9jb21wbGV0ZScpIHB1YmxpYyBhdXRvY29tcGxldGUgPSBmYWxzZTtcbiAgQElucHV0KCdsaXN0LWZvcm1hdHRlcicpIHB1YmxpYyBsaXN0Rm9ybWF0dGVyOiAoYXJnOiBhbnkpID0+IHN0cmluZztcbiAgQElucHV0KCdzb3VyY2UnKSBwdWJsaWMgc291cmNlOiBhbnk7XG4gIEBJbnB1dCgncGF0aC10by1kYXRhJykgcHVibGljIHBhdGhUb0RhdGE6IHN0cmluZztcbiAgQElucHV0KCdtaW4tY2hhcnMnKSBwdWJsaWMgbWluQ2hhcnMgPSAwO1xuICBASW5wdXQoJ3BsYWNlaG9sZGVyJykgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIEBJbnB1dCgnYmxhbmstb3B0aW9uLXRleHQnKSBwdWJsaWMgYmxhbmtPcHRpb25UZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgnbm8tbWF0Y2gtZm91bmQtdGV4dCcpIHB1YmxpYyBub01hdGNoRm91bmRUZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgnYWNjZXB0LXVzZXItaW5wdXQnKSBwdWJsaWMgYWNjZXB0VXNlcklucHV0ID0gdHJ1ZTtcbiAgQElucHV0KCdsb2FkaW5nLXRleHQnKSBwdWJsaWMgbG9hZGluZ1RleHQgPSAnTG9hZGluZyc7XG4gIEBJbnB1dCgnbG9hZGluZy10ZW1wbGF0ZScpIHB1YmxpYyBsb2FkaW5nVGVtcGxhdGUgPSBudWxsO1xuICBASW5wdXQoJ21heC1udW0tbGlzdCcpIHB1YmxpYyBtYXhOdW1MaXN0OiBudW1iZXI7XG4gIEBJbnB1dCgnc2hvdy1pbnB1dC10YWcnKSBwdWJsaWMgc2hvd0lucHV0VGFnID0gdHJ1ZTtcbiAgQElucHV0KCdzaG93LWRyb3Bkb3duLW9uLWluaXQnKSBwdWJsaWMgc2hvd0Ryb3Bkb3duT25Jbml0ID0gZmFsc2U7XG4gIEBJbnB1dCgndGFiLXRvLXNlbGVjdCcpIHB1YmxpYyB0YWJUb1NlbGVjdCA9IHRydWU7XG4gIEBJbnB1dCgnbWF0Y2gtZm9ybWF0dGVkJykgcHVibGljIG1hdGNoRm9ybWF0dGVkID0gZmFsc2U7XG4gIEBJbnB1dCgnYXV0by1zZWxlY3QtZmlyc3QtaXRlbScpIHB1YmxpYyBhdXRvU2VsZWN0Rmlyc3RJdGVtID0gZmFsc2U7XG4gIEBJbnB1dCgnc2VsZWN0LW9uLWJsdXInKSBwdWJsaWMgc2VsZWN0T25CbHVyID0gZmFsc2U7XG4gIEBJbnB1dCgncmUtZm9jdXMtYWZ0ZXItc2VsZWN0JykgcHVibGljIHJlRm9jdXNBZnRlclNlbGVjdCA9IHRydWU7XG4gIEBJbnB1dCgnaGVhZGVyLWl0ZW0tdGVtcGxhdGUnKSBwdWJsaWMgaGVhZGVySXRlbVRlbXBsYXRlID0gbnVsbDtcbiAgQElucHV0KCdpZ25vcmUtYWNjZW50cycpIHB1YmxpYyBpZ25vcmVBY2NlbnRzID0gdHJ1ZTtcbiAgQElucHV0KFwibm8tZmlsdGVyaW5nXCIpIG5vRmlsdGVyaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIHB1YmxpYyB2YWx1ZVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIGN1c3RvbVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIHRleHRFbnRlcmVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2F1dG9Db21wbGV0ZUlucHV0JykgcHVibGljIGF1dG9Db21wbGV0ZUlucHV0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdhdXRvQ29tcGxldGVDb250YWluZXInKSBwdWJsaWMgYXV0b0NvbXBsZXRlQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gIHB1YmxpYyBkcm9wZG93blZpc2libGUgPSBmYWxzZTtcbiAgcHVibGljIGlzTG9hZGluZyA9IGZhbHNlO1xuXG4gIHB1YmxpYyBmaWx0ZXJlZExpc3Q6IGFueVtdID0gW107XG4gIHB1YmxpYyBtaW5DaGFyc0VudGVyZWQgPSBmYWxzZTtcbiAgcHVibGljIGl0ZW1JbmRleDogbnVtYmVyID0gbnVsbDtcbiAgcHVibGljIGtleXdvcmQ6IHN0cmluZztcblxuICBwcml2YXRlIGVsOiBIVE1MRWxlbWVudDsgICAgICAgICAgIC8vIHRoaXMgY29tcG9uZW50ICBlbGVtZW50IGA8bmd1aS1hdXRvLWNvbXBsZXRlPmBcbiAgcHJpdmF0ZSB0aW1lciA9IDA7XG5cbiAgcHJpdmF0ZSBkZWxheSA9ICgoKSA9PiB7XG4gICAgbGV0IHRpbWVyID0gbnVsbDtcbiAgICByZXR1cm4gKGNhbGxiYWNrOiBhbnksIG1zOiBudW1iZXIpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIG1zKTtcbiAgICB9O1xuICB9KSgpO1xuICBwcml2YXRlIHNlbGVjdE9uRW50ZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHB1YmxpYyBhdXRvQ29tcGxldGU6IE5ndWlBdXRvQ29tcGxldGUpIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIHVzZXIgZW50ZXJzIGludG8gaW5wdXQgZWwsIHNob3dzIGxpc3QgdG8gc2VsZWN0LCB0aGVuIHNlbGVjdCBvbmVcbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYXV0b0NvbXBsZXRlLnNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgIHRoaXMuYXV0b0NvbXBsZXRlLnBhdGhUb0RhdGEgPSB0aGlzLnBhdGhUb0RhdGE7XG4gICAgdGhpcy5hdXRvQ29tcGxldGUubGlzdEZvcm1hdHRlciA9IHRoaXMubGlzdEZvcm1hdHRlcjtcbiAgICBpZiAodGhpcy5hdXRvU2VsZWN0Rmlyc3RJdGVtKSB7XG4gICAgICB0aGlzLml0ZW1JbmRleCA9IDA7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYXV0b0NvbXBsZXRlSW5wdXQgJiYgdGhpcy5yZUZvY3VzQWZ0ZXJTZWxlY3QpIHtcbiAgICAgICAgdGhpcy5hdXRvQ29tcGxldGVJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zaG93RHJvcGRvd25PbkluaXQpIHtcbiAgICAgICAgdGhpcy5zaG93RHJvcGRvd25MaXN0KHt0YXJnZXQ6IHt2YWx1ZTogJyd9fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaXNTcmNBcnIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGhpcy5zb3VyY2UpO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZExpc3RJbkRlbGF5ID0gKGV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgY29uc3QgZGVsYXlNcyA9IHRoaXMuaXNTcmNBcnIoKSA/IDEwIDogNTAwO1xuICAgIGNvbnN0IGtleXdvcmQgPSBldnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gZXhlY3V0aW5nIGFmdGVyIHVzZXIgc3RvcHBlZCB0eXBpbmdcbiAgICB0aGlzLmRlbGF5KCgpID0+IHRoaXMucmVsb2FkTGlzdChrZXl3b3JkKSwgZGVsYXlNcyk7XG4gIH1cblxuICBwdWJsaWMgc2hvd0Ryb3Bkb3duTGlzdChldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5kcm9wZG93blZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMucmVsb2FkTGlzdChldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGhpZGVEcm9wZG93bkxpc3QoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RPbkVudGVyID0gZmFsc2U7XG4gICAgdGhpcy5kcm9wZG93blZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kSXRlbUZyb21TZWxlY3RWYWx1ZShzZWxlY3RUZXh0OiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSB0aGlzLmZpbHRlcmVkTGlzdC5maWx0ZXIoKGl0ZW0pID0+ICgnJyArIGl0ZW0pID09PSBzZWxlY3RUZXh0KTtcbiAgICByZXR1cm4gbWF0Y2hpbmdJdGVtcy5sZW5ndGggPyBtYXRjaGluZ0l0ZW1zWzBdIDogbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWRMaXN0KGtleXdvcmQ6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdGhpcy5maWx0ZXJlZExpc3QgPSBbXTtcbiAgICBpZiAoa2V5d29yZC5sZW5ndGggPCAodGhpcy5taW5DaGFycyB8fCAwKSkge1xuICAgICAgdGhpcy5taW5DaGFyc0VudGVyZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW5DaGFyc0VudGVyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzU3JjQXJyKCkpIHsgICAgLy8gbG9jYWwgc291cmNlXG4gICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5maWx0ZXJlZExpc3QgPSB0aGlzLmF1dG9Db21wbGV0ZS5maWx0ZXIodGhpcy5zb3VyY2UsIGtleXdvcmQsIHRoaXMubWF0Y2hGb3JtYXR0ZWQsIHRoaXMuaWdub3JlQWNjZW50cywgdGhpcy5ub0ZpbHRlcmluZyk7XG4gICAgICBpZiAodGhpcy5tYXhOdW1MaXN0KSB7XG4gICAgICAgIHRoaXMuZmlsdGVyZWRMaXN0ID0gdGhpcy5maWx0ZXJlZExpc3Quc2xpY2UoMCwgdGhpcy5tYXhOdW1MaXN0KTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAvLyByZW1vdGUgc291cmNlXG4gICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gY3VzdG9tIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvYnNlcnZhYmxlXG4gICAgICAgIHRoaXMuc291cmNlKGtleXdvcmQpLnN1YnNjcmliZShcbiAgICAgICAgICAocmVzcCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5wYXRoVG9EYXRhKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGhzID0gdGhpcy5wYXRoVG9EYXRhLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgIHBhdGhzLmZvckVhY2goKHByb3ApID0+IHJlc3AgPSByZXNwW3Byb3BdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZExpc3QgPSByZXNwO1xuICAgICAgICAgICAgaWYgKHRoaXMubWF4TnVtTGlzdCkge1xuICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHRoaXMuZmlsdGVyZWRMaXN0LnNsaWNlKDAsIHRoaXMubWF4TnVtTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IG51bGwsXG4gICAgICAgICAgKCkgPT4gdGhpcy5pc0xvYWRpbmcgPSBmYWxzZSAvLyBjb21wbGV0ZVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVtb3RlIHNvdXJjZVxuXG4gICAgICAgIHRoaXMuYXV0b0NvbXBsZXRlLmdldFJlbW90ZURhdGEoa2V5d29yZCkuc3Vic2NyaWJlKChyZXNwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHJlc3AgPyByZXNwIDogW107XG4gICAgICAgICAgICBpZiAodGhpcy5tYXhOdW1MaXN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWRMaXN0ID0gdGhpcy5maWx0ZXJlZExpc3Quc2xpY2UoMCwgdGhpcy5tYXhOdW1MaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4gbnVsbCxcbiAgICAgICAgICAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlIC8vIGNvbXBsZXRlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNlbGVjdE9uZShkYXRhOiBhbnkpIHtcbiAgICBpZiAoISFkYXRhIHx8IGRhdGEgPT09ICcnKSB7XG4gICAgICB0aGlzLnZhbHVlU2VsZWN0ZWQuZW1pdChkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXN0b21TZWxlY3RlZC5lbWl0KHRoaXMua2V5d29yZCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGVudGVyVGV4dChkYXRhOiBhbnkpIHtcbiAgICB0aGlzLnRleHRFbnRlcmVkLmVtaXQoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYmx1ckhhbmRsZXIoZXZ0OiBhbnkpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RPbkJsdXIpIHtcbiAgICAgIHRoaXMuc2VsZWN0T25lKHRoaXMuZmlsdGVyZWRMaXN0W3RoaXMuaXRlbUluZGV4XSk7XG4gICAgfVxuXG4gICAgdGhpcy5oaWRlRHJvcGRvd25MaXN0KCk7XG4gIH1cblxuICBwdWJsaWMgaW5wdXRFbEtleUhhbmRsZXIgPSAoZXZ0OiBhbnkpID0+IHtcbiAgICBjb25zdCB0b3RhbE51bUl0ZW0gPSB0aGlzLmZpbHRlcmVkTGlzdC5sZW5ndGg7XG5cbiAgICBpZiAoIXRoaXMuc2VsZWN0T25FbnRlciAmJiB0aGlzLmF1dG9TZWxlY3RGaXJzdEl0ZW0gJiYgKDAgIT09IHRvdGFsTnVtSXRlbSkpIHtcbiAgICAgIHRoaXMuc2VsZWN0T25FbnRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgc3dpdGNoIChldnQua2V5Q29kZSkge1xuICAgICAgY2FzZSAyNzogLy8gRVNDLCBoaWRlIGF1dG8gY29tcGxldGVcbiAgICAgICAgdGhpcy5zZWxlY3RPbkVudGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2VsZWN0T25lKHVuZGVmaW5lZCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM4OiAvLyBVUCwgc2VsZWN0IHRoZSBwcmV2aW91cyBsaSBlbFxuICAgICAgICBpZiAoMCA9PT0gdG90YWxOdW1JdGVtKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0T25FbnRlciA9IHRydWU7XG4gICAgICAgIHRoaXMuaXRlbUluZGV4ID0gKHRvdGFsTnVtSXRlbSArIHRoaXMuaXRlbUluZGV4IC0gMSkgJSB0b3RhbE51bUl0ZW07XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9WaWV3KHRoaXMuaXRlbUluZGV4KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDA6IC8vIERPV04sIHNlbGVjdCB0aGUgbmV4dCBsaSBlbCBvciB0aGUgZmlyc3Qgb25lXG4gICAgICAgIGlmICgwID09PSB0b3RhbE51bUl0ZW0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RPbkVudGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kcm9wZG93blZpc2libGUgPSB0cnVlO1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5pdGVtSW5kZXg7XG4gICAgICAgIHN1bSA9ICh0aGlzLml0ZW1JbmRleCA9PT0gbnVsbCkgPyAwIDogc3VtICsgMTtcbiAgICAgICAgdGhpcy5pdGVtSW5kZXggPSAodG90YWxOdW1JdGVtICsgc3VtKSAlIHRvdGFsTnVtSXRlbTtcbiAgICAgICAgdGhpcy5zY3JvbGxUb1ZpZXcodGhpcy5pdGVtSW5kZXgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAxMzogLy8gRU5URVIsIGNob29zZSBpdCEhXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE9uRW50ZXIpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdE9uZSh0aGlzLmZpbHRlcmVkTGlzdFt0aGlzLml0ZW1JbmRleF0pO1xuICAgICAgICB9XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA5OiAvLyBUQUIsIGNob29zZSBpZiB0YWItdG8tc2VsZWN0IGlzIGVuYWJsZWRcbiAgICAgICAgaWYgKHRoaXMudGFiVG9TZWxlY3QpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdE9uZSh0aGlzLmZpbHRlcmVkTGlzdFt0aGlzLml0ZW1JbmRleF0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb1ZpZXcoaW5kZXgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmF1dG9Db21wbGV0ZUNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHVsID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgY29uc3QgbGkgPSB1bC5xdWVyeVNlbGVjdG9yKCdsaScpOyAgLy8ganVzdCBzYW1wbGUgdGhlIGZpcnN0IGxpIHRvIGdldCBoZWlnaHRcbiAgICBjb25zdCBsaUhlaWdodCA9IGxpLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB1bC5zY3JvbGxUb3A7XG4gICAgY29uc3Qgdmlld3BvcnQgPSBzY3JvbGxUb3AgKyB1bC5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3Qgc2Nyb2xsT2Zmc2V0ID0gbGlIZWlnaHQgKiBpbmRleDtcbiAgICBpZiAoc2Nyb2xsT2Zmc2V0IDwgc2Nyb2xsVG9wIHx8IChzY3JvbGxPZmZzZXQgKyBsaUhlaWdodCkgPiB2aWV3cG9ydCkge1xuICAgICAgdWwuc2Nyb2xsVG9wID0gc2Nyb2xsT2Zmc2V0O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0cmFja0J5SW5kZXgoaW5kZXgsIGl0ZW0pIHtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBnZXQgZW1wdHlMaXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKFxuICAgICAgdGhpcy5pc0xvYWRpbmcgfHxcbiAgICAgICh0aGlzLm1pbkNoYXJzRW50ZXJlZCAmJiAhdGhpcy5pc0xvYWRpbmcgJiYgIXRoaXMuZmlsdGVyZWRMaXN0Lmxlbmd0aCkgfHxcbiAgICAgICh0aGlzLmZpbHRlcmVkTGlzdC5sZW5ndGgpXG4gICAgKTtcbiAgfVxuXG59XG4iXX0=