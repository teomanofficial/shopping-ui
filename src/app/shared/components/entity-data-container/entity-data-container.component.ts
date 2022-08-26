import { Component, Input, OnInit } from '@angular/core';
import { DataStateType } from '@core/store';

@Component({
  selector: 'app-entity-data-container',
  templateUrl: './entity-data-container.component.html',
  styleUrls: ['./entity-data-container.component.scss']
})
export class EntityDataContainerComponent implements OnInit {
  @Input() dataState: DataStateType;

  dataStateType = DataStateType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
