import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDataContainerComponent } from './entity-data-container.component';

describe('EntityDataContainerComponent', () => {
  let component: EntityDataContainerComponent;
  let fixture: ComponentFixture<EntityDataContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityDataContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
