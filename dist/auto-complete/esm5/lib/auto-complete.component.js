import { __decorate } from "tslib";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NguiAutoComplete } from './auto-complete.service';
var NguiAutoCompleteComponent = /** @class */ (function () {
    /**
     * constructor
     */
    function NguiAutoCompleteComponent(elementRef, autoComplete) {
        var _this = this;
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
        this.delay = (function () {
            var timer = null;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        this.selectOnEnter = false;
        this.reloadListInDelay = function (evt) {
            var delayMs = _this.isSrcArr() ? 10 : 500;
            var keyword = evt.target.value;
            // executing after user stopped typing
            _this.delay(function () { return _this.reloadList(keyword); }, delayMs);
        };
        this.inputElKeyHandler = function (evt) {
            var totalNumItem = _this.filteredList.length;
            if (!_this.selectOnEnter && _this.autoSelectFirstItem && (0 !== totalNumItem)) {
                _this.selectOnEnter = true;
            }
            switch (evt.keyCode) {
                case 27: // ESC, hide auto complete
                    _this.selectOnEnter = false;
                    _this.selectOne(undefined);
                    break;
                case 38: // UP, select the previous li el
                    if (0 === totalNumItem) {
                        return;
                    }
                    _this.selectOnEnter = true;
                    _this.itemIndex = (totalNumItem + _this.itemIndex - 1) % totalNumItem;
                    _this.scrollToView(_this.itemIndex);
                    break;
                case 40: // DOWN, select the next li el or the first one
                    if (0 === totalNumItem) {
                        return;
                    }
                    _this.selectOnEnter = true;
                    _this.dropdownVisible = true;
                    var sum = _this.itemIndex;
                    sum = (_this.itemIndex === null) ? 0 : sum + 1;
                    _this.itemIndex = (totalNumItem + sum) % totalNumItem;
                    _this.scrollToView(_this.itemIndex);
                    break;
                case 13: // ENTER, choose it!!
                    if (_this.selectOnEnter) {
                        _this.selectOne(_this.filteredList[_this.itemIndex]);
                    }
                    evt.preventDefault();
                    break;
                case 9: // TAB, choose if tab-to-select is enabled
                    if (_this.tabToSelect) {
                        _this.selectOne(_this.filteredList[_this.itemIndex]);
                    }
                    break;
            }
        };
        this.el = elementRef.nativeElement;
    }
    /**
     * user enters into input el, shows list to select, then select one
     */
    NguiAutoCompleteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.autoComplete.source = this.source;
        this.autoComplete.pathToData = this.pathToData;
        this.autoComplete.listFormatter = this.listFormatter;
        if (this.autoSelectFirstItem) {
            this.itemIndex = 0;
        }
        setTimeout(function () {
            if (_this.autoCompleteInput && _this.reFocusAfterSelect) {
                _this.autoCompleteInput.nativeElement.focus();
            }
            if (_this.showDropdownOnInit) {
                _this.showDropdownList({ target: { value: '' } });
            }
        });
    };
    NguiAutoCompleteComponent.prototype.isSrcArr = function () {
        return Array.isArray(this.source);
    };
    NguiAutoCompleteComponent.prototype.showDropdownList = function (event) {
        this.dropdownVisible = true;
        this.reloadList(event.target.value);
    };
    NguiAutoCompleteComponent.prototype.hideDropdownList = function () {
        this.selectOnEnter = false;
        this.dropdownVisible = false;
    };
    NguiAutoCompleteComponent.prototype.findItemFromSelectValue = function (selectText) {
        var matchingItems = this.filteredList.filter(function (item) { return ('' + item) === selectText; });
        return matchingItems.length ? matchingItems[0] : null;
    };
    NguiAutoCompleteComponent.prototype.reloadList = function (keyword) {
        var _this = this;
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
                this.source(keyword).subscribe(function (resp) {
                    if (_this.pathToData) {
                        var paths = _this.pathToData.split('.');
                        paths.forEach(function (prop) { return resp = resp[prop]; });
                    }
                    _this.filteredList = resp;
                    if (_this.maxNumList) {
                        _this.filteredList = _this.filteredList.slice(0, _this.maxNumList);
                    }
                }, function (error) { return null; }, function () { return _this.isLoading = false; } // complete
                );
            }
            else {
                // remote source
                this.autoComplete.getRemoteData(keyword).subscribe(function (resp) {
                    _this.filteredList = resp ? resp : [];
                    if (_this.maxNumList) {
                        _this.filteredList = _this.filteredList.slice(0, _this.maxNumList);
                    }
                }, function (error) { return null; }, function () { return _this.isLoading = false; } // complete
                );
            }
        }
    };
    NguiAutoCompleteComponent.prototype.selectOne = function (data) {
        if (!!data || data === '') {
            this.valueSelected.emit(data);
        }
        else {
            this.customSelected.emit(this.keyword);
        }
    };
    NguiAutoCompleteComponent.prototype.enterText = function (data) {
        this.textEntered.emit(data);
    };
    NguiAutoCompleteComponent.prototype.blurHandler = function (evt) {
        if (this.selectOnBlur) {
            this.selectOne(this.filteredList[this.itemIndex]);
        }
        this.hideDropdownList();
    };
    NguiAutoCompleteComponent.prototype.scrollToView = function (index) {
        var container = this.autoCompleteContainer.nativeElement;
        var ul = container.querySelector('ul');
        var li = ul.querySelector('li'); // just sample the first li to get height
        var liHeight = li.offsetHeight;
        var scrollTop = ul.scrollTop;
        var viewport = scrollTop + ul.offsetHeight;
        var scrollOffset = liHeight * index;
        if (scrollOffset < scrollTop || (scrollOffset + liHeight) > viewport) {
            ul.scrollTop = scrollOffset;
        }
    };
    NguiAutoCompleteComponent.prototype.trackByIndex = function (index, item) {
        return index;
    };
    Object.defineProperty(NguiAutoCompleteComponent.prototype, "emptyList", {
        get: function () {
            return !(this.isLoading ||
                (this.minCharsEntered && !this.isLoading && !this.filteredList.length) ||
                (this.filteredList.length));
        },
        enumerable: true,
        configurable: true
    });
    NguiAutoCompleteComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NguiAutoComplete }
    ]; };
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
            template: "\n    <div #autoCompleteContainer class=\"ngui-auto-complete\">\n      <!-- keyword input -->\n      <input *ngIf=\"showInputTag\"\n             #autoCompleteInput class=\"keyword\"\n             [attr.autocomplete]=\"autocomplete ? 'null' : 'off'\"\n             placeholder=\"{{placeholder}}\"\n             (focus)=\"showDropdownList($event)\"\n             (blur)=\"blurHandler($event)\"\n             (keydown)=\"inputElKeyHandler($event)\"\n             (input)=\"reloadListInDelay($event)\"\n             [(ngModel)]=\"keyword\"/>\n\n      <!-- dropdown that user can select -->\n      <ul *ngIf=\"dropdownVisible\" [class.empty]=\"emptyList\">\n        <li *ngIf=\"isLoading && loadingTemplate\" class=\"loading\"\n            [innerHTML]=\"loadingTemplate\"></li>\n        <li *ngIf=\"isLoading && !loadingTemplate\" class=\"loading\">{{loadingText}}</li>\n        <li *ngIf=\"minCharsEntered && !isLoading && !filteredList.length\"\n            (mousedown)=\"selectOne('')\"\n            class=\"no-match-found\">{{noMatchFoundText || 'No Result Found'}}\n        </li>\n        <li *ngIf=\"headerItemTemplate && filteredList.length\" class=\"header-item\"\n            [innerHTML]=\"headerItemTemplate\"></li>\n        <li *ngIf=\"blankOptionText && filteredList.length\"\n            (mousedown)=\"selectOne('')\"\n            class=\"blank-item\">{{blankOptionText}}\n        </li>\n        <li class=\"item\"\n            *ngFor=\"let item of filteredList; let i=index; trackBy: trackByIndex\"\n            (mousedown)=\"selectOne(item)\"\n            [ngClass]=\"{selected: i === itemIndex}\"\n            [innerHtml]=\"autoComplete.getFormattedListItem(item)\">\n        </li>\n      </ul>\n\n    </div>\n  ",
            encapsulation: ViewEncapsulation.None,
            styles: ["\n    @keyframes slideDown {\n      0% {\n        transform: translateY(-10px);\n      }\n      100% {\n        transform: translateY(0px);\n      }\n    }\n\n    .ngui-auto-complete {\n      background-color: transparent;\n    }\n\n    .ngui-auto-complete > input {\n      outline: none;\n      border: 0;\n      padding: 2px;\n      box-sizing: border-box;\n      background-clip: content-box;\n    }\n\n    .ngui-auto-complete > ul {\n      background-color: #fff;\n      margin: 0;\n      width: 100%;\n      overflow-y: auto;\n      list-style-type: none;\n      padding: 0;\n      border: 1px solid #ccc;\n      box-sizing: border-box;\n      animation: slideDown 0.1s;\n    }\n\n    .ngui-auto-complete > ul.empty {\n      display: none;\n    }\n\n    .ngui-auto-complete > ul li {\n      padding: 2px 5px;\n      border-bottom: 1px solid #eee;\n    }\n\n    .ngui-auto-complete > ul li.selected {\n      background-color: #ccc;\n    }\n\n    .ngui-auto-complete > ul li:last-child {\n      border-bottom: none;\n    }\n\n    .ngui-auto-complete > ul li:not(.header-item):hover {\n      background-color: #ccc;\n    }"]
        })
    ], NguiAutoCompleteComponent);
    return NguiAutoCompleteComponent;
}());
export { NguiAutoCompleteComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd1aS9hdXRvLWNvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG8tY29tcGxldGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pILE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBbUczRDtJQXVERTs7T0FFRztJQUNILG1DQUFZLFVBQXNCLEVBQVMsWUFBOEI7UUFBekUsaUJBRUM7UUFGMEMsaUJBQVksR0FBWixZQUFZLENBQWtCO1FBeER6RTs7V0FFRztRQUMyQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUl4QixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBSUwsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFDcEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFekIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDYix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDbkMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDakIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDaEIsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ2QsdUJBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQzNCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUNoQyxrQkFBYSxHQUFHLElBQUksQ0FBQztRQUM5QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUVuQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3BD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Z0IsQ0FBQztvRUFBNkI7SUFDOUI7UUFBdEIsS0FBSyxDQUFDLGNBQWMsQ0FBQztrRUFBOEI7SUFFMUM7UUFBVCxNQUFNLEVBQUU7b0VBQTJDO0lBQzFDO1FBQVQsTUFBTSxFQUFFO3FFQUE0QztJQUMzQztRQUFULE1BQU0sRUFBRTtrRUFBeUM7SUFFbEI7UUFBL0IsU0FBUyxDQUFDLG1CQUFtQixDQUFDO3dFQUFzQztJQUNqQztRQUFuQyxTQUFTLENBQUMsdUJBQXVCLENBQUM7NEVBQTBDO0lBakNsRSx5QkFBeUI7UUFqR3JDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsUUFBUSxFQUFFLDZyREFxQ1Q7WUF3REQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7cUJBdkQ1QixzbUNBcURMO1NBR0wsQ0FBQztPQUNXLHlCQUF5QixDQWlRckM7SUFBRCxnQ0FBQztDQUFBLEFBalFELElBaVFDO1NBalFZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5ndWlBdXRvQ29tcGxldGUgfSBmcm9tICcuL2F1dG8tY29tcGxldGUuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25ndWktYXV0by1jb21wbGV0ZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiAjYXV0b0NvbXBsZXRlQ29udGFpbmVyIGNsYXNzPVwibmd1aS1hdXRvLWNvbXBsZXRlXCI+XG4gICAgICA8IS0tIGtleXdvcmQgaW5wdXQgLS0+XG4gICAgICA8aW5wdXQgKm5nSWY9XCJzaG93SW5wdXRUYWdcIlxuICAgICAgICAgICAgICNhdXRvQ29tcGxldGVJbnB1dCBjbGFzcz1cImtleXdvcmRcIlxuICAgICAgICAgICAgIFthdHRyLmF1dG9jb21wbGV0ZV09XCJhdXRvY29tcGxldGUgPyAnbnVsbCcgOiAnb2ZmJ1wiXG4gICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ7e3BsYWNlaG9sZGVyfX1cIlxuICAgICAgICAgICAgIChmb2N1cyk9XCJzaG93RHJvcGRvd25MaXN0KCRldmVudClcIlxuICAgICAgICAgICAgIChibHVyKT1cImJsdXJIYW5kbGVyKCRldmVudClcIlxuICAgICAgICAgICAgIChrZXlkb3duKT1cImlucHV0RWxLZXlIYW5kbGVyKCRldmVudClcIlxuICAgICAgICAgICAgIChpbnB1dCk9XCJyZWxvYWRMaXN0SW5EZWxheSgkZXZlbnQpXCJcbiAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cImtleXdvcmRcIi8+XG5cbiAgICAgIDwhLS0gZHJvcGRvd24gdGhhdCB1c2VyIGNhbiBzZWxlY3QgLS0+XG4gICAgICA8dWwgKm5nSWY9XCJkcm9wZG93blZpc2libGVcIiBbY2xhc3MuZW1wdHldPVwiZW1wdHlMaXN0XCI+XG4gICAgICAgIDxsaSAqbmdJZj1cImlzTG9hZGluZyAmJiBsb2FkaW5nVGVtcGxhdGVcIiBjbGFzcz1cImxvYWRpbmdcIlxuICAgICAgICAgICAgW2lubmVySFRNTF09XCJsb2FkaW5nVGVtcGxhdGVcIj48L2xpPlxuICAgICAgICA8bGkgKm5nSWY9XCJpc0xvYWRpbmcgJiYgIWxvYWRpbmdUZW1wbGF0ZVwiIGNsYXNzPVwibG9hZGluZ1wiPnt7bG9hZGluZ1RleHR9fTwvbGk+XG4gICAgICAgIDxsaSAqbmdJZj1cIm1pbkNoYXJzRW50ZXJlZCAmJiAhaXNMb2FkaW5nICYmICFmaWx0ZXJlZExpc3QubGVuZ3RoXCJcbiAgICAgICAgICAgIChtb3VzZWRvd24pPVwic2VsZWN0T25lKCcnKVwiXG4gICAgICAgICAgICBjbGFzcz1cIm5vLW1hdGNoLWZvdW5kXCI+e3tub01hdGNoRm91bmRUZXh0IHx8ICdObyBSZXN1bHQgRm91bmQnfX1cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpICpuZ0lmPVwiaGVhZGVySXRlbVRlbXBsYXRlICYmIGZpbHRlcmVkTGlzdC5sZW5ndGhcIiBjbGFzcz1cImhlYWRlci1pdGVtXCJcbiAgICAgICAgICAgIFtpbm5lckhUTUxdPVwiaGVhZGVySXRlbVRlbXBsYXRlXCI+PC9saT5cbiAgICAgICAgPGxpICpuZ0lmPVwiYmxhbmtPcHRpb25UZXh0ICYmIGZpbHRlcmVkTGlzdC5sZW5ndGhcIlxuICAgICAgICAgICAgKG1vdXNlZG93bik9XCJzZWxlY3RPbmUoJycpXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYmxhbmstaXRlbVwiPnt7YmxhbmtPcHRpb25UZXh0fX1cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiaXRlbVwiXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgaXRlbSBvZiBmaWx0ZXJlZExpc3Q7IGxldCBpPWluZGV4OyB0cmFja0J5OiB0cmFja0J5SW5kZXhcIlxuICAgICAgICAgICAgKG1vdXNlZG93bik9XCJzZWxlY3RPbmUoaXRlbSlcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwie3NlbGVjdGVkOiBpID09PSBpdGVtSW5kZXh9XCJcbiAgICAgICAgICAgIFtpbm5lckh0bWxdPVwiYXV0b0NvbXBsZXRlLmdldEZvcm1hdHRlZExpc3RJdGVtKGl0ZW0pXCI+XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICBAa2V5ZnJhbWVzIHNsaWRlRG93biB7XG4gICAgICAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTBweCk7XG4gICAgICB9XG4gICAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLm5ndWktYXV0by1jb21wbGV0ZSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICB9XG5cbiAgICAubmd1aS1hdXRvLWNvbXBsZXRlID4gaW5wdXQge1xuICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgIGJvcmRlcjogMDtcbiAgICAgIHBhZGRpbmc6IDJweDtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICBiYWNrZ3JvdW5kLWNsaXA6IGNvbnRlbnQtYm94O1xuICAgIH1cblxuICAgIC5uZ3VpLWF1dG8tY29tcGxldGUgPiB1bCB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICAgICAgcGFkZGluZzogMDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgYW5pbWF0aW9uOiBzbGlkZURvd24gMC4xcztcbiAgICB9XG5cbiAgICAubmd1aS1hdXRvLWNvbXBsZXRlID4gdWwuZW1wdHkge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG5cbiAgICAubmd1aS1hdXRvLWNvbXBsZXRlID4gdWwgbGkge1xuICAgICAgcGFkZGluZzogMnB4IDVweDtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZWVlO1xuICAgIH1cblxuICAgIC5uZ3VpLWF1dG8tY29tcGxldGUgPiB1bCBsaS5zZWxlY3RlZCB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICAgIH1cblxuICAgIC5uZ3VpLWF1dG8tY29tcGxldGUgPiB1bCBsaTpsYXN0LWNoaWxkIHtcbiAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgfVxuXG4gICAgLm5ndWktYXV0by1jb21wbGV0ZSA+IHVsIGxpOm5vdCguaGVhZGVyLWl0ZW0pOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG4gICAgfWBcbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBOZ3VpQXV0b0NvbXBsZXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAvKipcbiAgICogcHVibGljIGlucHV0IHByb3BlcnRpZXNcbiAgICovXG4gIEBJbnB1dCgnYXV0b2NvbXBsZXRlJykgcHVibGljIGF1dG9jb21wbGV0ZSA9IGZhbHNlO1xuICBASW5wdXQoJ2xpc3QtZm9ybWF0dGVyJykgcHVibGljIGxpc3RGb3JtYXR0ZXI6IChhcmc6IGFueSkgPT4gc3RyaW5nO1xuICBASW5wdXQoJ3NvdXJjZScpIHB1YmxpYyBzb3VyY2U6IGFueTtcbiAgQElucHV0KCdwYXRoLXRvLWRhdGEnKSBwdWJsaWMgcGF0aFRvRGF0YTogc3RyaW5nO1xuICBASW5wdXQoJ21pbi1jaGFycycpIHB1YmxpYyBtaW5DaGFycyA9IDA7XG4gIEBJbnB1dCgncGxhY2Vob2xkZXInKSBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCdibGFuay1vcHRpb24tdGV4dCcpIHB1YmxpYyBibGFua09wdGlvblRleHQ6IHN0cmluZztcbiAgQElucHV0KCduby1tYXRjaC1mb3VuZC10ZXh0JykgcHVibGljIG5vTWF0Y2hGb3VuZFRleHQ6IHN0cmluZztcbiAgQElucHV0KCdhY2NlcHQtdXNlci1pbnB1dCcpIHB1YmxpYyBhY2NlcHRVc2VySW5wdXQgPSB0cnVlO1xuICBASW5wdXQoJ2xvYWRpbmctdGV4dCcpIHB1YmxpYyBsb2FkaW5nVGV4dCA9ICdMb2FkaW5nJztcbiAgQElucHV0KCdsb2FkaW5nLXRlbXBsYXRlJykgcHVibGljIGxvYWRpbmdUZW1wbGF0ZSA9IG51bGw7XG4gIEBJbnB1dCgnbWF4LW51bS1saXN0JykgcHVibGljIG1heE51bUxpc3Q6IG51bWJlcjtcbiAgQElucHV0KCdzaG93LWlucHV0LXRhZycpIHB1YmxpYyBzaG93SW5wdXRUYWcgPSB0cnVlO1xuICBASW5wdXQoJ3Nob3ctZHJvcGRvd24tb24taW5pdCcpIHB1YmxpYyBzaG93RHJvcGRvd25PbkluaXQgPSBmYWxzZTtcbiAgQElucHV0KCd0YWItdG8tc2VsZWN0JykgcHVibGljIHRhYlRvU2VsZWN0ID0gdHJ1ZTtcbiAgQElucHV0KCdtYXRjaC1mb3JtYXR0ZWQnKSBwdWJsaWMgbWF0Y2hGb3JtYXR0ZWQgPSBmYWxzZTtcbiAgQElucHV0KCdhdXRvLXNlbGVjdC1maXJzdC1pdGVtJykgcHVibGljIGF1dG9TZWxlY3RGaXJzdEl0ZW0gPSBmYWxzZTtcbiAgQElucHV0KCdzZWxlY3Qtb24tYmx1cicpIHB1YmxpYyBzZWxlY3RPbkJsdXIgPSBmYWxzZTtcbiAgQElucHV0KCdyZS1mb2N1cy1hZnRlci1zZWxlY3QnKSBwdWJsaWMgcmVGb2N1c0FmdGVyU2VsZWN0ID0gdHJ1ZTtcbiAgQElucHV0KCdoZWFkZXItaXRlbS10ZW1wbGF0ZScpIHB1YmxpYyBoZWFkZXJJdGVtVGVtcGxhdGUgPSBudWxsO1xuICBASW5wdXQoJ2lnbm9yZS1hY2NlbnRzJykgcHVibGljIGlnbm9yZUFjY2VudHMgPSB0cnVlO1xuICBASW5wdXQoXCJuby1maWx0ZXJpbmdcIikgbm9GaWx0ZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgcHVibGljIHZhbHVlU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgY3VzdG9tU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgdGV4dEVudGVyZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQFZpZXdDaGlsZCgnYXV0b0NvbXBsZXRlSW5wdXQnKSBwdWJsaWMgYXV0b0NvbXBsZXRlSW5wdXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2F1dG9Db21wbGV0ZUNvbnRhaW5lcicpIHB1YmxpYyBhdXRvQ29tcGxldGVDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIGRyb3Bkb3duVmlzaWJsZSA9IGZhbHNlO1xuICBwdWJsaWMgaXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgcHVibGljIGZpbHRlcmVkTGlzdDogYW55W10gPSBbXTtcbiAgcHVibGljIG1pbkNoYXJzRW50ZXJlZCA9IGZhbHNlO1xuICBwdWJsaWMgaXRlbUluZGV4OiBudW1iZXIgPSBudWxsO1xuICBwdWJsaWMga2V5d29yZDogc3RyaW5nO1xuXG4gIHByaXZhdGUgZWw6IEhUTUxFbGVtZW50OyAgICAgICAgICAgLy8gdGhpcyBjb21wb25lbnQgIGVsZW1lbnQgYDxuZ3VpLWF1dG8tY29tcGxldGU+YFxuICBwcml2YXRlIHRpbWVyID0gMDtcblxuICBwcml2YXRlIGRlbGF5ID0gKCgpID0+IHtcbiAgICBsZXQgdGltZXIgPSBudWxsO1xuICAgIHJldHVybiAoY2FsbGJhY2s6IGFueSwgbXM6IG51bWJlcikgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dChjYWxsYmFjaywgbXMpO1xuICAgIH07XG4gIH0pKCk7XG4gIHByaXZhdGUgc2VsZWN0T25FbnRlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGF1dG9Db21wbGV0ZTogTmd1aUF1dG9Db21wbGV0ZSkge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogdXNlciBlbnRlcnMgaW50byBpbnB1dCBlbCwgc2hvd3MgbGlzdCB0byBzZWxlY3QsIHRoZW4gc2VsZWN0IG9uZVxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5hdXRvQ29tcGxldGUuc291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgdGhpcy5hdXRvQ29tcGxldGUucGF0aFRvRGF0YSA9IHRoaXMucGF0aFRvRGF0YTtcbiAgICB0aGlzLmF1dG9Db21wbGV0ZS5saXN0Rm9ybWF0dGVyID0gdGhpcy5saXN0Rm9ybWF0dGVyO1xuICAgIGlmICh0aGlzLmF1dG9TZWxlY3RGaXJzdEl0ZW0pIHtcbiAgICAgIHRoaXMuaXRlbUluZGV4ID0gMDtcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hdXRvQ29tcGxldGVJbnB1dCAmJiB0aGlzLnJlRm9jdXNBZnRlclNlbGVjdCkge1xuICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZUlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNob3dEcm9wZG93bk9uSW5pdCkge1xuICAgICAgICB0aGlzLnNob3dEcm9wZG93bkxpc3Qoe3RhcmdldDoge3ZhbHVlOiAnJ319KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc1NyY0FycigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGlzLnNvdXJjZSk7XG4gIH1cblxuICBwdWJsaWMgcmVsb2FkTGlzdEluRGVsYXkgPSAoZXZ0OiBhbnkpOiB2b2lkID0+IHtcbiAgICBjb25zdCBkZWxheU1zID0gdGhpcy5pc1NyY0FycigpID8gMTAgOiA1MDA7XG4gICAgY29uc3Qga2V5d29yZCA9IGV2dC50YXJnZXQudmFsdWU7XG5cbiAgICAvLyBleGVjdXRpbmcgYWZ0ZXIgdXNlciBzdG9wcGVkIHR5cGluZ1xuICAgIHRoaXMuZGVsYXkoKCkgPT4gdGhpcy5yZWxvYWRMaXN0KGtleXdvcmQpLCBkZWxheU1zKTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93RHJvcGRvd25MaXN0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRyb3Bkb3duVmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5yZWxvYWRMaXN0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgaGlkZURyb3Bkb3duTGlzdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdE9uRW50ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmRyb3Bkb3duVmlzaWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGZpbmRJdGVtRnJvbVNlbGVjdFZhbHVlKHNlbGVjdFRleHQ6IHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IHRoaXMuZmlsdGVyZWRMaXN0LmZpbHRlcigoaXRlbSkgPT4gKCcnICsgaXRlbSkgPT09IHNlbGVjdFRleHQpO1xuICAgIHJldHVybiBtYXRjaGluZ0l0ZW1zLmxlbmd0aCA/IG1hdGNoaW5nSXRlbXNbMF0gOiBudWxsO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZExpc3Qoa2V5d29yZDogc3RyaW5nKTogdm9pZCB7XG5cbiAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IFtdO1xuICAgIGlmIChrZXl3b3JkLmxlbmd0aCA8ICh0aGlzLm1pbkNoYXJzIHx8IDApKSB7XG4gICAgICB0aGlzLm1pbkNoYXJzRW50ZXJlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pbkNoYXJzRW50ZXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTcmNBcnIoKSkgeyAgICAvLyBsb2NhbCBzb3VyY2VcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHRoaXMuYXV0b0NvbXBsZXRlLmZpbHRlcih0aGlzLnNvdXJjZSwga2V5d29yZCwgdGhpcy5tYXRjaEZvcm1hdHRlZCwgdGhpcy5pZ25vcmVBY2NlbnRzLCB0aGlzLm5vRmlsdGVyaW5nKTtcbiAgICAgIGlmICh0aGlzLm1heE51bUxpc3QpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJlZExpc3QgPSB0aGlzLmZpbHRlcmVkTGlzdC5zbGljZSgwLCB0aGlzLm1heE51bUxpc3QpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgIC8vIHJlbW90ZSBzb3VyY2VcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBjdXN0b20gZnVuY3Rpb24gdGhhdCByZXR1cm5zIG9ic2VydmFibGVcbiAgICAgICAgdGhpcy5zb3VyY2Uoa2V5d29yZCkuc3Vic2NyaWJlKFxuICAgICAgICAgIChyZXNwKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnBhdGhUb0RhdGEpIHtcbiAgICAgICAgICAgICAgY29uc3QgcGF0aHMgPSB0aGlzLnBhdGhUb0RhdGEuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgcGF0aHMuZm9yRWFjaCgocHJvcCkgPT4gcmVzcCA9IHJlc3BbcHJvcF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHJlc3A7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXhOdW1MaXN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWRMaXN0ID0gdGhpcy5maWx0ZXJlZExpc3Quc2xpY2UoMCwgdGhpcy5tYXhOdW1MaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4gbnVsbCxcbiAgICAgICAgICAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlIC8vIGNvbXBsZXRlXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZW1vdGUgc291cmNlXG5cbiAgICAgICAgdGhpcy5hdXRvQ29tcGxldGUuZ2V0UmVtb3RlRGF0YShrZXl3b3JkKS5zdWJzY3JpYmUoKHJlc3ApID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyZWRMaXN0ID0gcmVzcCA/IHJlc3AgOiBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLm1heE51bUxpc3QpIHtcbiAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZExpc3QgPSB0aGlzLmZpbHRlcmVkTGlzdC5zbGljZSgwLCB0aGlzLm1heE51bUxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiBudWxsLFxuICAgICAgICAgICgpID0+IHRoaXMuaXNMb2FkaW5nID0gZmFsc2UgLy8gY29tcGxldGVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0T25lKGRhdGE6IGFueSkge1xuICAgIGlmICghIWRhdGEgfHwgZGF0YSA9PT0gJycpIHtcbiAgICAgIHRoaXMudmFsdWVTZWxlY3RlZC5lbWl0KGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1c3RvbVNlbGVjdGVkLmVtaXQodGhpcy5rZXl3b3JkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZW50ZXJUZXh0KGRhdGE6IGFueSkge1xuICAgIHRoaXMudGV4dEVudGVyZWQuZW1pdChkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBibHVySGFuZGxlcihldnQ6IGFueSkge1xuICAgIGlmICh0aGlzLnNlbGVjdE9uQmx1cikge1xuICAgICAgdGhpcy5zZWxlY3RPbmUodGhpcy5maWx0ZXJlZExpc3RbdGhpcy5pdGVtSW5kZXhdKTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZGVEcm9wZG93bkxpc3QoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbnB1dEVsS2V5SGFuZGxlciA9IChldnQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IHRvdGFsTnVtSXRlbSA9IHRoaXMuZmlsdGVyZWRMaXN0Lmxlbmd0aDtcblxuICAgIGlmICghdGhpcy5zZWxlY3RPbkVudGVyICYmIHRoaXMuYXV0b1NlbGVjdEZpcnN0SXRlbSAmJiAoMCAhPT0gdG90YWxOdW1JdGVtKSkge1xuICAgICAgdGhpcy5zZWxlY3RPbkVudGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2dC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIDI3OiAvLyBFU0MsIGhpZGUgYXV0byBjb21wbGV0ZVxuICAgICAgICB0aGlzLnNlbGVjdE9uRW50ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zZWxlY3RPbmUodW5kZWZpbmVkKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6IC8vIFVQLCBzZWxlY3QgdGhlIHByZXZpb3VzIGxpIGVsXG4gICAgICAgIGlmICgwID09PSB0b3RhbE51bUl0ZW0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RPbkVudGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pdGVtSW5kZXggPSAodG90YWxOdW1JdGVtICsgdGhpcy5pdGVtSW5kZXggLSAxKSAlIHRvdGFsTnVtSXRlbTtcbiAgICAgICAgdGhpcy5zY3JvbGxUb1ZpZXcodGhpcy5pdGVtSW5kZXgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA0MDogLy8gRE9XTiwgc2VsZWN0IHRoZSBuZXh0IGxpIGVsIG9yIHRoZSBmaXJzdCBvbmVcbiAgICAgICAgaWYgKDAgPT09IHRvdGFsTnVtSXRlbSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdE9uRW50ZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLmRyb3Bkb3duVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLml0ZW1JbmRleDtcbiAgICAgICAgc3VtID0gKHRoaXMuaXRlbUluZGV4ID09PSBudWxsKSA/IDAgOiBzdW0gKyAxO1xuICAgICAgICB0aGlzLml0ZW1JbmRleCA9ICh0b3RhbE51bUl0ZW0gKyBzdW0pICUgdG90YWxOdW1JdGVtO1xuICAgICAgICB0aGlzLnNjcm9sbFRvVmlldyh0aGlzLml0ZW1JbmRleCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDEzOiAvLyBFTlRFUiwgY2hvb3NlIGl0ISFcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0T25FbnRlcikge1xuICAgICAgICAgIHRoaXMuc2VsZWN0T25lKHRoaXMuZmlsdGVyZWRMaXN0W3RoaXMuaXRlbUluZGV4XSk7XG4gICAgICAgIH1cbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDk6IC8vIFRBQiwgY2hvb3NlIGlmIHRhYi10by1zZWxlY3QgaXMgZW5hYmxlZFxuICAgICAgICBpZiAodGhpcy50YWJUb1NlbGVjdCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0T25lKHRoaXMuZmlsdGVyZWRMaXN0W3RoaXMuaXRlbUluZGV4XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNjcm9sbFRvVmlldyhpbmRleCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuYXV0b0NvbXBsZXRlQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigndWwnKTtcbiAgICBjb25zdCBsaSA9IHVsLnF1ZXJ5U2VsZWN0b3IoJ2xpJyk7ICAvLyBqdXN0IHNhbXBsZSB0aGUgZmlyc3QgbGkgdG8gZ2V0IGhlaWdodFxuICAgIGNvbnN0IGxpSGVpZ2h0ID0gbGkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHVsLnNjcm9sbFRvcDtcbiAgICBjb25zdCB2aWV3cG9ydCA9IHNjcm9sbFRvcCArIHVsLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBzY3JvbGxPZmZzZXQgPSBsaUhlaWdodCAqIGluZGV4O1xuICAgIGlmIChzY3JvbGxPZmZzZXQgPCBzY3JvbGxUb3AgfHwgKHNjcm9sbE9mZnNldCArIGxpSGVpZ2h0KSA+IHZpZXdwb3J0KSB7XG4gICAgICB1bC5zY3JvbGxUb3AgPSBzY3JvbGxPZmZzZXQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRyYWNrQnlJbmRleChpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIGdldCBlbXB0eUxpc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEoXG4gICAgICB0aGlzLmlzTG9hZGluZyB8fFxuICAgICAgKHRoaXMubWluQ2hhcnNFbnRlcmVkICYmICF0aGlzLmlzTG9hZGluZyAmJiAhdGhpcy5maWx0ZXJlZExpc3QubGVuZ3RoKSB8fFxuICAgICAgKHRoaXMuZmlsdGVyZWRMaXN0Lmxlbmd0aClcbiAgICApO1xuICB9XG5cbn1cbiJdfQ==