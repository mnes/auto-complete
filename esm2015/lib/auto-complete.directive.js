import { __decorate, __param } from "tslib";
import { AfterViewInit, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Host, Input, OnChanges, OnDestroy, OnInit, Optional, Output, SimpleChanges, SkipSelf, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, FormGroupName } from '@angular/forms';
import { NguiAutoCompleteComponent } from './auto-complete.component';
let NguiAutoCompleteDirective = class NguiAutoCompleteDirective {
    constructor(resolver, viewContainerRef, parentForm) {
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
        this.showAutoCompleteDropdown = (event) => {
            if (this.dropdownJustHidden) {
                return;
            }
            this.hideAutoCompleteDropdown();
            this.scheduledBlurHandler = null;
            const factory = this.resolver.resolveComponentFactory(NguiAutoCompleteComponent);
            this.componentRef = this.viewContainerRef.createComponent(factory);
            const component = this.componentRef.instance;
            component.keyword = this.inputEl.value;
            component.showInputTag = false; // Do NOT display autocomplete input tag separately
            component.pathToData = this.pathToData;
            component.minChars = this.minChars;
            component.source = this.source;
            component.placeholder = this.autoCompletePlaceholder;
            component.acceptUserInput = this.acceptUserInput;
            component.maxNumList = parseInt(this.maxNumList, 10);
            component.loadingText = this.loadingText;
            component.loadingTemplate = this.loadingTemplate;
            component.listFormatter = this.listFormatter;
            component.blankOptionText = this.blankOptionText;
            component.noMatchFoundText = this.noMatchFoundText;
            component.tabToSelect = this.tabToSelect;
            component.selectOnBlur = this.selectOnBlur;
            component.matchFormatted = this.matchFormatted;
            component.autoSelectFirstItem = this.autoSelectFirstItem;
            component.headerItemTemplate = this.headerItemTemplate;
            component.ignoreAccents = this.ignoreAccents;
            component.noFiltering = this.noFiltering;
            component.valueSelected.subscribe(this.selectNewValue);
            component.textEntered.subscribe(this.enterNewText);
            component.customSelected.subscribe(this.selectCustomValue);
            this.acDropdownEl = this.componentRef.location.nativeElement;
            this.acDropdownEl.style.display = 'none';
            // if this element is not an input tag, move dropdown after input tag
            // so that it displays correctly
            // TODO: confirm with owners
            // with some reason, viewContainerRef.createComponent is creating element
            // to parent div which is created by us on ngOnInit, please try this with demo
            // if (this.el.tagName !== 'INPUT' && this.acDropdownEl) {
            this.inputEl.parentElement.insertBefore(this.acDropdownEl, this.inputEl.nextSibling);
            // }
            this.revertValue = typeof this.ngModel !== 'undefined' ? this.ngModel : this.inputEl.value;
            setTimeout(() => {
                component.reloadList(this.inputEl.value);
                this.styleAutoCompleteDropdown();
                component.dropdownVisible = true;
            });
        };
        this.hideAutoCompleteDropdown = (event) => {
            if (this.componentRef) {
                let currentItem;
                const hasRevertValue = (typeof this.revertValue !== 'undefined');
                if (this.inputEl && hasRevertValue && this.acceptUserInput === false) {
                    currentItem = this.componentRef.instance.findItemFromSelectValue(this.inputEl.value);
                }
                this.componentRef.destroy();
                this.componentRef = undefined;
                if (this.inputEl && hasRevertValue && this.acceptUserInput === false && currentItem === null) {
                    this.selectNewValue(this.revertValue);
                }
                else if (this.inputEl && this.acceptUserInput === true && typeof currentItem === 'undefined' && event && event.target.value) {
                    this.enterNewText(event.target.value);
                }
            }
            this.dropdownJustHidden = true;
            setTimeout(() => this.dropdownJustHidden = false, 100);
        };
        this.styleAutoCompleteDropdown = () => {
            if (this.componentRef) {
                const component = this.componentRef.instance;
                let scrollheight = 0;
                if (this.source && this.source.length > 0) {
                    scrollheight = this.source.length * 24; // プルダウンのoption1つのheightが24px
                    scrollheight = scrollheight > 300 ? 300 : scrollheight; // 300以上は300にする
                }
                scrollheight += 50; // フッターがあるかもしれないので、フッター分のオフセットを加味する
                /* setting width/height auto complete */
                const thisElBCR = this.el.getBoundingClientRect();
                const thisInputElBCR = this.inputEl.getBoundingClientRect();
                const closeToBottom = thisInputElBCR.bottom + scrollheight > window.innerHeight;
                const directionOfStyle = this.isRtl ? 'right' : 'left';
                this.acDropdownEl.style.width = thisInputElBCR.width + 'px';
                this.acDropdownEl.style.position = 'absolute';
                this.acDropdownEl.style.zIndex = this.zIndex;
                this.acDropdownEl.style[directionOfStyle] = '0';
                this.acDropdownEl.style.display = 'inline-block';
                if (closeToBottom) {
                    this.acDropdownEl.style.bottom = `${thisInputElBCR.height}px`;
                }
                else {
                    this.acDropdownEl.style.top = `${thisInputElBCR.height}px`;
                }
            }
        };
        this.selectNewValue = (item) => {
            // make displayable value
            if (item && typeof item === 'object') {
                item = this.setToStringFunction(item);
            }
            this.renderValue(item);
            // make return value
            let val = item;
            if (this.selectValueOf && item[this.selectValueOf]) {
                val = item[this.selectValueOf];
            }
            if ((this.parentForm && this.formControlName) || this.extFormControl) {
                if (!!val) {
                    this.formControl.patchValue(val);
                }
            }
            if (val !== this.ngModel) {
                this.ngModelChange.emit(val);
            }
            this.valueChanged.emit(val);
            this.hideAutoCompleteDropdown();
            setTimeout(() => {
                if (this.reFocusAfterSelect) {
                    this.inputEl.focus();
                }
                return this.inputEl;
            });
        };
        this.selectCustomValue = (text) => {
            this.customSelected.emit(text);
            this.hideAutoCompleteDropdown();
            setTimeout(() => {
                if (this.reFocusAfterSelect) {
                    this.inputEl.focus();
                }
                return this.inputEl;
            });
        };
        this.enterNewText = (value) => {
            this.renderValue(value);
            this.ngModelChange.emit(value);
            this.valueChanged.emit(value);
            this.hideAutoCompleteDropdown();
        };
        this.keydownEventHandler = (evt) => {
            if (this.componentRef) {
                const component = this.componentRef.instance;
                component.inputElKeyHandler(evt);
            }
        };
        this.inputEventHandler = (evt) => {
            if (this.componentRef) {
                const component = this.componentRef.instance;
                component.dropdownVisible = true;
                component.keyword = evt.target.value;
                component.reloadListInDelay(evt);
            }
            else {
                this.showAutoCompleteDropdown();
            }
        };
        this.el = this.viewContainerRef.element.nativeElement;
    }
    ngOnInit() {
        // Blur event is handled only after a click event.
        // This is to prevent handling of blur events resulting from interacting with a scrollbar
        // introduced by content overflow (Internet explorer issue).
        // See issue description here: http://stackoverflow.com/questions/2023779/clicking-on-a-divs-scroll-bar-fires-the-blur-event-in-ie
        this.documentClickListener = (e) => {
            if (this.scheduledBlurHandler) {
                this.scheduledBlurHandler();
                this.scheduledBlurHandler = null;
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
    }
    ngAfterViewInit() {
        // if this element is not an input tag, move dropdown after input tag
        // so that it displays correctly
        this.inputEl = this.el.tagName === 'INPUT' ? this.el : this.el.querySelector('input');
        if (this.openOnFocus) {
            this.inputEl.addEventListener('focus', (e) => this.showAutoCompleteDropdown(e));
        }
        if (this.closeOnFocusOut) {
            this.inputEl.addEventListener('focusout', (e) => this.hideAutoCompleteDropdown(e));
        }
        if (!this.autocomplete) {
            this.inputEl.setAttribute('autocomplete', 'off');
        }
        this.inputEl.addEventListener('blur', (e) => {
            this.scheduledBlurHandler = () => {
                return this.blurHandler(e);
            };
        });
        this.inputEl.addEventListener('keydown', (e) => this.keydownEventHandler(e));
        this.inputEl.addEventListener('input', (e) => this.inputEventHandler(e));
    }
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.instance.valueSelected.unsubscribe();
            this.componentRef.instance.textEntered.unsubscribe();
        }
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
        }
    }
    ngOnChanges(changes) {
        if (changes['ngModel']) {
            this.ngModel = this.setToStringFunction(changes['ngModel'].currentValue);
            this.renderValue(this.ngModel);
        }
    }
    blurHandler(event) {
        if (this.componentRef) {
            const component = this.componentRef.instance;
            if (this.selectOnBlur) {
                component.selectOne(component.filteredList[component.itemIndex]);
            }
            if (this.closeOnFocusOut) {
                this.hideAutoCompleteDropdown(event);
            }
        }
    }
    setToStringFunction(item) {
        if (item && typeof item === 'object') {
            let displayVal;
            if (typeof this.valueFormatter === 'string') {
                const matches = this.valueFormatter.match(/[a-zA-Z0-9_\$]+/g);
                let formatted = this.valueFormatter;
                if (matches && typeof item !== 'string') {
                    matches.forEach((key) => {
                        formatted = formatted.replace(key, item[key]);
                    });
                }
                displayVal = formatted;
            }
            else if (typeof this.valueFormatter === 'function') {
                displayVal = this.valueFormatter(item);
            }
            else if (this.displayPropertyName) {
                displayVal = item[this.displayPropertyName];
            }
            else if (typeof this.listFormatter === 'string' && this.listFormatter.match(/^\w+$/)) {
                displayVal = item[this.listFormatter];
            }
            else {
                displayVal = item.value;
            }
            item.toString = () => displayVal;
        }
        return item;
    }
    renderValue(item) {
        if (!!this.inputEl) {
            this.inputEl.value = '' + item;
        }
    }
};
NguiAutoCompleteDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] }
];
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
export { NguiAutoCompleteDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd1aS9hdXRvLWNvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG8tY29tcGxldGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUFFLHdCQUF3QixFQUN2QyxZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFBRSxJQUFJLEVBQ2xCLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFBRSxRQUFRLEVBQ2hCLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUNsRCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFNdEUsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7SUFtRHBDLFlBQW9CLFFBQWtDLEVBQ2xDLGdCQUFrQyxFQUNGLFVBQTRCO1FBRjVELGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDRixlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQW5EbEQsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFNaEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFHeEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFM0IsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFJdkIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbEIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDcEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDaEIsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ2Ysb0JBQWUsR0FB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QXZCLEtBQUssQ0FBQyxlQUFlLENBQUM7OERBQTJCO0FBQ3RCO0lBQTNCLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztrRUFBK0I7QUFDMUI7SUFBL0IsS0FBSyxDQUFDLHVCQUF1QixDQUFDO3FFQUFrQztBQUNsQztJQUE5QixLQUFLLENBQUMsc0JBQXNCLENBQUM7cUVBQWtDO0FBQ3ZDO0lBQXhCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztnRUFBNkI7QUFDOUI7SUFBdEIsS0FBSyxDQUFDLGNBQWMsQ0FBQzs4REFBOEI7QUFFM0M7SUFBUixLQUFLLEVBQUU7MERBQXdCO0FBQ047SUFBekIsS0FBSyxDQUFDLGlCQUFpQixDQUFDO2tFQUFnQztBQUduQztJQUFyQixLQUFLLENBQUMsYUFBYSxDQUFDO2lFQUFvQztBQUN2QztJQUFqQixLQUFLLENBQUMsU0FBUyxDQUFDO3lEQUFxQjtBQUNyQjtJQUFoQixLQUFLLENBQUMsUUFBUSxDQUFDO3dEQUFzQjtBQUU1QjtJQUFULE1BQU0sRUFBRTtnRUFBMkM7QUFDMUM7SUFBVCxNQUFNLEVBQUU7K0RBQTBDO0FBQ3pDO0lBQVQsTUFBTSxFQUFFO2lFQUE0QztBQXRDMUMseUJBQXlCO0lBSnJDLFNBQVMsQ0FBQztRQUNULDhDQUE4QztRQUM5QyxRQUFRLEVBQUUsdUNBQXVDO0tBQ2xELENBQUM7SUFzRGEsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsSUFBSSxFQUFFLENBQUEsRUFBRSxXQUFBLFFBQVEsRUFBRSxDQUFBO0dBckRoQyx5QkFBeUIsQ0FnWHJDO1NBaFhZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29tcG9uZW50UmVmLFxuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlciwgSG9zdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsIE9wdGlvbmFsLFxuICBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIFNraXBTZWxmLCBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBDb250cm9sQ29udGFpbmVyLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBGb3JtR3JvdXBOYW1lIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZUNvbXBvbmVudCB9IGZyb20gJy4vYXV0by1jb21wbGV0ZS5jb21wb25lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ1thdXRvLWNvbXBsZXRlXSwgW25ndWktYXV0by1jb21wbGV0ZV0nXG59KVxuZXhwb3J0IGNsYXNzIE5ndWlBdXRvQ29tcGxldGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoJ2F1dG9jb21wbGV0ZScpIHB1YmxpYyBhdXRvY29tcGxldGUgPSBmYWxzZTtcbiAgQElucHV0KCdhdXRvLWNvbXBsZXRlLXBsYWNlaG9sZGVyJykgcHVibGljIGF1dG9Db21wbGV0ZVBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIEBJbnB1dCgnc291cmNlJykgcHVibGljIHNvdXJjZTogYW55O1xuICBASW5wdXQoJ3BhdGgtdG8tZGF0YScpIHB1YmxpYyBwYXRoVG9EYXRhOiBzdHJpbmc7XG4gIEBJbnB1dCgnbWluLWNoYXJzJykgcHVibGljIG1pbkNoYXJzOiBudW1iZXI7XG4gIEBJbnB1dCgnZGlzcGxheS1wcm9wZXJ0eS1uYW1lJykgcHVibGljIGRpc3BsYXlQcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgQElucHV0KCdhY2NlcHQtdXNlci1pbnB1dCcpIHB1YmxpYyBhY2NlcHRVc2VySW5wdXQgPSB0cnVlO1xuICBASW5wdXQoJ21heC1udW0tbGlzdCcpIHB1YmxpYyBtYXhOdW1MaXN0OiBzdHJpbmc7XG4gIEBJbnB1dCgnc2VsZWN0LXZhbHVlLW9mJykgcHVibGljIHNlbGVjdFZhbHVlT2Y6IHN0cmluZztcbiAgQElucHV0KCdsb2FkaW5nLXRlbXBsYXRlJykgcHVibGljIGxvYWRpbmdUZW1wbGF0ZSA9IG51bGw7XG4gIEBJbnB1dCgnbGlzdC1mb3JtYXR0ZXInKSBwdWJsaWMgbGlzdEZvcm1hdHRlcjtcbiAgQElucHV0KCdsb2FkaW5nLXRleHQnKSBwdWJsaWMgbG9hZGluZ1RleHQgPSAnTG9hZGluZyc7XG4gIEBJbnB1dCgnYmxhbmstb3B0aW9uLXRleHQnKSBwdWJsaWMgYmxhbmtPcHRpb25UZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgnbm8tbWF0Y2gtZm91bmQtdGV4dCcpIHB1YmxpYyBub01hdGNoRm91bmRUZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgndmFsdWUtZm9ybWF0dGVyJykgcHVibGljIHZhbHVlRm9ybWF0dGVyOiBhbnk7XG4gIEBJbnB1dCgndGFiLXRvLXNlbGVjdCcpIHB1YmxpYyB0YWJUb1NlbGVjdCA9IHRydWU7XG4gIEBJbnB1dCgnc2VsZWN0LW9uLWJsdXInKSBwdWJsaWMgc2VsZWN0T25CbHVyID0gZmFsc2U7XG4gIEBJbnB1dCgnbWF0Y2gtZm9ybWF0dGVkJykgcHVibGljIG1hdGNoRm9ybWF0dGVkID0gZmFsc2U7XG4gIEBJbnB1dCgnYXV0by1zZWxlY3QtZmlyc3QtaXRlbScpIHB1YmxpYyBhdXRvU2VsZWN0Rmlyc3RJdGVtID0gZmFsc2U7XG4gIEBJbnB1dCgnb3Blbi1vbi1mb2N1cycpIHB1YmxpYyBvcGVuT25Gb2N1cyA9IHRydWU7XG4gIEBJbnB1dCgnY2xvc2Utb24tZm9jdXNvdXQnKSBwdWJsaWMgY2xvc2VPbkZvY3VzT3V0ID0gdHJ1ZTtcbiAgQElucHV0KCdyZS1mb2N1cy1hZnRlci1zZWxlY3QnKSBwdWJsaWMgcmVGb2N1c0FmdGVyU2VsZWN0ID0gdHJ1ZTtcbiAgQElucHV0KCdoZWFkZXItaXRlbS10ZW1wbGF0ZScpIHB1YmxpYyBoZWFkZXJJdGVtVGVtcGxhdGUgPSBudWxsO1xuICBASW5wdXQoJ2lnbm9yZS1hY2NlbnRzJykgcHVibGljIGlnbm9yZUFjY2VudHMgPSB0cnVlO1xuICBASW5wdXQoXCJuby1maWx0ZXJpbmdcIikgbm9GaWx0ZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKSBwdWJsaWMgbmdNb2RlbDogc3RyaW5nO1xuICBASW5wdXQoJ2Zvcm1Db250cm9sTmFtZScpIHB1YmxpYyBmb3JtQ29udHJvbE5hbWU6IHN0cmluZztcbiAgLy8gaWYgW2Zvcm1Db250cm9sXSBpcyB1c2VkIG9uIHRoZSBhbmNob3Igd2hlcmUgb3VyIGRpcmVjdGl2ZSBpcyBzaXR0aW5nXG4gIC8vIGEgZm9ybSBpcyBub3QgbmVjZXNzYXJ5IHRvIHVzZSBhIGZvcm1Db250cm9sIHdlIHNob3VsZCBhbHNvIHN1cHBvcnQgdGhpc1xuICBASW5wdXQoJ2Zvcm1Db250cm9sJykgcHVibGljIGV4dEZvcm1Db250cm9sOiBGb3JtQ29udHJvbDtcbiAgQElucHV0KCd6LWluZGV4JykgcHVibGljIHpJbmRleCA9ICcxJztcbiAgQElucHV0KCdpcy1ydGwnKSBwdWJsaWMgaXNSdGwgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgcHVibGljIG5nTW9kZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgdmFsdWVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIGN1c3RvbVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8Tmd1aUF1dG9Db21wbGV0ZUNvbXBvbmVudD47XG4gIHByaXZhdGUgd3JhcHBlckVsOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBlbDogSFRNTEVsZW1lbnQ7ICAgLy8gdGhpcyBlbGVtZW50IGVsZW1lbnQsIGNhbiBiZSBhbnlcbiAgcHJpdmF0ZSBhY0Ryb3Bkb3duRWw6IEhUTUxFbGVtZW50OyAvLyBhdXRvIGNvbXBsZXRlIGVsZW1lbnRcbiAgcHJpdmF0ZSBpbnB1dEVsOiBIVE1MSW5wdXRFbGVtZW50OyAgLy8gaW5wdXQgZWxlbWVudCBvZiB0aGlzIGVsZW1lbnRcbiAgcHJpdmF0ZSBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBwcml2YXRlIHJldmVydFZhbHVlOiBhbnk7XG4gIHByaXZhdGUgZHJvcGRvd25KdXN0SGlkZGVuOiBib29sZWFuO1xuICBwcml2YXRlIHNjaGVkdWxlZEJsdXJIYW5kbGVyOiBhbnk7XG4gIHByaXZhdGUgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiAoZTogTW91c2VFdmVudCkgPT4gYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgICAgICAgcHVibGljICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHByaXZhdGUgcGFyZW50Rm9ybTogQ29udHJvbENvbnRhaW5lcikge1xuICAgIHRoaXMuZWwgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gQmx1ciBldmVudCBpcyBoYW5kbGVkIG9ubHkgYWZ0ZXIgYSBjbGljayBldmVudC5cbiAgICAvLyBUaGlzIGlzIHRvIHByZXZlbnQgaGFuZGxpbmcgb2YgYmx1ciBldmVudHMgcmVzdWx0aW5nIGZyb20gaW50ZXJhY3Rpbmcgd2l0aCBhIHNjcm9sbGJhclxuICAgIC8vIGludHJvZHVjZWQgYnkgY29udGVudCBvdmVyZmxvdyAoSW50ZXJuZXQgZXhwbG9yZXIgaXNzdWUpLlxuICAgIC8vIFNlZSBpc3N1ZSBkZXNjcmlwdGlvbiBoZXJlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwMjM3NzkvY2xpY2tpbmctb24tYS1kaXZzLXNjcm9sbC1iYXItZmlyZXMtdGhlLWJsdXItZXZlbnQtaW4taWVcbiAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5zY2hlZHVsZWRCbHVySGFuZGxlcikge1xuICAgICAgICB0aGlzLnNjaGVkdWxlZEJsdXJIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQmx1ckhhbmRsZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKTtcbiAgICAvLyB3cmFwIHRoaXMgZWxlbWVudCB3aXRoIDxkaXYgY2xhc3M9XCJuZ3VpLWF1dG8tY29tcGxldGVcIj5cbiAgICB0aGlzLndyYXBwZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMud3JhcHBlckVsLmNsYXNzTmFtZSA9ICduZ3VpLWF1dG8tY29tcGxldGUtd3JhcHBlcic7XG4gICAgdGhpcy53cmFwcGVyRWwuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIHRoaXMuZWwucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy53cmFwcGVyRWwsIHRoaXMuZWwubmV4dFNpYmxpbmcpO1xuICAgIHRoaXMud3JhcHBlckVsLmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuXG4gICAgLy8gQ2hlY2sgaWYgd2Ugd2VyZSBzdXBwbGllZCB3aXRoIGEgW2Zvcm1Db250cm9sTmFtZV0gYW5kIGl0IGlzIGluc2lkZSBhIFtmb3JtXVxuICAgIC8vIGVsc2UgY2hlY2sgaWYgd2UgYXJlIHN1cHBsaWVkIHdpdGggYSBbRm9ybUNvbnRyb2xdIHJlZ2FyZGxlc3MgaWYgaXQgaXMgaW5zaWRlIGEgW2Zvcm1dIHRhZ1xuICAgIGlmICh0aGlzLnBhcmVudEZvcm0gJiYgdGhpcy5mb3JtQ29udHJvbE5hbWUpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudEZvcm1bJ2Zvcm0nXSkge1xuICAgICAgICB0aGlzLmZvcm1Db250cm9sID0gKHRoaXMucGFyZW50Rm9ybVsnZm9ybSddIGFzIEZvcm1Hcm91cCkuZ2V0KHRoaXMuZm9ybUNvbnRyb2xOYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnRGb3JtIGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkge1xuICAgICAgICB0aGlzLmZvcm1Db250cm9sID0gKHRoaXMucGFyZW50Rm9ybSBhcyBGb3JtR3JvdXBOYW1lKS5jb250cm9sLmNvbnRyb2xzW3RoaXMuZm9ybUNvbnRyb2xOYW1lXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZXh0Rm9ybUNvbnRyb2wpIHtcbiAgICAgIHRoaXMuZm9ybUNvbnRyb2wgPSB0aGlzLmV4dEZvcm1Db250cm9sO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IHRvU3RyaW5nKCkgbWV0aG9kIGZvciB0aGUgb2JqZWN0XG4gICAgaWYgKCEhdGhpcy5uZ01vZGVsKSB7XG4gICAgICB0aGlzLnNlbGVjdE5ld1ZhbHVlKHRoaXMubmdNb2RlbCk7XG4gICAgfSBlbHNlIGlmICghIXRoaXMuZm9ybUNvbnRyb2wgJiYgdGhpcy5mb3JtQ29udHJvbC52YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3ROZXdWYWx1ZSh0aGlzLmZvcm1Db250cm9sLnZhbHVlKTtcbiAgICB9XG5cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBpZiB0aGlzIGVsZW1lbnQgaXMgbm90IGFuIGlucHV0IHRhZywgbW92ZSBkcm9wZG93biBhZnRlciBpbnB1dCB0YWdcbiAgICAvLyBzbyB0aGF0IGl0IGRpc3BsYXlzIGNvcnJlY3RseVxuICAgIHRoaXMuaW5wdXRFbCA9IHRoaXMuZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyA/IHRoaXMuZWwgYXMgSFRNTElucHV0RWxlbWVudCA6IHRoaXMuZWwucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcblxuICAgIGlmICh0aGlzLm9wZW5PbkZvY3VzKSB7XG4gICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoZSkgPT4gdGhpcy5zaG93QXV0b0NvbXBsZXRlRHJvcGRvd24oZSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNsb3NlT25Gb2N1c091dCkge1xuICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgKGUpID0+IHRoaXMuaGlkZUF1dG9Db21wbGV0ZURyb3Bkb3duKGUpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICB0aGlzLmlucHV0RWwuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XG4gICAgfVxuICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGUpID0+IHtcbiAgICAgIHRoaXMuc2NoZWR1bGVkQmx1ckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsdXJIYW5kbGVyKGUpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB0aGlzLmtleWRvd25FdmVudEhhbmRsZXIoZSkpO1xuICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB0aGlzLmlucHV0RXZlbnRIYW5kbGVyKGUpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudmFsdWVTZWxlY3RlZC51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudGV4dEVudGVyZWQudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ25nTW9kZWwnXSkge1xuICAgICAgdGhpcy5uZ01vZGVsID0gdGhpcy5zZXRUb1N0cmluZ0Z1bmN0aW9uKGNoYW5nZXNbJ25nTW9kZWwnXS5jdXJyZW50VmFsdWUpO1xuICAgICAgdGhpcy5yZW5kZXJWYWx1ZSh0aGlzLm5nTW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNob3cgYXV0by1jb21wbGV0ZSBsaXN0IGJlbG93IHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgcHVibGljIHNob3dBdXRvQ29tcGxldGVEcm9wZG93biA9IChldmVudD86IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLmRyb3Bkb3duSnVzdEhpZGRlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGVEcm9wZG93bigpO1xuICAgIHRoaXMuc2NoZWR1bGVkQmx1ckhhbmRsZXIgPSBudWxsO1xuXG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTmd1aUF1dG9Db21wbGV0ZUNvbXBvbmVudCk7XG5cbiAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICBjb21wb25lbnQua2V5d29yZCA9IHRoaXMuaW5wdXRFbC52YWx1ZTtcbiAgICBjb21wb25lbnQuc2hvd0lucHV0VGFnID0gZmFsc2U7IC8vIERvIE5PVCBkaXNwbGF5IGF1dG9jb21wbGV0ZSBpbnB1dCB0YWcgc2VwYXJhdGVseVxuXG4gICAgY29tcG9uZW50LnBhdGhUb0RhdGEgPSB0aGlzLnBhdGhUb0RhdGE7XG4gICAgY29tcG9uZW50Lm1pbkNoYXJzID0gdGhpcy5taW5DaGFycztcbiAgICBjb21wb25lbnQuc291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgY29tcG9uZW50LnBsYWNlaG9sZGVyID0gdGhpcy5hdXRvQ29tcGxldGVQbGFjZWhvbGRlcjtcbiAgICBjb21wb25lbnQuYWNjZXB0VXNlcklucHV0ID0gdGhpcy5hY2NlcHRVc2VySW5wdXQ7XG4gICAgY29tcG9uZW50Lm1heE51bUxpc3QgPSBwYXJzZUludCh0aGlzLm1heE51bUxpc3QsIDEwKTtcblxuICAgIGNvbXBvbmVudC5sb2FkaW5nVGV4dCA9IHRoaXMubG9hZGluZ1RleHQ7XG4gICAgY29tcG9uZW50LmxvYWRpbmdUZW1wbGF0ZSA9IHRoaXMubG9hZGluZ1RlbXBsYXRlO1xuICAgIGNvbXBvbmVudC5saXN0Rm9ybWF0dGVyID0gdGhpcy5saXN0Rm9ybWF0dGVyO1xuICAgIGNvbXBvbmVudC5ibGFua09wdGlvblRleHQgPSB0aGlzLmJsYW5rT3B0aW9uVGV4dDtcbiAgICBjb21wb25lbnQubm9NYXRjaEZvdW5kVGV4dCA9IHRoaXMubm9NYXRjaEZvdW5kVGV4dDtcbiAgICBjb21wb25lbnQudGFiVG9TZWxlY3QgPSB0aGlzLnRhYlRvU2VsZWN0O1xuICAgIGNvbXBvbmVudC5zZWxlY3RPbkJsdXIgPSB0aGlzLnNlbGVjdE9uQmx1cjtcbiAgICBjb21wb25lbnQubWF0Y2hGb3JtYXR0ZWQgPSB0aGlzLm1hdGNoRm9ybWF0dGVkO1xuICAgIGNvbXBvbmVudC5hdXRvU2VsZWN0Rmlyc3RJdGVtID0gdGhpcy5hdXRvU2VsZWN0Rmlyc3RJdGVtO1xuICAgIGNvbXBvbmVudC5oZWFkZXJJdGVtVGVtcGxhdGUgPSB0aGlzLmhlYWRlckl0ZW1UZW1wbGF0ZTtcbiAgICBjb21wb25lbnQuaWdub3JlQWNjZW50cyA9IHRoaXMuaWdub3JlQWNjZW50cztcbiAgICBjb21wb25lbnQubm9GaWx0ZXJpbmcgPSB0aGlzLm5vRmlsdGVyaW5nO1xuXG4gICAgY29tcG9uZW50LnZhbHVlU2VsZWN0ZWQuc3Vic2NyaWJlKHRoaXMuc2VsZWN0TmV3VmFsdWUpO1xuICAgIGNvbXBvbmVudC50ZXh0RW50ZXJlZC5zdWJzY3JpYmUodGhpcy5lbnRlck5ld1RleHQpO1xuICAgIGNvbXBvbmVudC5jdXN0b21TZWxlY3RlZC5zdWJzY3JpYmUodGhpcy5zZWxlY3RDdXN0b21WYWx1ZSk7XG5cbiAgICB0aGlzLmFjRHJvcGRvd25FbCA9IHRoaXMuY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIC8vIGlmIHRoaXMgZWxlbWVudCBpcyBub3QgYW4gaW5wdXQgdGFnLCBtb3ZlIGRyb3Bkb3duIGFmdGVyIGlucHV0IHRhZ1xuICAgIC8vIHNvIHRoYXQgaXQgZGlzcGxheXMgY29ycmVjdGx5XG5cbiAgICAvLyBUT0RPOiBjb25maXJtIHdpdGggb3duZXJzXG4gICAgLy8gd2l0aCBzb21lIHJlYXNvbiwgdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQgaXMgY3JlYXRpbmcgZWxlbWVudFxuICAgIC8vIHRvIHBhcmVudCBkaXYgd2hpY2ggaXMgY3JlYXRlZCBieSB1cyBvbiBuZ09uSW5pdCwgcGxlYXNlIHRyeSB0aGlzIHdpdGggZGVtb1xuXG4gICAgLy8gaWYgKHRoaXMuZWwudGFnTmFtZSAhPT0gJ0lOUFVUJyAmJiB0aGlzLmFjRHJvcGRvd25FbCkge1xuICAgIHRoaXMuaW5wdXRFbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLmFjRHJvcGRvd25FbCwgdGhpcy5pbnB1dEVsLm5leHRTaWJsaW5nKTtcbiAgICAvLyB9XG4gICAgdGhpcy5yZXZlcnRWYWx1ZSA9IHR5cGVvZiB0aGlzLm5nTW9kZWwgIT09ICd1bmRlZmluZWQnID8gdGhpcy5uZ01vZGVsIDogdGhpcy5pbnB1dEVsLnZhbHVlO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb21wb25lbnQucmVsb2FkTGlzdCh0aGlzLmlucHV0RWwudmFsdWUpO1xuICAgICAgdGhpcy5zdHlsZUF1dG9Db21wbGV0ZURyb3Bkb3duKCk7XG4gICAgICBjb21wb25lbnQuZHJvcGRvd25WaXNpYmxlID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBibHVySGFuZGxlcihldmVudDogYW55KSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0T25CbHVyKSB7XG4gICAgICAgIGNvbXBvbmVudC5zZWxlY3RPbmUoY29tcG9uZW50LmZpbHRlcmVkTGlzdFtjb21wb25lbnQuaXRlbUluZGV4XSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNsb3NlT25Gb2N1c091dCkge1xuICAgICAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGVEcm9wZG93bihldmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhpZGVBdXRvQ29tcGxldGVEcm9wZG93biA9IChldmVudD86IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgbGV0IGN1cnJlbnRJdGVtOiBhbnk7XG4gICAgICBjb25zdCBoYXNSZXZlcnRWYWx1ZSA9ICh0eXBlb2YgdGhpcy5yZXZlcnRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpO1xuICAgICAgaWYgKHRoaXMuaW5wdXRFbCAmJiBoYXNSZXZlcnRWYWx1ZSAmJiB0aGlzLmFjY2VwdFVzZXJJbnB1dCA9PT0gZmFsc2UpIHtcbiAgICAgICAgY3VycmVudEl0ZW0gPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5maW5kSXRlbUZyb21TZWxlY3RWYWx1ZSh0aGlzLmlucHV0RWwudmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb21wb25lbnRSZWYuZGVzdHJveSgpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh0aGlzLmlucHV0RWwgJiYgaGFzUmV2ZXJ0VmFsdWUgJiYgdGhpcy5hY2NlcHRVc2VySW5wdXQgPT09IGZhbHNlICYmIGN1cnJlbnRJdGVtID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0TmV3VmFsdWUodGhpcy5yZXZlcnRWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRFbCAmJiB0aGlzLmFjY2VwdFVzZXJJbnB1dCA9PT0gdHJ1ZSAmJiB0eXBlb2YgY3VycmVudEl0ZW0gPT09ICd1bmRlZmluZWQnICYmIGV2ZW50ICYmIGV2ZW50LnRhcmdldC52YWx1ZSkge1xuICAgICAgICB0aGlzLmVudGVyTmV3VGV4dChldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRyb3Bkb3duSnVzdEhpZGRlbiA9IHRydWU7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmRyb3Bkb3duSnVzdEhpZGRlbiA9IGZhbHNlLCAxMDApO1xuICB9XG5cbiAgcHVibGljIHN0eWxlQXV0b0NvbXBsZXRlRHJvcGRvd24gPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcblxuICAgICAgbGV0IHNjcm9sbGhlaWdodCA9IDA7XG4gICAgICBpZiAodGhpcy5zb3VyY2UgJiYgdGhpcy5zb3VyY2UubGVuZ3RoID4gMCkge1xuICAgICAgICBzY3JvbGxoZWlnaHQgPSB0aGlzLnNvdXJjZS5sZW5ndGggKiAyNDsgIC8vIOODl+ODq+ODgOOCpuODs+OBrm9wdGlvbjHjgaTjga5oZWlnaHTjgYwyNHB4XG4gICAgICAgIHNjcm9sbGhlaWdodCA9IHNjcm9sbGhlaWdodCA+IDMwMCA/IDMwMCA6IHNjcm9sbGhlaWdodDsgIC8vIDMwMOS7peS4iuOBrzMwMOOBq+OBmeOCi1xuICAgICAgfVxuICAgICAgc2Nyb2xsaGVpZ2h0ICs9IDUwOyAgLy8g44OV44OD44K/44O844GM44GC44KL44GL44KC44GX44KM44Gq44GE44Gu44Gn44CB44OV44OD44K/44O85YiG44Gu44Kq44OV44K744OD44OI44KS5Yqg5ZGz44GZ44KLXG5cbiAgICAgIC8qIHNldHRpbmcgd2lkdGgvaGVpZ2h0IGF1dG8gY29tcGxldGUgKi9cbiAgICAgIGNvbnN0IHRoaXNFbEJDUiA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB0aGlzSW5wdXRFbEJDUiA9IHRoaXMuaW5wdXRFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IGNsb3NlVG9Cb3R0b20gPSB0aGlzSW5wdXRFbEJDUi5ib3R0b20gKyBzY3JvbGxoZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBjb25zdCBkaXJlY3Rpb25PZlN0eWxlID0gdGhpcy5pc1J0bCA/ICdyaWdodCcgOiAnbGVmdCc7XG5cbiAgICAgIHRoaXMuYWNEcm9wZG93bkVsLnN0eWxlLndpZHRoID0gdGhpc0lucHV0RWxCQ1Iud2lkdGggKyAncHgnO1xuICAgICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUuekluZGV4ID0gdGhpcy56SW5kZXg7XG4gICAgICB0aGlzLmFjRHJvcGRvd25FbC5zdHlsZVtkaXJlY3Rpb25PZlN0eWxlXSA9ICcwJztcbiAgICAgIHRoaXMuYWNEcm9wZG93bkVsLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcblxuICAgICAgaWYgKGNsb3NlVG9Cb3R0b20pIHtcbiAgICAgICAgdGhpcy5hY0Ryb3Bkb3duRWwuc3R5bGUuYm90dG9tID0gYCR7dGhpc0lucHV0RWxCQ1IuaGVpZ2h0fXB4YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWNEcm9wZG93bkVsLnN0eWxlLnRvcCA9IGAke3RoaXNJbnB1dEVsQkNSLmhlaWdodH1weGA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldFRvU3RyaW5nRnVuY3Rpb24oaXRlbTogYW55KTogYW55IHtcbiAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxldCBkaXNwbGF5VmFsO1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVGb3JtYXR0ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLnZhbHVlRm9ybWF0dGVyLm1hdGNoKC9bYS16QS1aMC05X1xcJF0rL2cpO1xuICAgICAgICBsZXQgZm9ybWF0dGVkID0gdGhpcy52YWx1ZUZvcm1hdHRlcjtcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgdHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5yZXBsYWNlKGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5VmFsID0gZm9ybWF0dGVkO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy52YWx1ZUZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkaXNwbGF5VmFsID0gdGhpcy52YWx1ZUZvcm1hdHRlcihpdGVtKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5kaXNwbGF5UHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGRpc3BsYXlWYWwgPSBpdGVtW3RoaXMuZGlzcGxheVByb3BlcnR5TmFtZV07XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmxpc3RGb3JtYXR0ZXIgPT09ICdzdHJpbmcnICYmIHRoaXMubGlzdEZvcm1hdHRlci5tYXRjaCgvXlxcdyskLykpIHtcbiAgICAgICAgZGlzcGxheVZhbCA9IGl0ZW1bdGhpcy5saXN0Rm9ybWF0dGVyXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXlWYWwgPSBpdGVtLnZhbHVlO1xuICAgICAgfVxuICAgICAgaXRlbS50b1N0cmluZyA9ICgpID0+IGRpc3BsYXlWYWw7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdE5ld1ZhbHVlID0gKGl0ZW06IGFueSkgPT4ge1xuICAgIC8vIG1ha2UgZGlzcGxheWFibGUgdmFsdWVcbiAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGl0ZW0gPSB0aGlzLnNldFRvU3RyaW5nRnVuY3Rpb24oaXRlbSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJWYWx1ZShpdGVtKTtcblxuICAgIC8vIG1ha2UgcmV0dXJuIHZhbHVlXG4gICAgbGV0IHZhbCA9IGl0ZW07XG4gICAgaWYgKHRoaXMuc2VsZWN0VmFsdWVPZiAmJiBpdGVtW3RoaXMuc2VsZWN0VmFsdWVPZl0pIHtcbiAgICAgIHZhbCA9IGl0ZW1bdGhpcy5zZWxlY3RWYWx1ZU9mXTtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnBhcmVudEZvcm0gJiYgdGhpcy5mb3JtQ29udHJvbE5hbWUpIHx8IHRoaXMuZXh0Rm9ybUNvbnRyb2wpIHtcbiAgICAgIGlmICghIXZhbCkge1xuICAgICAgICB0aGlzLmZvcm1Db250cm9sLnBhdGNoVmFsdWUodmFsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhbCAhPT0gdGhpcy5uZ01vZGVsKSB7XG4gICAgICB0aGlzLm5nTW9kZWxDaGFuZ2UuZW1pdCh2YWwpO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KHZhbCk7XG4gICAgdGhpcy5oaWRlQXV0b0NvbXBsZXRlRHJvcGRvd24oKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnJlRm9jdXNBZnRlclNlbGVjdCkge1xuICAgICAgICB0aGlzLmlucHV0RWwuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXRFbDtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RDdXN0b21WYWx1ZSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLmN1c3RvbVNlbGVjdGVkLmVtaXQodGV4dCk7XG4gICAgdGhpcy5oaWRlQXV0b0NvbXBsZXRlRHJvcGRvd24oKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnJlRm9jdXNBZnRlclNlbGVjdCkge1xuICAgICAgICB0aGlzLmlucHV0RWwuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXRFbDtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbnRlck5ld1RleHQgPSAodmFsdWU6IGFueSkgPT4ge1xuICAgIHRoaXMucmVuZGVyVmFsdWUodmFsdWUpO1xuICAgIHRoaXMubmdNb2RlbENoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KHZhbHVlKTtcbiAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGVEcm9wZG93bigpO1xuICB9XG5cbiAgcHJpdmF0ZSBrZXlkb3duRXZlbnRIYW5kbGVyID0gKGV2dDogYW55KSA9PiB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICAgIGNvbXBvbmVudC5pbnB1dEVsS2V5SGFuZGxlcihldnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5wdXRFdmVudEhhbmRsZXIgPSAoZXZ0OiBhbnkpID0+IHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgY29tcG9uZW50LmRyb3Bkb3duVmlzaWJsZSA9IHRydWU7XG4gICAgICBjb21wb25lbnQua2V5d29yZCA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgICBjb21wb25lbnQucmVsb2FkTGlzdEluRGVsYXkoZXZ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93QXV0b0NvbXBsZXRlRHJvcGRvd24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclZhbHVlKGl0ZW06IGFueSkge1xuICAgIGlmICghIXRoaXMuaW5wdXRFbCkge1xuICAgICAgdGhpcy5pbnB1dEVsLnZhbHVlID0gJycgKyBpdGVtO1xuICAgIH1cbiAgfVxufVxuIl19