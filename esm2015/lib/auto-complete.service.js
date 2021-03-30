import { __decorate, __param } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
let NguiAutoComplete = class NguiAutoComplete {
    constructor(http) {
        this.http = http;
        // ...
    }
    filter(list, keyword, matchFormatted, accentInsensitive, noFiltering) {
        if (noFiltering) {
            return list;
        }
        return accentInsensitive
            ? list.filter((el) => {
                const objStr = matchFormatted ? this.getFormattedListItem(el).toLowerCase() : JSON.stringify(el).toLowerCase();
                keyword = keyword.toLowerCase();
                return objStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .indexOf(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
            })
            : list.filter((el) => {
                const objStr = matchFormatted ? this.getFormattedListItem(el).toLowerCase() : JSON.stringify(el).toLowerCase();
                keyword = keyword.toLowerCase();
                return objStr.indexOf(keyword) !== -1;
            });
    }
    getFormattedListItem(data) {
        let formatted;
        const formatter = this.listFormatter || '(id) value';
        if (typeof formatter === 'function') {
            formatted = formatter.apply(this, [data]);
        }
        else if (typeof data !== 'object') {
            formatted = data;
        }
        else if (typeof formatter === 'string') {
            formatted = formatter;
            const matches = formatter.match(/[a-zA-Z0-9_\$]+/g);
            if (matches && typeof data !== 'string') {
                matches.forEach((key) => {
                    formatted = formatted.replace(key, data[key]);
                });
            }
        }
        return formatted;
    }
    /**
     * return remote data from the given source and options, and data path
     */
    getRemoteData(keyword) {
        if (typeof this.source !== 'string') {
            throw new TypeError('Invalid type of source, must be a string. e.g. http://www.google.com?q=:my_keyword');
        }
        else if (!this.http) {
            throw new Error('Http is required.');
        }
        const matches = this.source.match(/:[a-zA-Z_]+/);
        if (matches === null) {
            throw new Error('Replacement word is missing.');
        }
        const replacementWord = matches[0];
        const url = this.source.replace(replacementWord, keyword);
        return this.http.get(url)
            .pipe(map((list) => {
            if (this.pathToData) {
                const paths = this.pathToData.split('.');
                paths.forEach((prop) => list = list[prop]);
            }
            return list;
        }));
    }
};
NguiAutoComplete.ctorParameters = () => [
    { type: HttpClient, decorators: [{ type: Optional }] }
];
NguiAutoComplete.ɵprov = i0.ɵɵdefineInjectable({ factory: function NguiAutoComplete_Factory() { return new NguiAutoComplete(i0.ɵɵinject(i1.HttpClient, 8)); }, token: NguiAutoComplete, providedIn: "root" });
NguiAutoComplete = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(0, Optional())
], NguiAutoComplete);
export { NguiAutoComplete };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ndWkvYXV0by1jb21wbGV0ZS8iLCJzb3VyY2VzIjpbImxpYi9hdXRvLWNvbXBsZXRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQUtyQyxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQU0zQixZQUFnQyxJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQzlDLE1BQU07SUFDUixDQUFDO0lBRU0sTUFBTSxDQUFDLElBQVcsRUFBRSxPQUFlLEVBQUUsY0FBdUIsRUFBRSxpQkFBMEIsRUFBRSxXQUFvQjtRQUNuSCxJQUFJLFdBQVcsRUFBRTtZQUNmLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLGlCQUFpQjtZQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDWCxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUNMLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMvRyxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVoQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQztxQkFDM0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENB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LENBQUM7YUFDNUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDO0NBQ0YsQ0FBQTs7WUE3RXVDLFVBQVUsdUJBQW5DLFFBQVE7OztBQU5WLGdCQUFnQjtJQUg1QixVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDO0lBT2EsV0FBQSxRQUFRLEVBQUUsQ0FBQTtHQU5aLGdCQUFnQixDQW1GNUI7U0FuRlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5ndWlBdXRvQ29tcGxldGUge1xuXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgcHVibGljIHBhdGhUb0RhdGE6IHN0cmluZztcbiAgcHVibGljIGxpc3RGb3JtYXR0ZXI6IChhcmc6IGFueSkgPT4gc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xuICAgIC8vIC4uLlxuICB9XG5cbiAgcHVibGljIGZpbHRlcihsaXN0OiBhbnlbXSwga2V5d29yZDogc3RyaW5nLCBtYXRjaEZvcm1hdHRlZDogYm9vbGVhbiwgYWNjZW50SW5zZW5zaXRpdmU6IGJvb2xlYW4sIG5vRmlsdGVyaW5nOiBib29sZWFuKSB7XG4gICAgaWYgKG5vRmlsdGVyaW5nKSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG4gICAgcmV0dXJuIGFjY2VudEluc2Vuc2l0aXZlXG4gICAgICA/IGxpc3QuZmlsdGVyKFxuICAgICAgICAoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBvYmpTdHIgPSBtYXRjaEZvcm1hdHRlZCA/IHRoaXMuZ2V0Rm9ybWF0dGVkTGlzdEl0ZW0oZWwpLnRvTG93ZXJDYXNlKCkgOiBKU09OLnN0cmluZ2lmeShlbCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBrZXl3b3JkID0ga2V5d29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgcmV0dXJuIG9ialN0ci5ub3JtYWxpemUoJ05GRCcpLnJlcGxhY2UoL1tcXHUwMzAwLVxcdTAzNmZdL2csICcnKVxuICAgICAgICAgICAgLmluZGV4T2Yoa2V5d29yZC5ub3JtYWxpemUoJ05GRCcpLnJlcGxhY2UoL1tcXHUwMzAwLVxcdTAzNmZdL2csICcnKSkgIT09IC0xO1xuICAgICAgICB9KVxuICAgICAgOiBsaXN0LmZpbHRlcihcbiAgICAgICAgKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2JqU3RyID0gbWF0Y2hGb3JtYXR0ZWQgPyB0aGlzLmdldEZvcm1hdHRlZExpc3RJdGVtKGVsKS50b0xvd2VyQ2FzZSgpIDogSlNPTi5zdHJpbmdpZnkoZWwpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAga2V5d29yZCA9IGtleXdvcmQudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgIHJldHVybiBvYmpTdHIuaW5kZXhPZihrZXl3b3JkKSAhPT0gLTE7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rm9ybWF0dGVkTGlzdEl0ZW0oZGF0YTogYW55KSB7XG4gICAgbGV0IGZvcm1hdHRlZDtcbiAgICBjb25zdCBmb3JtYXR0ZXIgPSB0aGlzLmxpc3RGb3JtYXR0ZXIgfHwgJyhpZCkgdmFsdWUnO1xuICAgIGlmICh0eXBlb2YgZm9ybWF0dGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZXIuYXBwbHkodGhpcywgW2RhdGFdKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0Jykge1xuICAgICAgZm9ybWF0dGVkID0gZGF0YTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBmb3JtYXR0ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZXI7XG4gICAgICBjb25zdCBtYXRjaGVzID0gZm9ybWF0dGVyLm1hdGNoKC9bYS16QS1aMC05X1xcJF0rL2cpO1xuICAgICAgaWYgKG1hdGNoZXMgJiYgdHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1hdGNoZXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgZm9ybWF0dGVkID0gZm9ybWF0dGVkLnJlcGxhY2Uoa2V5LCBkYXRhW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gcmVtb3RlIGRhdGEgZnJvbSB0aGUgZ2l2ZW4gc291cmNlIGFuZCBvcHRpb25zLCBhbmQgZGF0YSBwYXRoXG4gICAqL1xuICBwdWJsaWMgZ2V0UmVtb3RlRGF0YShrZXl3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueVtdPiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdHlwZSBvZiBzb3VyY2UsIG11c3QgYmUgYSBzdHJpbmcuIGUuZy4gaHR0cDovL3d3dy5nb29nbGUuY29tP3E9Om15X2tleXdvcmQnKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmh0dHApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSHR0cCBpcyByZXF1aXJlZC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5zb3VyY2UubWF0Y2goLzpbYS16QS1aX10rLyk7XG4gICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVwbGFjZW1lbnQgd29yZCBpcyBtaXNzaW5nLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcGxhY2VtZW50V29yZCA9IG1hdGNoZXNbMF07XG4gICAgY29uc3QgdXJsID0gdGhpcy5zb3VyY2UucmVwbGFjZShyZXBsYWNlbWVudFdvcmQsIGtleXdvcmQpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55W10+KHVybClcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKGxpc3QpID0+IHtcblxuICAgICAgICAgIGlmICh0aGlzLnBhdGhUb0RhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhzID0gdGhpcy5wYXRoVG9EYXRhLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBwYXRocy5mb3JFYWNoKChwcm9wKSA9PiBsaXN0ID0gbGlzdFtwcm9wXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG59XG4iXX0=