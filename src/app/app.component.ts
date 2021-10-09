import { Component } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private ngbTooltipConfig: NgbTooltipConfig) {}

  ngOnInit(): void {
    this.ngbTooltipConfig.tooltipClass = 'default-tooltip';
    this.ngbTooltipConfig.placement = 'right';
    this.ngbTooltipConfig.triggers = 'hover';
    this.ngbTooltipConfig.autoClose = false;
    this.ngbTooltipConfig.container = 'body';
  }
}
