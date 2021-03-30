import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NguiAutoCompleteComponent } from './auto-complete.component';
import { NguiAutoCompleteDirective } from './auto-complete.directive';
let NguiAutoCompleteModule = class NguiAutoCompleteModule {
};
NguiAutoCompleteModule = __decorate([
    NgModule({
        declarations: [
            NguiAutoCompleteComponent,
            NguiAutoCompleteDirective
        ],
        imports: [
            CommonModule,
            FormsModule
        ],
        exports: [
            NguiAutoCompleteComponent,
            NguiAutoCompleteDirective
        ]
    })
], NguiAutoCompleteModule);
export { NguiAutoCompleteModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd1aS9hdXRvLWNvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG8tY29tcGxldGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFnQnRFLElBQWEsc0JBQXNCLEdBQW5DLE1BQWEsc0JBQXNCO0NBQUksQ0FBQTtBQUExQixzQkFBc0I7SUFkbEMsUUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFO1lBQ1oseUJBQXlCO1lBQ3pCLHlCQUF5QjtTQUMxQjtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVk7WUFDWixXQUFXO1NBQ1o7UUFDRCxPQUFPLEVBQUU7WUFDUCx5QkFBeUI7WUFDekIseUJBQXlCO1NBQzFCO0tBQ0YsQ0FBQztHQUNXLHNCQUFzQixDQUFJO1NBQTFCLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlQ29tcG9uZW50IH0gZnJvbSAnLi9hdXRvLWNvbXBsZXRlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlRGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRvLWNvbXBsZXRlLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE5ndWlBdXRvQ29tcGxldGVDb21wb25lbnQsXG4gICAgTmd1aUF1dG9Db21wbGV0ZURpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBOZ3VpQXV0b0NvbXBsZXRlQ29tcG9uZW50LFxuICAgIE5ndWlBdXRvQ29tcGxldGVEaXJlY3RpdmVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3VpQXV0b0NvbXBsZXRlTW9kdWxlIHsgfVxuIl19