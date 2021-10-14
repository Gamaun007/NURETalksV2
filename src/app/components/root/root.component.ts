import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root-element',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  constructor(private ngbTooltipConfig: NgbTooltipConfig) {}

  ngOnInit(): void {
    this.ngbTooltipConfig.tooltipClass = 'default-tooltip';
    this.ngbTooltipConfig.placement = 'right';
    this.ngbTooltipConfig.triggers = 'hover';
    this.ngbTooltipConfig.autoClose = false;
    this.ngbTooltipConfig.container = 'body';
  }
}
