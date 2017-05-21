import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="preloader-wrapper active" [class.big]="!small" [class.small]="small">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
            <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>`
})
export class LoadingSpinnerComponent {
  @Input() public small: boolean;
}
