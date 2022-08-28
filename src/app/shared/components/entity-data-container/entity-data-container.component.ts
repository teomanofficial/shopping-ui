import { DataStateType } from '@core/store';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-entity-data-container',
  templateUrl: './entity-data-container.component.html',
  styleUrls: ['./entity-data-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDataContainerComponent {
  @Input() dataState: DataStateType;

  dataStateType = DataStateType;
}
