(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs/operators'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@ngui/auto-complete', ['exports', '@angular/core', '@angular/common/http', 'rxjs/operators', '@angular/forms', '@angular/common'], factory) :
    (global = global || self, factory((global.ngui = global.ngui || {}, global.ngui['auto-complete'] = {}), global.ng.core, global.ng.common.http, global.rxjs.operators, global.ng.forms, global.ng.common));
}(this, (function (exports, core, http, operators, forms, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var NguiAutoComplete = /** @class */ (function () {
        function NguiAutoComplete(http) {
            this.http = http;
            // ...
        }
        NguiAutoComplete.prototype.filter = function (list, keyword, matchFormatted, accentInsensitive, noFiltering) {
            var _this = this;
            if (noFiltering) {
                return list;
            }
            return accentInsensitive
                ? list.filter(function (el) {
                    var objStr = matchFormatted ? _this.getFormattedListItem(el).toLowerCase() : JSON.stringify(el).toLowerCase();
                    keyword = keyword.toLowerCase();
                    return objStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .indexOf(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
                })
                : list.filter(function (el) {
                    var objStr = matchFormatted ? _this.getFormattedListItem(el).toLowerCase() : JSON.stringify(el).toLowerCase();
                    keyword = keyword.toLowerCase();
                    return objStr.indexOf(keyword) !== -1;
                });
        };
        NguiAutoComplete.prototype.getFormattedListItem = function (data) {
            var formatted;
            var formatter = this.listFormatter || '(id) value';
            if (typeof formatter === 'function') {
                formatted = formatter.apply(this, [data]);
            }
            else if (typeof data !== 'object') {
                formatted = data;
            }
            else if (typeof formatter === 'string') {
                formatted = formatter;
                var matches = formatter.match(/[a-zA-Z0-9_\$]+/g);
                if (matches && typeof data !== 'string') {
                    matches.forEach(function (key) {
                        formatted = formatted.replace(key, data[key]);
                    });
                }
            }
            return formatted;
        };
        /**
         * return remote data from the given source and options, and data path
         */
        NguiAutoComplete.prototype.getRemoteData = function (keyword) {
            var _this = this;
            if (typeof this.source !== 'string') {
                throw new TypeError('Invalid type of source, must be a string. e.g. http://www.google.com?q=:my_keyword');
            }
            else if (!this.http) {
                throw new Error('Http is required.');
            }
            var matches = this.source.match(/:[a-zA-Z_]+/);
            if (matches === null) {
                throw new Error('Replacement word is missing.');
            }
            var replacementWord = matches[0];
            var url = this.source.replace(replacementWord, keyword);
            return this.http.get(url)
                .pipe(operators.map(function (list) {
                if (_this.pathToData) {
                    var paths = _this.pathToData.split('.');
                    paths.forEach(function (prop) { return list = list[prop]; });
                }
                return list;
            }));
        };
        NguiAutoComplete.ctorParameters = function () { return [
            { type: http.HttpClient, decorators: [{ type: core.Optional }] }
        ]; };
        NguiAutoComplete.ɵprov = core["ɵɵdefineInjectable"]({ factory: function NguiAutoComplete_Factory() { return new NguiAutoComplete(core["ɵɵinject"](http.HttpClient, 8)); }, token: NguiAutoComplete, providedIn: "root" });
        NguiAutoComplete = __decorate([
            core.Injectable({
                providedIn: 'root'
            }),
            __param(0, core.Optional())
        ], NguiAutoComplete);
        return NguiAutoComplete;
    }());

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
            this.valueSelected = new core.EventEmitter();
            this.customSelected = new core.EventEmitter();
            this.textEntered = new core.EventEmitter();
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
            { type: core.ElementRef },
            { type: NguiAutoComplete }
        ]; };
        __decorate([
            core.Input('autocomplete')
        ], NguiAutoCompleteComponent.prototype, "autocomplete", void 0);
        __decorate([
            core.Input('list-formatter')
        ], NguiAutoCompleteComponent.prototype, "listFormatter", void 0);
        __decorate([
            core.Input('source')
        ], NguiAutoCompleteComponent.prototype, "source", void 0);
        __decorate([
            core.Input('path-to-data')
        ], NguiAutoCompleteComponent.prototype, "pathToData", void 0);
        __decorate([
            core.Input('min-chars')
        ], NguiAutoCompleteComponent.prototype, "minChars", void 0);
        __decorate([
            core.Input('placeholder')
        ], NguiAutoCompleteComponent.prototype, "placeholder", void 0);
        __decorate([
            core.Input('blank-option-text')
        ], NguiAutoCompleteComponent.prototype, "blankOptionText", void 0);
        __decorate([
            core.Input('no-match-found-text')
        ], NguiAutoCompleteComponent.prototype, "noMatchFoundText", void 0);
        __decorate([
            core.Input('accept-user-input')
        ], NguiAutoCompleteComponent.prototype, "acceptUserInput", void 0);
        __decorate([
            core.Input('loading-text')
        ], NguiAutoCompleteComponent.prototype, "loadingText", void 0);
        __decorate([
            core.Input('loading-template')
        ], NguiAutoCompleteComponent.prototype, "loadingTemplate", void 0);
        __decorate([
            core.Input('max-num-list')
        ], NguiAutoCompleteComponent.prototype, "maxNumList", void 0);
        __decorate([
            core.Input('show-input-tag')
        ], NguiAutoCompleteComponent.prototype, "showInputTag", void 0);
        __decorate([
            core.Input('show-dropdown-on-init')
        ], NguiAutoCompleteComponent.prototype, "showDropdownOnInit", void 0);
        __decorate([
            core.Input('tab-to-select')
        ], NguiAutoCompleteComponent.prototype, "tabToSelect", void 0);
        __decorate([
            core.Input('match-formatted')
        ], NguiAutoCompleteComponent.prototype, "matchFormatted", void 0);
        __decorate([
            core.Input('auto-select-first-item')
        ], NguiAutoCompleteComponent.prototype, "autoSelectFirstItem", void 0);
        __decorate([
            core.Input('select-on-blur')
        ], NguiAutoCompleteComponent.prototype, "selectOnBlur", void 0);
        __decorate([
            core.Input('re-focus-after-select')
        ], NguiAutoCompleteComponent.prototype, "reFocusAfterSelect", void 0);
        __decorate([
            core.Input('header-item-template')
        ], NguiAutoCompleteComponent.prototype, "headerItemTemplate", void 0);
        __decorate([
            core.Input('ignore-accents')
        ], NguiAutoCompleteComponent.prototype, "ignoreAccents", void 0);
        __decorate([
            core.Input("no-filtering")
        ], NguiAutoCompleteComponent.prototype, "noFiltering", void 0);
        __decorate([
            core.Output()
        ], NguiAutoCompleteComponent.prototype, "valueSelected", void 0);
        __decorate([
            core.Output()
        ], NguiAutoCompleteComponent.prototype, "customSelected", void 0);
        __decorate([
            core.Output()
        ], NguiAutoCompleteComponent.prototype, "textEntered", void 0);
        __decorate([
            core.ViewChild('autoCompleteInput')
        ], NguiAutoCompleteComponent.prototype, "autoCompleteInput", void 0);
        __decorate([
            core.ViewChild('autoCompleteContainer')
        ], NguiAutoCompleteComponent.prototype, "autoCompleteContainer", void 0);
        NguiAutoCompleteComponent = __decorate([
            core.Component({
                selector: 'ngui-auto-complete',
                template: "\n    <div #autoCompleteContainer class=\"ngui-auto-complete\">\n      <!-- keyword input -->\n      <input *ngIf=\"showInputTag\"\n             #autoCompleteInput class=\"keyword\"\n             [attr.autocomplete]=\"autocomplete ? 'null' : 'off'\"\n             placeholder=\"{{placeholder}}\"\n             (focus)=\"showDropdownList($event)\"\n             (blur)=\"blurHandler($event)\"\n             (keydown)=\"inputElKeyHandler($event)\"\n             (input)=\"reloadListInDelay($event)\"\n             [(ngModel)]=\"keyword\"/>\n\n      <!-- dropdown that user can select -->\n      <ul *ngIf=\"dropdownVisible\" [class.empty]=\"emptyList\">\n        <li *ngIf=\"isLoading && loadingTemplate\" class=\"loading\"\n            [innerHTML]=\"loadingTemplate\"></li>\n        <li *ngIf=\"isLoading && !loadingTemplate\" class=\"loading\">{{loadingText}}</li>\n        <li *ngIf=\"minCharsEntered && !isLoading && !filteredList.length\"\n            (mousedown)=\"selectOne('')\"\n            class=\"no-match-found\">{{noMatchFoundText || 'No Result Found'}}\n        </li>\n        <li *ngIf=\"headerItemTemplate && filteredList.length\" class=\"header-item\"\n            [innerHTML]=\"headerItemTemplate\"></li>\n        <li *ngIf=\"blankOptionText && filteredList.length\"\n            (mousedown)=\"selectOne('')\"\n            class=\"blank-item\">{{blankOptionText}}\n        </li>\n        <li class=\"item\"\n            *ngFor=\"let item of filteredList; let i=index; trackBy: trackByIndex\"\n            (mousedown)=\"selectOne(item)\"\n            [ngClass]=\"{selected: i === itemIndex}\"\n            [innerHtml]=\"autoComplete.getFormattedListItem(item)\">\n        </li>\n      </ul>\n\n    </div>\n  ",
                encapsulation: core.ViewEncapsulation.None,
                styles: ["\n    @keyframes slideDown {\n      0% {\n        transform: translateY(-10px);\n      }\n      100% {\n        transform: translateY(0px);\n      }\n    }\n\n    .ngui-auto-complete {\n      background-color: transparent;\n    }\n\n    .ngui-auto-complete > input {\n      outline: none;\n      border: 0;\n      padding: 2px;\n      box-sizing: border-box;\n      background-clip: content-box;\n    }\n\n    .ngui-auto-complete > ul {\n      background-color: #fff;\n      margin: 0;\n      width: 100%;\n      overflow-y: auto;\n      list-style-type: none;\n      padding: 0;\n      border: 1px solid #ccc;\n      box-sizing: border-box;\n      animation: slideDown 0.1s;\n    }\n\n    .ngui-auto-complete > ul.empty {\n      display: none;\n    }\n\n    .ngui-auto-complete > ul li {\n      padding: 2px 5px;\n      border-bottom: 1px solid #eee;\n    }\n\n    .ngui-auto-complete > ul li.selected {\n      background-color: #ccc;\n    }\n\n    .ngui-auto-complete > ul li:last-child {\n      border-bottom: none;\n    }\n\n    .ngui-auto-complete > ul li:not(.header-item):hover {\n      background-color: #ccc;\n    }"]
            })
        ], NguiAutoCompleteComponent);
        return NguiAutoCompleteComponent;
    }());

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
            this.ngModelChange = new core.EventEmitter();
            this.valueChanged = new core.EventEmitter();
            this.customSelected = new core.EventEmitter();
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
                else if (this.parentForm instanceof forms.FormGroupName) {
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
            { type: core.ComponentFactoryResolver },
            { type: core.ViewContainerRef },
            { type: forms.ControlContainer, decorators: [{ type: core.Optional }, { type: core.Host }, { type: core.SkipSelf }] }
        ]; };
        __decorate([
            core.Input('autocomplete')
        ], NguiAutoCompleteDirective.prototype, "autocomplete", void 0);
        __decorate([
            core.Input('auto-complete-placeholder')
        ], NguiAutoCompleteDirective.prototype, "autoCompletePlaceholder", void 0);
        __decorate([
            core.Input('source')
        ], NguiAutoCompleteDirective.prototype, "source", void 0);
        __decorate([
            core.Input('path-to-data')
        ], NguiAutoCompleteDirective.prototype, "pathToData", void 0);
        __decorate([
            core.Input('min-chars')
        ], NguiAutoCompleteDirective.prototype, "minChars", void 0);
        __decorate([
            core.Input('display-property-name')
        ], NguiAutoCompleteDirective.prototype, "displayPropertyName", void 0);
        __decorate([
            core.Input('accept-user-input')
        ], NguiAutoCompleteDirective.prototype, "acceptUserInput", void 0);
        __decorate([
            core.Input('max-num-list')
        ], NguiAutoCompleteDirective.prototype, "maxNumList", void 0);
        __decorate([
            core.Input('select-value-of')
        ], NguiAutoCompleteDirective.prototype, "selectValueOf", void 0);
        __decorate([
            core.Input('loading-template')
        ], NguiAutoCompleteDirective.prototype, "loadingTemplate", void 0);
        __decorate([
            core.Input('list-formatter')
        ], NguiAutoCompleteDirective.prototype, "listFormatter", void 0);
        __decorate([
            core.Input('loading-text')
        ], NguiAutoCompleteDirective.prototype, "loadingText", void 0);
        __decorate([
            core.Input('blank-option-text')
        ], NguiAutoCompleteDirective.prototype, "blankOptionText", void 0);
        __decorate([
            core.Input('no-match-found-text')
        ], NguiAutoCompleteDirective.prototype, "noMatchFoundText", void 0);
        __decorate([
            core.Input('value-formatter')
        ], NguiAutoCompleteDirective.prototype, "valueFormatter", void 0);
        __decorate([
            core.Input('tab-to-select')
        ], NguiAutoCompleteDirective.prototype, "tabToSelect", void 0);
        __decorate([
            core.Input('select-on-blur')
        ], NguiAutoCompleteDirective.prototype, "selectOnBlur", void 0);
        __decorate([
            core.Input('match-formatted')
        ], NguiAutoCompleteDirective.prototype, "matchFormatted", void 0);
        __decorate([
            core.Input('auto-select-first-item')
        ], NguiAutoCompleteDirective.prototype, "autoSelectFirstItem", void 0);
        __decorate([
            core.Input('open-on-focus')
        ], NguiAutoCompleteDirective.prototype, "openOnFocus", void 0);
        __decorate([
            core.Input('close-on-focusout')
        ], NguiAutoCompleteDirective.prototype, "closeOnFocusOut", void 0);
        __decorate([
            core.Input('re-focus-after-select')
        ], NguiAutoCompleteDirective.prototype, "reFocusAfterSelect", void 0);
        __decorate([
            core.Input('header-item-template')
        ], NguiAutoCompleteDirective.prototype, "headerItemTemplate", void 0);
        __decorate([
            core.Input('ignore-accents')
        ], NguiAutoCompleteDirective.prototype, "ignoreAccents", void 0);
        __decorate([
            core.Input("no-filtering")
        ], NguiAutoCompleteDirective.prototype, "noFiltering", void 0);
        __decorate([
            core.Input()
        ], NguiAutoCompleteDirective.prototype, "ngModel", void 0);
        __decorate([
            core.Input('formControlName')
        ], NguiAutoCompleteDirective.prototype, "formControlName", void 0);
        __decorate([
            core.Input('formControl')
        ], NguiAutoCompleteDirective.prototype, "extFormControl", void 0);
        __decorate([
            core.Input('z-index')
        ], NguiAutoCompleteDirective.prototype, "zIndex", void 0);
        __decorate([
            core.Input('is-rtl')
        ], NguiAutoCompleteDirective.prototype, "isRtl", void 0);
        __decorate([
            core.Output()
        ], NguiAutoCompleteDirective.prototype, "ngModelChange", void 0);
        __decorate([
            core.Output()
        ], NguiAutoCompleteDirective.prototype, "valueChanged", void 0);
        __decorate([
            core.Output()
        ], NguiAutoCompleteDirective.prototype, "customSelected", void 0);
        NguiAutoCompleteDirective = __decorate([
            core.Directive({
                // tslint:disable-next-line:directive-selector
                selector: '[auto-complete], [ngui-auto-complete]'
            }),
            __param(2, core.Optional()), __param(2, core.Host()), __param(2, core.SkipSelf())
        ], NguiAutoCompleteDirective);
        return NguiAutoCompleteDirective;
    }());

    var NguiAutoCompleteModule = /** @class */ (function () {
        function NguiAutoCompleteModule() {
        }
        NguiAutoCompleteModule = __decorate([
            core.NgModule({
                declarations: [
                    NguiAutoCompleteComponent,
                    NguiAutoCompleteDirective
                ],
                imports: [
                    common.CommonModule,
                    forms.FormsModule
                ],
                exports: [
                    NguiAutoCompleteComponent,
                    NguiAutoCompleteDirective
                ]
            })
        ], NguiAutoCompleteModule);
        return NguiAutoCompleteModule;
    }());

    exports.NguiAutoComplete = NguiAutoComplete;
    exports.NguiAutoCompleteComponent = NguiAutoCompleteComponent;
    exports.NguiAutoCompleteDirective = NguiAutoCompleteDirective;
    exports.NguiAutoCompleteModule = NguiAutoCompleteModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngui-auto-complete.umd.js.map
