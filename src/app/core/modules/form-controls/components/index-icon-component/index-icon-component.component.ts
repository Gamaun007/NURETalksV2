import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-index-icon-component',
  templateUrl: './index-icon-component.component.html',
  styleUrls: ['./index-icon-component.component.scss'],
})
export class IndexIconComponentComponent {
  @Input()
  index: number;
}
