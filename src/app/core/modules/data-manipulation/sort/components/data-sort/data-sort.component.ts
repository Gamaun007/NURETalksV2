import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SortDefinition } from '../../models';
import { sortCallback } from 'core/utils';

export enum SortOrderBy {
  ASC,
  DESC
}

@Component({
  selector: 'app-data-sort',
  templateUrl: './data-sort.component.html',
  styleUrls: ['./data-sort.component.scss'],
})
export class DataSortComponent implements OnInit, OnChanges {
  @Input()
  sortDefinitions: SortDefinition<any>[] = [];

  @Input()
  data: any[];

  dataToMakeOperations: any[];

  @Output()
  sort = new EventEmitter();

  selectedOrderBy = SortOrderBy.ASC;
  selectedItem: SortDefinition<any>;

  constructor(private router: Router, private translate: TranslateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('sortDefinitions' in changes) {
      if (!this.selectedItem) {
        this.selectedItem = this.sortDefinitions[0];
      }
    }

    if ('data' in changes) {
      this.dataToMakeOperations = this.data;
      if (changes['data'].firstChange && this.selectedItem) {
        this.selectSort(this.selectedItem);
      }
    }
  }

  ngOnInit(): void {
    if (this.router.routerState.snapshot.root.queryParams['sortedBy']) {
      const sort = this.sortDefinitions.find(
        (x) => x.id === this.router.routerState.snapshot.root.queryParams['sortedBy']
      );

      if (sort) {
        this.selectSort(sort);
      }
    }
  }

  displayValueSelector(x: SortDefinition<any>): string {
    return this.translate.instant(x.translationKey);
  }

  changeDirection(): void {
    this.selectedOrderBy === SortOrderBy.ASC ? this.selectedOrderBy = SortOrderBy.DESC : this.selectedOrderBy = SortOrderBy.ASC;
    this.dataToMakeOperations = this.dataToMakeOperations.slice().reverse();
    this.sort.emit(this.dataToMakeOperations);
  }

  sortBySelectedDefinition(): void {
    if (this.selectedItem) {
      this.selectSort(this.selectedItem);
    }
  }

  selectSort(sort: SortDefinition<any>): void {
    if (!this.dataToMakeOperations) {
      this.sort.emit([]);
      return;
    }

    this.selectedItem = sort;

    this.dataToMakeOperations = this.dataToMakeOperations.slice().sort((first, second) => {
      const firstPropValue = sort.propertySelector(first);
      const secondPropValue = sort.propertySelector(second);

      const sortFunc = sort.sortFunc || sortCallback;
      return sortFunc(firstPropValue, secondPropValue);
    });

    if (this.selectedOrderBy === SortOrderBy.DESC) {
      this.dataToMakeOperations = this.dataToMakeOperations.slice().reverse();
    }
    this.sort.emit(this.dataToMakeOperations);

    this.router.navigate([], {
      queryParams: { ...this.router.routerState.snapshot.root.queryParams, sortedBy: sort.id },
    });
  }
}
