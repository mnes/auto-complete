import { __decorate, __param } from "tslib";
import { AfterViewInit, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Host, Input, OnChanges, OnDestroy, OnInit, Optional, Output, SimpleChanges, SkipSelf, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, FormGroupName } from '@angular/forms';
import { NguiAutoCompleteComponent } from './auto-complete.component';
var NguiAutoCompleteDirective = /** @class */ (function () {
    function NguiAutoCompleteDirective(resolver, viewContainerRef, parentForm) {
        var _this = this;
        this.resolver = resolver;
        this.viewContainerRef = viewContainerRef;
        this.parentForm = parentForm;
        this.autocomplete = false;
        this.acceptUserInput = true;
        this.loadingTemplate = null;
        this.loadingText = 'Loading';
        this.tabToSelect = true;
        this.selectOnBlur = false;
        this.matchFormatted = false;
        this.autoSelectFirstItem = false;
        this.openOnFocus = true;
        this.closeOnFocusOut = true;
        this.reFocusAfterSelect = true;
        this.headerItemTemplate = null;
        this.ignoreAccents = true;
        this.noFiltering = false;
        this.zIndex = '1';
        this.isRtl = false;
        this.ngModelChange = new EventEmitter();
        this.valueChanged = new EventEmitter();
        this.customSelected = new EventEmitter();
        // show auto-complete list below the current element
        this.showAutoCompleteDropdown = function (event) {
            if (_this.dropdownJustHidden) {
                return;
            }
            _this.hideAutoCompleteDropdown();
            _this.scheduledBlurHandler = null;
            var factory = _this.resolver.resolveComponentFactory(NguiAutoCompleteComponent);
            _this.componentRef = _this.viewContainerRef.createComponent(factory);
            var component = _this.componentRef.instance;
            component.keyword = _this.inputEl.value;
            component.showInputTag = false; // Do NOT display autocomplete input tag separately
            component.pathToData = _this.pathToData;
            component.minChars = _this.minChars;
            component.source = _this.source;
            component.placeholder = _this.autoCompletePlaceholder;
            component.acceptUserInput = _this.acceptUserInput;
            component.maxNumList = parseInt(_this.maxNumList, 10);
            component.loadingText = _this.loadingText;
            component.loadingTemplate = _this.loadingTemplate;
            component.listFormatter = _this.listFormatter;
            component.blankOptionText = _this.blankOptionText;
            component.noMatchFoundText = _this.noMatchFoundText;
            component.tabToSelect = _this.tabToSelect;
            component.selectOnBlur = _this.selectOnBlur;
            component.matchFormatted = _this.matchFormatted;
            component.autoSelectFirstItem = _this.autoSelectFirstItem;
            component.headerItemTemplate = _this.headerItemTemplate;
            component.ignoreAccents = _this.ignoreAccents;
            component.noFiltering = _this.noFiltering;
            component.valueSelected.subscribe(_this.selectNewValue);
            component.textEntered.subscribe(_this.enterNewText);
            component.customSelected.subscribe(_this.selectCustomValue);
            _this.acDropdownEl = _this.componentRef.location.nativeElement;
            _this.acDropdownEl.style.display = 'none';
            // if this element is not an input tag, move dropdown after input tag
            // so that it displays correctly
            // TODO: confirm with owners
            // with some reason, viewContainerRef.createComponent is creating element
            // to parent div which is created by us on ngOnInit, please try this with demo
            // if (this.el.tagName !== 'INPUT' && this.acDropdownEl) {
            _this.inputEl.parentElement.insertBefore(_this.acDropdownEl, _this.inputEl.nextSibling);
            // }
            _this.revertValue = typeof _this.ngModel !== 'undefined' ? _this.ngModel : _this.inputEl.value;
            setTimeout(function () {
                component.reloadList(_this.inputEl.value);
                _this.styleAutoCompleteDropdown();
                component.dropdownVisible = true;
            });
        };
        this.hideAutoCompleteDropdown = function (event) {
            if (_this.componentRef) {
                var currentItem = void 0;
                var hasRevertValue = (typeof _this.revertValue !== 'undefined');
                if (_this.inputEl && hasRevertValue && _this.acceptUserInput === false) {
                    currentItem = _this.componentRef.instance.findItemFromSelectValue(_this.inputEl.value);
                }
                _this.componentRef.destroy();
                _this.componentRef = undefined;
                if (_this.inputEl && hasRevertValue && _this.acceptUserInput === false && currentItem === null) {
                    _this.selectNewValue(_this.revertValue);
                }
                else if (_this.inputEl && _this.acceptUserInput === true && typeof currentItem === 'undefined' && event && event.target.value) {
                    _this.enterNewText(event.target.value);
                }
            }
            _this.dropdownJustHidden = true;
            setTimeout(function () { return _this.dropdownJustHidden = false; }, 100);
        };
        this.styleAutoCompleteDropdown = function () {
            if (_this.componentRef) {
                var component = _this.componentRef.instance;
                var scrollheight = 0;
                if (_this.source && _this.source.length > 0) {
                    scrollheight = _this.source.length * 24; // プルダウンのoption1つのheightが24px
                    scrollheight = scrollheight > 300 ? 300 : scrollheight; // 300以上は300にする
                }
                scrollheight += 50; // フッターがあるかもしれないので、フッター分のオフセットを加味する
                /* setting width/height auto complete */
                var thisElBCR = _this.el.getBoundingClientRect();
                var thisInputElBCR = _this.inputEl.getBoundingClientRect();
                var closeToBottom = thisInputElBCR.bottom + scrollheight > window.innerHeight;
                var directionOfStyle = _this.isRtl ? 'right' : 'left';
                _this.acDropdownEl.style.width = thisInputElBCR.width + 'px';
                _this.acDropdownEl.style.position = 'absolute';
                _this.acDropdownEl.style.zIndex = _this.zIndex;
                _this.acDropdownEl.style[directionOfStyle] = '0';
                _this.acDropdownEl.style.display = 'inline-block';
                if (closeToBottom) {
                    _this.acDropdownEl.style.bottom = thisInputElBCR.height + "px";
                }
                else {
                    _this.acDropdownEl.style.top = thisInputElBCR.height + "px";
                }
            }
        };
        this.selectNewValue = function (item) {
            // make displayable value
            if (item && typeof item === 'object') {
                item = _this.setToStringFunction(item);
            }
            _this.renderValue(item);
            // make return value
            var val = item;
            if (_this.selectValueOf && item[_this.selectValueOf]) {
                val = item[_this.selectValueOf];
            }
            if ((_this.parentForm && _this.formControlName) || _this.extFormControl) {
                if (!!val) {
                    _this.formControl.patchValue(val);
                }
            }
            if (val !== _this.ngModel) {
                _this.ngModelChange.emit(val);
            }
            _this.valueChanged.emit(val);
            _this.hideAutoCompleteDropdown();
            setTimeout(function () {
                if (_this.reFocusAfterSelect) {
                    _this.inputEl.focus();
                }
                return _this.inputEl;
            });
        };
        this.selectCustomValue = function (text) {
            _this.customSelected.emit(text);
            _this.hideAutoCompleteDropdown();
            setTimeout(function () {
                if (_this.reFocusAfterSelect) {
                    _this.inputEl.focus();
                }
                return _this.inputEl;
            });
        };
        this.enterNewText = function (value) {
            _this.renderValue(value);
            _this.ngModelChange.emit(value);
            _this.valueChanged.emit(value);
            _this.hideAutoCompleteDropdown();
        };
        this.keydownEventHandler = function (evt) {
            if (_this.componentRef) {
                var component = _this.componentRef.instance;
                component.inputElKeyHandler(evt);
            }
        };
        this.inputEventHandler = function (evt) {
            if (_this.componentRef) {
                var component = _this.componentRef.instance;
                component.dropdownVisible = true;
                component.keyword = evt.target.value;
                component.reloadListInDelay(evt);
            }
            else {
                _this.showAutoCompleteDropdown();
            }
        };
        this.el = this.viewContainerRef.element.nativeElement;
    }
    NguiAutoCompleteDirective.prototype.ngOnInit = function () {
        var _this = this;
        // Blur event is handled only after a click event.
        // This is to prevent handling of blur events resulting from interacting with a scrollbar
        // introduced by content overflow (Internet explorer issue).
        // See issue description here: http://stackoverflow.com/questions/2023779/clicking-on-a-divs-scroll-bar-fires-the-blur-event-in-ie
        this.documentClickListener = function (e) {
            if (_this.scheduledBlurHandler) {
                _this.scheduledBlurHandler();
                _this.scheduledBlurHandler = null;
            }
        };
        document.addEventListener('click', this.documentClickListener);
        // wrap this element with <div class="ngui-auto-complete">
        this.wrapperEl = document.createElement('div');
        this.wrapperEl.className = 'ngui-auto-complete-wrapper';
        this.wrapperEl.style.position = 'relative';
        this.el.parentElement.insertBefore(this.wrapperEl, this.el.nextSibling);
        this.wrapperEl.appendChild(this.el);
        // Check if we were supplied with a [formControlName] and it is inside a [form]
        // else check if we are supplied with a [FormControl] regardless if it is inside a [form] tag
        if (this.parentForm && this.formControlName) {
            if (this.parentForm['form']) {
                this.formControl = this.parentForm['form'].get(this.formControlName);
            }
            else if (this.parentForm instanceof FormGroupName) {
                this.formControl = this.parentForm.control.controls[this.formControlName];
            }
        }
        else if (this.extFormControl) {
            this.formControl = this.extFormControl;
        }
        // apply toString() method for the object
        if (!!this.ngModel) {
            this.selectNewValue(this.ngModel);
        }
        else if (!!this.formControl && this.formControl.value) {
            this.selectNewValue(this.formControl.value);
        }
    };
    NguiAutoCompleteDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        // if this element is not an input tag, move dropdown after input tag
        // so that it displays correctly
        this.inputEl = this.el.tagName === 'INPUT' ? this.el : this.el.querySelector('input');
        if (this.openOnFocus) {
            this.inputEl.addEventListener('focus', function (e) { return _this.showAutoCompleteDropdown(e); });
        }
        if (this.closeOnFocusOut) {
            this.inputEl.addEventListener('focusout', function (e) { return _this.hideAutoCompleteDropdown(e); });
        }
        if (!this.autocomplete) {
            this.inputEl.setAttribute('autocomplete', 'off');
        }
        this.inputEl.addEventListener('blur', function (e) {
            _this.scheduledBlurHandler = function () {
                return _this.blurHandler(e);
            };
        });
        this.inputEl.addEventListener('keydown', function (e) { return _this.keydownEventHandler(e); });
        this.inputEl.addEventListener('input', function (e) { return _this.inputEventHandler(e); });
    };
    NguiAutoCompleteDirective.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.instance.valueSelected.unsubscribe();
            this.componentRef.instance.textEntered.unsubscribe();
        }
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
        }
    };
    NguiAutoCompleteDirective.prototype.ngOnChanges = function (changes) {
        if (changes['ngModel']) {
            this.ngModel = this.setToStringFunction(changes['ngModel'].currentValue);
            this.renderValue(this.ngModel);
        }
    };
    NguiAutoCompleteDirective.prototype.blurHandler = function (event) {
        if (this.componentRef) {
            var component = this.componentRef.instance;
            if (this.selectOnBlur) {
                component.selectOne(component.filteredList[component.itemIndex]);
            }
            if (this.closeOnFocusOut) {
                this.hideAutoCompleteDropdown(event);
            }
        }
    };
    NguiAutoCompleteDirective.prototype.setToStringFunction = function (item) {
        if (item && typeof item === 'object') {
            var displayVal_1;
            if (typeof this.valueFormatter === 'string') {
                var matches = this.valueFormatter.match(/[a-zA-Z0-9_\$]+/g);
                var formatted_1 = this.valueFormatter;
                if (matches && typeof item !== 'string') {
                    matches.forEach(function (key) {
                        formatted_1 = formatted_1.replace(key, item[key]);
                    });
                }
                displayVal_1 = formatted_1;
            }
            else if (typeof this.valueFormatter === 'function') {
                displayVal_1 = this.valueFormatter(item);
            }
            else if (this.displayPropertyName) {
                displayVal_1 = item[this.displayPropertyName];
            }
            else if (typeof this.listFormatter === 'string' && this.listFormatter.match(/^\w+$/)) {
                displayVal_1 = item[this.listFormatter];
            }
            else {
                displayVal_1 = item.value;
            }
            item.toString = function () { return displayVal_1; };
        }
        return item;
    };
    NguiAutoCompleteDirective.prototype.renderValue = function (item) {
        if (!!this.inputEl) {
            this.inputEl.value = '' + item;
        }
    };
    NguiAutoCompleteDirective.ctorParameters = function () { return [
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef },
        { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] }
    ]; };
    __decorate([
        Input('autocomplete')
    ], NguiAutoCompleteDirective.prototype, "autocomplete", void 0);
    __decorate([
        Input('auto-complete-placeholder')
    ], NguiAutoCompleteDirective.prototype, "autoCompletePlaceholder", void 0);
    __decorate([
        Input('source')
    ], NguiAutoCompleteDirective.prototype, "source", void 0);
    __decorate([
        Input('path-to-data')
    ], NguiAutoCompleteDirective.prototype, "pathToData", void 0);
    __decorate([
        Input('min-chars')
    ], NguiAutoCompleteDirective.prototype, "minChars", void 0);
    __decorate([
        Input('display-property-name')
    ], NguiAutoCompleteDirective.prototype, "displayPropertyName", void 0);
    __decorate([
        Input('accept-user-input')
    ], NguiAutoCompleteDirective.prototype, "acceptUserInput", void 0);
    __decorate([
        Input('max-num-list')
    ], NguiAutoCompleteDirective.prototype, "maxNumList", void 0);
    __decorate([
        Input('select-value-of')
    ], NguiAutoCompleteDirective.prototype, "selectValueOf", void 0);
    __decorate([
        Input('loading-template')
    ], NguiAutoCompleteDirective.prototype, "loadingTemplate", void 0);
    __decorate([
        Input('list-formatter')
    ], NguiAutoCompleteDirective.prototype, "listFormatter", void 0);
    __decorate([
        Input('loading-text')
    ], NguiAutoCompleteDirective.prototype, "loadingText", void 0);
    __decorate([
        Input('blank-option-text')
    ], NguiAutoCompleteDirective.prototype, "blankOptionText", void 0);
    __decorate([
        Input('no-match-found-text')
    ], NguiAutoCompleteDirective.prototype, "noMatchFoundText", void 0);
    __decorate([
        Input('value-formatter')
    ], NguiAutoCompleteDirective.prototype, "valueFormatter", void 0);
    __decorate([
        Input('tab-to-select')
    ], NguiAutoCompleteDirective.prototype, "tabToSelect", void 0);
    __decorate([
        Input('select-on-blur')
    ], NguiAutoCompleteDirective.prototype, "selectOnBlur", void 0);
    __decorate([
        Input('match-formatted')
    ], NguiAutoCompleteDirective.prototype, "matchFormatted", void 0);
    __decorate([
        Input('auto-select-first-item')
    ], NguiAutoCompleteDirective.prototype, "autoSelectFirstItem", void 0);
    __decorate([
        Input('open-on-focus')
    ], NguiAutoCompleteDirective.prototype, "openOnFocus", void 0);
    __decorate([
        Input('close-on-focusout')
    ], NguiAutoCompleteDirective.prototype, "closeOnFocusOut", void 0);
    __decorate([
        Input('re-focus-after-select')
    ], NguiAutoCompleteDirective.prototype, "reFocusAfterSelect", void 0);
    __decorate([
        Input('header-item-template')
    ], NguiAutoCompleteDirective.prototype, "headerItemTemplate", void 0);
    __decorate([
        Input('ignore-accents')
    ], NguiAutoCompleteDirective.prototype, "ignoreAccents", void 0);
    __decorate([
        Input("no-filtering")
    ], NguiAutoCompleteDirective.prototype, "noFiltering", void 0);
    __decorate([
        Input()
    ], NguiAutoCompleteDirective.prototype, "ngModel", void 0);
    __decorate([
        Input('formControlName')
    ], NguiAutoCompleteDirective.prototype, "formControlName", void 0);
    __decorate([
        Input('formControl')
    ], NguiAutoCompleteDirective.prototype, "extFormControl", void 0);
    __decorate([
        Input('z-index')
    ], NguiAutoCompleteDirective.prototype, "zIndex", void 0);
    __decorate([
        Input('is-rtl')
    ], NguiAutoCompleteDirective.prototype, "isRtl", void 0);
    __decorate([
        Output()
    ], NguiAutoCompleteDirective.prototype, "ngModelChange", void 0);
    __decorate([
        Output()
    ], NguiAutoCompleteDirective.prototype, "valueChanged", void 0);
    __decorate([
        Output()
    ], NguiAutoCompleteDirective.prototype, "customSelected", void 0);
    NguiAutoCompleteDirective = __decorate([
        Directive({
            // tslint:disable-next-line:directive-selector
            selector: '[auto-complete], [ngui-auto-complete]'
        }),
        __param(2, Optional()), __param(2, Host()), __param(2, SkipSelf())
    ], NguiAutoCompleteDirective);
    return NguiAutoCompleteDirective;
}());
export { NguiAutoCompleteDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd1aS9hdXRvLWNvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG8tY29tcGxldGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUFFLHdCQUF3QixFQUN2QyxZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFBRSxJQUFJLEVBQ2xCLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFBRSxRQUFRLEVBQ2hCLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUNsRCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFNdEU7SUFtREUsbUNBQW9CLFFBQWtDLEVBQ2xDLGdCQUFrQyxFQUNGLFVBQTRCO1FBRmhGLGlCQUlDO1FBSm1CLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDRixlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQW5EbEQsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFNaEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFHeEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFM0IsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFJdkIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbEIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDcEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDaEIsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ2Ysb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFDbkIs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QStCO0lBQzFCO1FBQS9CLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQzt5RUFBa0M7SUFDbEM7UUFBOUIsS0FBSyxDQUFDLHNCQUFzQixDQUFDO3lFQUFrQztJQUN2QztRQUF4QixLQUFLLENBQUMsZ0JBQWdCLENBQUM7b0VBQTZCO0lBQzlCO1FBQXRCLEtBQUssQ0FBQyxjQUFjLENBQUM7a0VBQThCO0lBRTNDO1FBQVIsS0FBSyxFQUFFOzhEQUF3QjtJQUNOO1FBQXpCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztzRUFBZ0M7SUFHbkM7UUFBckIsS0FBSyxDQUFDLGFBQWEsQ0FBQztxRUFBb0M7SUFDdkM7UUFBakIsS0FBSyxDQUFDLFNBQVMsQ0FBQzs2REFBcUI7SUFDckI7UUFBaEIsS0FBSyxDQUFDLFFBQVEsQ0FBQzs0REFBc0I7SUFFNUI7UUFBVCxNQUFNLEVBQUU7b0VBQTJDO0lBQzFDO1FBQVQsTUFBTSxFQUFFO21FQUEwQztJQUN6QztRQUFULE1BQU0sRUFBRTtxRUFBNEM7SUF0QzFDLHlCQUF5QjtRQUpyQyxTQUFTLENBQUM7WUFDVCw4Q0FBOEM7WUFDOUMsUUFBUSxFQUFFLHVDQUF1QztTQUNsRCxDQUFDO1FBc0RhLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLElBQUksRUFBRSxDQUFBLEVBQUUsV0FBQSxRQUFRLEVBQUUsQ0FBQTtPQXJEaEMseUJBQXlCLENBZ1hyQztJQUFELGdDQUFDO0NBQUEsQUFoWEQsSUFnWEM7U0FoWFkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLCBIb3N0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCwgT3B0aW9uYWwsXG4gIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgU2tpcFNlbGYsIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIENvbnRyb2xDb250YWluZXIsIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIEZvcm1Hcm91cE5hbWUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlQ29tcG9uZW50IH0gZnJvbSAnLi9hdXRvLWNvbXBsZXRlLmNvbXBvbmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnW2F1dG8tY29tcGxldGVdLCBbbmd1aS1hdXRvLWNvbXBsZXRlXSdcbn0pXG5leHBvcnQgY2xhc3MgTmd1aUF1dG9Db21wbGV0ZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgnYXV0b2NvbXBsZXRlJykgcHVibGljIGF1dG9jb21wbGV0ZSA9IGZhbHNlO1xuICBASW5wdXQoJ2F1dG8tY29tcGxldGUtcGxhY2Vob2xkZXInKSBwdWJsaWMgYXV0b0NvbXBsZXRlUGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCdzb3VyY2UnKSBwdWJsaWMgc291cmNlOiBhbnk7XG4gIEBJbnB1dCgncGF0aC10by1kYXRhJykgcHVibGljIHBhdGhUb0RhdGE6IHN0cmluZztcbiAgQElucHV0KCdtaW4tY2hhcnMnKSBwdWJsaWMgbWluQ2hhcnM6IG51bWJlcjtcbiAgQElucHV0KCdkaXNwbGF5LXByb3BlcnR5LW5hbWUnKSBwdWJsaWMgZGlzcGxheVByb3BlcnR5TmFtZTogc3RyaW5nO1xuICBASW5wdXQoJ2FjY2VwdC11c2VyLWlucHV0JykgcHVibGljIGFjY2VwdFVzZXJJbnB1dCA9IHRydWU7XG4gIEBJbnB1dCgnbWF4LW51bS1saXN0JykgcHVibGljIG1heE51bUxpc3Q6IHN0cmluZztcbiAgQElucHV0KCdzZWxlY3QtdmFsdWUtb2YnKSBwdWJsaWMgc2VsZWN0VmFsdWVPZjogc3RyaW5nO1xuICBASW5wdXQoJ2xvYWRpbmctdGVtcGxhdGUnKSBwdWJsaWMgbG9hZGluZ1RlbXBsYXRlID0gbnVsbDtcbiAgQElucHV0KCdsaXN0LWZvcm1hdHRlcicpIHB1YmxpYyBsaXN0Rm9ybWF0dGVyO1xuICBASW5wdXQoJ2xvYWRpbmctdGV4dCcpIHB1YmxpYyBsb2FkaW5nVGV4dCA9ICdMb2FkaW5nJztcbiAgQElucHV0KCdibGFuay1vcHRpb24tdGV4dCcpIHB1YmxpYyBibGFua09wdGlvblRleHQ6IHN0cmluZztcbiAgQElucHV0KCduby1tYXRjaC1mb3VuZC10ZXh0JykgcHVibGljIG5vTWF0Y2hGb3VuZFRleHQ6IHN0cmluZztcbiAgQElucHV0KCd2YWx1ZS1mb3JtYXR0ZXInKSBwdWJsaWMgdmFsdWVGb3JtYXR0ZXI6IGFueTtcbiAgQElucHV0KCd0YWItdG8tc2VsZWN0JykgcHVibGljIHRhYlRvU2VsZWN0ID0gdHJ1ZTtcbiAgQElucHV0KCdzZWxlY3Qtb24tYmx1cicpIHB1YmxpYyBzZWxlY3RPbkJsdXIgPSBmYWxzZTtcbiAgQElucHV0KCdtYXRjaC1mb3JtYXR0ZWQnKSBwdWJsaWMgbWF0Y2hGb3JtYXR0ZWQgPSBmYWxzZTtcbiAgQElucHV0KCdhdXRvLXNlbGVjdC1maXJzdC1pdGVtJykgcHVibGljIGF1dG9TZWxlY3RGaXJzdEl0ZW0gPSBmYWxzZTtcbiAgQElucHV0KCdvcGVuLW9uLWZvY3VzJykgcHVibGljIG9wZW5PbkZvY3VzID0gdHJ1ZTtcbiAgQElucHV0KCdjbG9zZS1vbi1mb2N1c291dCcpIHB1YmxpYyBjbG9zZU9uRm9jdXNPdXQgPSB0cnVlO1xuICBASW5wdXQoJ3JlLWZvY3VzLWFmdGVyLXNlbGVjdCcpIHB1YmxpYyByZUZvY3VzQWZ0ZXJTZWxlY3QgPSB0cnVlO1xuICBASW5wdXQoJ2hlYWRlci1pdGVtLXRlbXBsYXRlJykgcHVibGljIGhlYWRlckl0ZW1UZW1wbGF0ZSA9IG51bGw7XG4gIEBJbnB1dCgnaWdub3JlLWFjY2VudHMnKSBwdWJsaWMgaWdub3JlQWNjZW50cyA9IHRydWU7XG4gIEBJbnB1dChcIm5vLWZpbHRlcmluZ1wiKSBub0ZpbHRlcmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHB1YmxpYyBuZ01vZGVsOiBzdHJpbmc7XG4gIEBJbnB1dCgnZm9ybUNvbnRyb2xOYW1lJykgcHVibGljIGZvcm1Db250cm9sTmFtZTogc3RyaW5nO1xuICAvLyBpZiBbZm9ybUNvbnRyb2xdIGlzIHVzZWQgb24gdGhlIGFuY2hvciB3aGVyZSBvdXIgZGlyZWN0aXZlIGlzIHNpdHRpbmdcbiAgLy8gYSBmb3JtIGlzIG5vdCBuZWNlc3NhcnkgdG8gdXNlIGEgZm9ybUNvbnRyb2wgd2Ugc2hvdWxkIGFsc28gc3VwcG9ydCB0aGlzXG4gIEBJbnB1dCgnZm9ybUNvbnRyb2wnKSBwdWJsaWMgZXh0Rm9ybUNvbnRyb2w6IEZvcm1Db250cm9sO1xuICBASW5wdXQoJ3otaW5kZXgnKSBwdWJsaWMgekluZGV4ID0gJzEnO1xuICBASW5wdXQoJ2lzLXJ0bCcpIHB1YmxpYyBpc1J0bCA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBwdWJsaWMgbmdNb2RlbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyB2YWx1ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgY3VzdG9tU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxOZ3VpQXV0b0NvbXBsZXRlQ29tcG9uZW50PjtcbiAgcHJpdmF0ZSB3cmFwcGVyRWw6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGVsOiBIVE1MRWxlbWVudDsgICAvLyB0aGlzIGVsZW1lbnQgZWxlbWVudCwgY2FuIGJlIGFueVxuICBwcml2YXRlIGFjRHJvcGRvd25FbDogSFRNTEVsZW1lbnQ7IC8vIGF1dG8gY29tcGxldGUgZWxlbWVudFxuICBwcml2YXRlIGlucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQ7ICAvLyBpbnB1dCBlbGVtZW50IG9mIHRoaXMgZWxlbWVudFxuICBwcml2YXRlIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIHByaXZhdGUgcmV2ZXJ0VmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBkcm9wZG93bkp1c3RIaWRkZW46IGJvb2xlYW47XG4gIHByaXZhdGUgc2NoZWR1bGVkQmx1ckhhbmRsZXI6IGFueTtcbiAgcHJpdmF0ZSBkb2N1bWVudENsaWNrTGlzdGVuZXI6IChlOiBNb3VzZUV2ZW50KSA9PiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBwYXJlbnRGb3JtOiBDb250cm9sQ29udGFpbmVyKSB7XG4gICAgdGhpcy5lbCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBCbHVyIGV2ZW50IGlzIGhhbmRsZWQgb25seSBhZnRlciBhIGNsaWNrIGV2ZW50LlxuICAgIC8vIFRoaXMgaXMgdG8gcHJldmVudCBoYW5kbGluZyBvZiBibHVyIGV2ZW50cyByZXN1bHRpbmcgZnJvbSBpbnRlcmFjdGluZyB3aXRoIGEgc2Nyb2xsYmFyXG4gICAgLy8gaW50cm9kdWNlZCBieSBjb250ZW50IG92ZXJmbG93IChJbnRlcm5ldCBleHBsb3JlciBpc3N1ZSkuXG4gICAgLy8gU2VlIGlzc3VlIGRlc2NyaXB0aW9uIGhlcmU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjAyMzc3OS9jbGlja2luZy1vbi1hLWRpdnMtc2Nyb2xsLWJhci1maXJlcy10aGUtYmx1ci1ldmVudC1pbi1pZVxuICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgIGlmICh0aGlzLnNjaGVkdWxlZEJsdXJIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQmx1ckhhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRCbHVySGFuZGxlciA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpO1xuICAgIC8vIHdyYXAgdGhpcyBlbGVtZW50IHdpdGggPGRpdiBjbGFzcz1cIm5ndWktYXV0by1jb21wbGV0ZVwiPlxuICAgIHRoaXMud3JhcHBlckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy53cmFwcGVyRWwuY2xhc3NOYW1lID0gJ25ndWktYXV0by1jb21wbGV0ZS13cmFwcGVyJztcbiAgICB0aGlzLndyYXBwZXJFbC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy5lbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLndyYXBwZXJFbCwgdGhpcy5lbC5uZXh0U2libGluZyk7XG4gICAgdGhpcy53cmFwcGVyRWwuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG5cbiAgICAvLyBDaGVjayBpZiB3ZSB3ZXJlIHN1cHBsaWVkIHdpdGggYSBbZm9ybUNvbnRyb2xOYW1lXSBhbmQgaXQgaXMgaW5zaWRlIGEgW2Zvcm1dXG4gICAgLy8gZWxzZSBjaGVjayBpZiB3ZSBhcmUgc3VwcGxpZWQgd2l0aCBhIFtGb3JtQ29udHJvbF0gcmVnYXJkbGVzcyBpZiBpdCBpcyBpbnNpZGUgYSBbZm9ybV0gdGFnXG4gICAgaWYgKHRoaXMucGFyZW50Rm9ybSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSkge1xuICAgICAgaWYgKHRoaXMucGFyZW50Rm9ybVsnZm9ybSddKSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wgPSAodGhpcy5wYXJlbnRGb3JtWydmb3JtJ10gYXMgRm9ybUdyb3VwKS5nZXQodGhpcy5mb3JtQ29udHJvbE5hbWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudEZvcm0gaW5zdGFuY2VvZiBGb3JtR3JvdXBOYW1lKSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wgPSAodGhpcy5wYXJlbnRGb3JtIGFzIEZvcm1Hcm91cE5hbWUpLmNvbnRyb2wuY29udHJvbHNbdGhpcy5mb3JtQ29udHJvbE5hbWVdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5leHRGb3JtQ29udHJvbCkge1xuICAgICAgdGhpcy5mb3JtQ29udHJvbCA9IHRoaXMuZXh0Rm9ybUNvbnRyb2w7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgdG9TdHJpbmcoKSBtZXRob2QgZm9yIHRoZSBvYmplY3RcbiAgICBpZiAoISF0aGlzLm5nTW9kZWwpIHtcbiAgICAgIHRoaXMuc2VsZWN0TmV3VmFsdWUodGhpcy5uZ01vZGVsKTtcbiAgICB9IGVsc2UgaWYgKCEhdGhpcy5mb3JtQ29udHJvbCAmJiB0aGlzLmZvcm1Db250cm9sLnZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdE5ld1ZhbHVlKHRoaXMuZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIH1cblxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIGlmIHRoaXMgZWxlbWVudCBpcyBub3QgYW4gaW5wdXQgdGFnLCBtb3ZlIGRyb3Bkb3duIGFmdGVyIGlucHV0IHRhZ1xuICAgIC8vIHNvIHRoYXQgaXQgZGlzcGxheXMgY29ycmVjdGx5XG4gICAgdGhpcy5pbnB1dEVsID0gdGhpcy5lbC50YWdOYW1lID09PSAnSU5QVVQnID8gdGhpcy5lbCBhcyBIVE1MSW5wdXRFbGVtZW50IDogdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuXG4gICAgaWYgKHRoaXMub3Blbk9uRm9jdXMpIHtcbiAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChlKSA9PiB0aGlzLnNob3dBdXRvQ29tcGxldGVEcm9wZG93bihlKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2xvc2VPbkZvY3VzT3V0KSB7XG4gICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCAoZSkgPT4gdGhpcy5oaWRlQXV0b0NvbXBsZXRlRHJvcGRvd24oZSkpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5hdXRvY29tcGxldGUpIHtcbiAgICAgIHRoaXMuaW5wdXRFbC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsICdvZmYnKTtcbiAgICB9XG4gICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY2hlZHVsZWRCbHVySGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmx1ckhhbmRsZXIoZSk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHRoaXMua2V5ZG93bkV2ZW50SGFuZGxlcihlKSk7XG4gICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHRoaXMuaW5wdXRFdmVudEhhbmRsZXIoZSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS52YWx1ZVNlbGVjdGVkLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS50ZXh0RW50ZXJlZC51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snbmdNb2RlbCddKSB7XG4gICAgICB0aGlzLm5nTW9kZWwgPSB0aGlzLnNldFRvU3RyaW5nRnVuY3Rpb24oY2hhbmdlc1snbmdNb2RlbCddLmN1cnJlbnRWYWx1ZSk7XG4gICAgICB0aGlzLnJlbmRlclZhbHVlKHRoaXMubmdNb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2hvdyBhdXRvLWNvbXBsZXRlIGxpc3QgYmVsb3cgdGhlIGN1cnJlbnQgZWxlbWVudFxuICBwdWJsaWMgc2hvd0F1dG9Db21wbGV0ZURyb3Bkb3duID0gKGV2ZW50PzogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMuZHJvcGRvd25KdXN0SGlkZGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaGlkZUF1dG9Db21wbGV0ZURyb3Bkb3duKCk7XG4gICAgdGhpcy5zY2hlZHVsZWRCbHVySGFuZGxlciA9IG51bGw7XG5cbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ3VpQXV0b0NvbXBsZXRlQ29tcG9uZW50KTtcblxuICAgIHRoaXMuY29tcG9uZW50UmVmID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIGNvbXBvbmVudC5rZXl3b3JkID0gdGhpcy5pbnB1dEVsLnZhbHVlO1xuICAgIGNvbXBvbmVudC5zaG93SW5wdXRUYWcgPSBmYWxzZTsgLy8gRG8gTk9UIGRpc3BsYXkgYXV0b2NvbXBsZXRlIGlucHV0IHRhZyBzZXBhcmF0ZWx5XG5cbiAgICBjb21wb25lbnQucGF0aFRvRGF0YSA9IHRoaXMucGF0aFRvRGF0YTtcbiAgICBjb21wb25lbnQubWluQ2hhcnMgPSB0aGlzLm1pbkNoYXJzO1xuICAgIGNvbXBvbmVudC5zb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICBjb21wb25lbnQucGxhY2Vob2xkZXIgPSB0aGlzLmF1dG9Db21wbGV0ZVBsYWNlaG9sZGVyO1xuICAgIGNvbXBvbmVudC5hY2NlcHRVc2VySW5wdXQgPSB0aGlzLmFjY2VwdFVzZXJJbnB1dDtcbiAgICBjb21wb25lbnQubWF4TnVtTGlzdCA9IHBhcnNlSW50KHRoaXMubWF4TnVtTGlzdCwgMTApO1xuXG4gICAgY29tcG9uZW50LmxvYWRpbmdUZXh0ID0gdGhpcy5sb2FkaW5nVGV4dDtcbiAgICBjb21wb25lbnQubG9hZGluZ1RlbXBsYXRlID0gdGhpcy5sb2FkaW5nVGVtcGxhdGU7XG4gICAgY29tcG9uZW50Lmxpc3RGb3JtYXR0ZXIgPSB0aGlzLmxpc3RGb3JtYXR0ZXI7XG4gICAgY29tcG9uZW50LmJsYW5rT3B0aW9uVGV4dCA9IHRoaXMuYmxhbmtPcHRpb25UZXh0O1xuICAgIGNvbXBvbmVudC5ub01hdGNoRm91bmRUZXh0ID0gdGhpcy5ub01hdGNoRm91bmRUZXh0O1xuICAgIGNvbXBvbmVudC50YWJUb1NlbGVjdCA9IHRoaXMudGFiVG9TZWxlY3Q7XG4gICAgY29tcG9uZW50LnNlbGVjdE9uQmx1ciA9IHRoaXMuc2VsZWN0T25CbHVyO1xuICAgIGNvbXBvbmVudC5tYXRjaEZvcm1hdHRlZCA9IHRoaXMubWF0Y2hGb3JtYXR0ZWQ7XG4gICAgY29tcG9uZW50LmF1dG9TZWxlY3RGaXJzdEl0ZW0gPSB0aGlzLmF1dG9TZWxlY3RGaXJzdEl0ZW07XG4gICAgY29tcG9uZW50LmhlYWRlckl0ZW1UZW1wbGF0ZSA9IHRoaXMuaGVhZGVySXRlbVRlbXBsYXRlO1xuICAgIGNvbXBvbmVudC5pZ25vcmVBY2NlbnRzID0gdGhpcy5pZ25vcmVBY2NlbnRzO1xuICAgIGNvbXBvbmVudC5ub0ZpbHRlcmluZyA9IHRoaXMubm9GaWx0ZXJpbmc7XG5cbiAgICBjb21wb25lbnQudmFsdWVTZWxlY3RlZC5zdWJzY3JpYmUodGhpcy5zZWxlY3ROZXdWYWx1ZSk7XG4gICAgY29tcG9uZW50LnRleHRFbnRlcmVkLnN1YnNjcmliZSh0aGlzLmVudGVyTmV3VGV4dCk7XG4gICAgY29tcG9uZW50LmN1c3RvbVNlbGVjdGVkLnN1YnNjcmliZSh0aGlzLnNlbGVjdEN1c3RvbVZhbHVlKTtcblxuICAgIHRoaXMuYWNEcm9wZG93bkVsID0gdGhpcy5jb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmFjRHJvcGRvd25FbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgLy8gaWYgdGhpcyBlbGVtZW50IGlzIG5vdCBhbiBpbnB1dCB0YWcsIG1vdmUgZHJvcGRvd24gYWZ0ZXIgaW5wdXQgdGFnXG4gICAgLy8gc28gdGhhdCBpdCBkaXNwbGF5cyBjb3JyZWN0bHlcblxuICAgIC8vIFRPRE86IGNvbmZpcm0gd2l0aCBvd25lcnNcbiAgICAvLyB3aXRoIHNvbWUgcmVhc29uLCB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudCBpcyBjcmVhdGluZyBlbGVtZW50XG4gICAgLy8gdG8gcGFyZW50IGRpdiB3aGljaCBpcyBjcmVhdGVkIGJ5IHVzIG9uIG5nT25Jbml0LCBwbGVhc2UgdHJ5IHRoaXMgd2l0aCBkZW1vXG5cbiAgICAvLyBpZiAodGhpcy5lbC50YWdOYW1lICE9PSAnSU5QVVQnICYmIHRoaXMuYWNEcm9wZG93bkVsKSB7XG4gICAgdGhpcy5pbnB1dEVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMuYWNEcm9wZG93bkVsLCB0aGlzLmlucHV0RWwubmV4dFNpYmxpbmcpO1xuICAgIC8vIH1cbiAgICB0aGlzLnJldmVydFZhbHVlID0gdHlwZW9mIHRoaXMubmdNb2RlbCAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLm5nTW9kZWwgOiB0aGlzLmlucHV0RWwudmFsdWU7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbXBvbmVudC5yZWxvYWRMaXN0KHRoaXMuaW5wdXRFbC52YWx1ZSk7XG4gICAgICB0aGlzLnN0eWxlQXV0b0NvbXBsZXRlRHJvcGRvd24oKTtcbiAgICAgIGNvbXBvbmVudC5kcm9wZG93blZpc2libGUgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGJsdXJIYW5kbGVyKGV2ZW50OiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuXG4gICAgICBpZiAodGhpcy5zZWxlY3RPbkJsdXIpIHtcbiAgICAgICAgY29tcG9uZW50LnNlbGVjdE9uZShjb21wb25lbnQuZmlsdGVyZWRMaXN0W2NvbXBvbmVudC5pdGVtSW5kZXhdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xvc2VPbkZvY3VzT3V0KSB7XG4gICAgICAgIHRoaXMuaGlkZUF1dG9Db21wbGV0ZURyb3Bkb3duKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGlkZUF1dG9Db21wbGV0ZURyb3Bkb3duID0gKGV2ZW50PzogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICBsZXQgY3VycmVudEl0ZW06IGFueTtcbiAgICAgIGNvbnN0IGhhc1JldmVydFZhbHVlID0gKHR5cGVvZiB0aGlzLnJldmVydFZhbHVlICE9PSAndW5kZWZpbmVkJyk7XG4gICAgICBpZiAodGhpcy5pbnB1dEVsICYmIGhhc1JldmVydFZhbHVlICYmIHRoaXMuYWNjZXB0VXNlcklucHV0ID09PSBmYWxzZSkge1xuICAgICAgICBjdXJyZW50SXRlbSA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmZpbmRJdGVtRnJvbVNlbGVjdFZhbHVlKHRoaXMuaW5wdXRFbC52YWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHRoaXMuaW5wdXRFbCAmJiBoYXNSZXZlcnRWYWx1ZSAmJiB0aGlzLmFjY2VwdFVzZXJJbnB1dCA9PT0gZmFsc2UgJiYgY3VycmVudEl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZWxlY3ROZXdWYWx1ZSh0aGlzLnJldmVydFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dEVsICYmIHRoaXMuYWNjZXB0VXNlcklucHV0ID09PSB0cnVlICYmIHR5cGVvZiBjdXJyZW50SXRlbSA9PT0gJ3VuZGVmaW5lZCcgJiYgZXZlbnQgJiYgZXZlbnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMuZW50ZXJOZXdUZXh0KGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZHJvcGRvd25KdXN0SGlkZGVuID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZHJvcGRvd25KdXN0SGlkZGVuID0gZmFsc2UsIDEwMCk7XG4gIH1cblxuICBwdWJsaWMgc3R5bGVBdXRvQ29tcGxldGVEcm9wZG93biA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuXG4gICAgICBsZXQgc2Nyb2xsaGVpZ2h0ID0gMDtcbiAgICAgIGlmICh0aGlzLnNvdXJjZSAmJiB0aGlzLnNvdXJjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNjcm9sbGhlaWdodCA9IHRoaXMuc291cmNlLmxlbmd0aCAqIDI0OyAgLy8g44OX44Or44OA44Km44Oz44Gub3B0aW9uMeOBpOOBrmhlaWdodOOBjDI0cHhcbiAgICAgICAgc2Nyb2xsaGVpZ2h0ID0gc2Nyb2xsaGVpZ2h0ID4gMzAwID8gMzAwIDogc2Nyb2xsaGVpZ2h0OyAgLy8gMzAw5Lul5LiK44GvMzAw44Gr44GZ44KLXG4gICAgICB9XG4gICAgICBzY3JvbGxoZWlnaHQgKz0gNTA7ICAvLyDjg5Xjg4Pjgr/jg7zjgYzjgYLjgovjgYvjgoLjgZfjgozjgarjgYTjga7jgafjgIHjg5Xjg4Pjgr/jg7zliIbjga7jgqrjg5Xjgrvjg4Pjg4jjgpLliqDlkbPjgZnjgotcblxuICAgICAgLyogc2V0dGluZyB3aWR0aC9oZWlnaHQgYXV0byBjb21wbGV0ZSAqL1xuICAgICAgY29uc3QgdGhpc0VsQkNSID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHRoaXNJbnB1dEVsQkNSID0gdGhpcy5pbnB1dEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgY2xvc2VUb0JvdHRvbSA9IHRoaXNJbnB1dEVsQkNSLmJvdHRvbSArIHNjcm9sbGhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbk9mU3R5bGUgPSB0aGlzLmlzUnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JztcblxuICAgICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUud2lkdGggPSB0aGlzSW5wdXRFbEJDUi53aWR0aCArICdweCc7XG4gICAgICB0aGlzLmFjRHJvcGRvd25FbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0aGlzLmFjRHJvcGRvd25FbC5zdHlsZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgICAgIHRoaXMuYWNEcm9wZG93bkVsLnN0eWxlW2RpcmVjdGlvbk9mU3R5bGVdID0gJzAnO1xuICAgICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuXG4gICAgICBpZiAoY2xvc2VUb0JvdHRvbSkge1xuICAgICAgICB0aGlzLmFjRHJvcGRvd25FbC5zdHlsZS5ib3R0b20gPSBgJHt0aGlzSW5wdXRFbEJDUi5oZWlnaHR9cHhgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUudG9wID0gYCR7dGhpc0lucHV0RWxCQ1IuaGVpZ2h0fXB4YDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0VG9TdHJpbmdGdW5jdGlvbihpdGVtOiBhbnkpOiBhbnkge1xuICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgbGV0IGRpc3BsYXlWYWw7XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZUZvcm1hdHRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMudmFsdWVGb3JtYXR0ZXIubWF0Y2goL1thLXpBLVowLTlfXFwkXSsvZyk7XG4gICAgICAgIGxldCBmb3JtYXR0ZWQgPSB0aGlzLnZhbHVlRm9ybWF0dGVyO1xuICAgICAgICBpZiAobWF0Y2hlcyAmJiB0eXBlb2YgaXRlbSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBtYXRjaGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgZm9ybWF0dGVkID0gZm9ybWF0dGVkLnJlcGxhY2Uoa2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXlWYWwgPSBmb3JtYXR0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnZhbHVlRm9ybWF0dGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRpc3BsYXlWYWwgPSB0aGlzLnZhbHVlRm9ybWF0dGVyKGl0ZW0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmRpc3BsYXlQcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgZGlzcGxheVZhbCA9IGl0ZW1bdGhpcy5kaXNwbGF5UHJvcGVydHlOYW1lXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMubGlzdEZvcm1hdHRlciA9PT0gJ3N0cmluZycgJiYgdGhpcy5saXN0Rm9ybWF0dGVyLm1hdGNoKC9eXFx3KyQvKSkge1xuICAgICAgICBkaXNwbGF5VmFsID0gaXRlbVt0aGlzLmxpc3RGb3JtYXR0ZXJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheVZhbCA9IGl0ZW0udmFsdWU7XG4gICAgICB9XG4gICAgICBpdGVtLnRvU3RyaW5nID0gKCkgPT4gZGlzcGxheVZhbDtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0TmV3VmFsdWUgPSAoaXRlbTogYW55KSA9PiB7XG4gICAgLy8gbWFrZSBkaXNwbGF5YWJsZSB2YWx1ZVxuICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgaXRlbSA9IHRoaXMuc2V0VG9TdHJpbmdGdW5jdGlvbihpdGVtKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlclZhbHVlKGl0ZW0pO1xuXG4gICAgLy8gbWFrZSByZXR1cm4gdmFsdWVcbiAgICBsZXQgdmFsID0gaXRlbTtcbiAgICBpZiAodGhpcy5zZWxlY3RWYWx1ZU9mICYmIGl0ZW1bdGhpcy5zZWxlY3RWYWx1ZU9mXSkge1xuICAgICAgdmFsID0gaXRlbVt0aGlzLnNlbGVjdFZhbHVlT2ZdO1xuICAgIH1cbiAgICBpZiAoKHRoaXMucGFyZW50Rm9ybSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSkgfHwgdGhpcy5leHRGb3JtQ29udHJvbCkge1xuICAgICAgaWYgKCEhdmFsKSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wucGF0Y2hWYWx1ZSh2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFsICE9PSB0aGlzLm5nTW9kZWwpIHtcbiAgICAgIHRoaXMubmdNb2RlbENoYW5nZS5lbWl0KHZhbCk7XG4gICAgfVxuICAgIHRoaXMudmFsdWVDaGFuZ2VkLmVtaXQodmFsKTtcbiAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGVEcm9wZG93bigpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucmVGb2N1c0FmdGVyU2VsZWN0KSB7XG4gICAgICAgIHRoaXMuaW5wdXRFbC5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dEVsO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdEN1c3RvbVZhbHVlID0gKHRleHQ6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuY3VzdG9tU2VsZWN0ZWQuZW1pdCh0ZXh0KTtcbiAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGVEcm9wZG93bigpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucmVGb2N1c0FmdGVyU2VsZWN0KSB7XG4gICAgICAgIHRoaXMuaW5wdXRFbC5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dEVsO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGVudGVyTmV3VGV4dCA9ICh2YWx1ZTogYW55KSA9PiB7XG4gICAgdGhpcy5yZW5kZXJWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5uZ01vZGVsQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIHRoaXMudmFsdWVDaGFuZ2VkLmVtaXQodmFsdWUpO1xuICAgIHRoaXMuaGlkZUF1dG9Db21wbGV0ZURyb3Bkb3duKCk7XG4gIH1cblxuICBwcml2YXRlIGtleWRvd25FdmVudEhhbmRsZXIgPSAoZXZ0OiBhbnkpID0+IHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgY29tcG9uZW50LmlucHV0RWxLZXlIYW5kbGVyKGV2dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnB1dEV2ZW50SGFuZGxlciA9IChldnQ6IGFueSkgPT4ge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgICBjb21wb25lbnQuZHJvcGRvd25WaXNpYmxlID0gdHJ1ZTtcbiAgICAgIGNvbXBvbmVudC5rZXl3b3JkID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgIGNvbXBvbmVudC5yZWxvYWRMaXN0SW5EZWxheShldnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3dBdXRvQ29tcGxldGVEcm9wZG93bigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVmFsdWUoaXRlbTogYW55KSB7XG4gICAgaWYgKCEhdGhpcy5pbnB1dEVsKSB7XG4gICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSAnJyArIGl0ZW07XG4gICAgfVxuICB9XG59XG4iXX0=