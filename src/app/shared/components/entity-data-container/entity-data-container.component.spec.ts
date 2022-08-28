import { DataStateType } from '@core/store';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDataContainerComponent } from './entity-data-container.component';
import { ChangeDetectionStrategy } from '@angular/core';


describe('EntityDataContainerComponent', () => {
  let component: EntityDataContainerComponent;
  let fixture: ComponentFixture<EntityDataContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityDataContainerComponent]
    })
      .overrideComponent(EntityDataContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
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

  it('should show loading indicator when data state loading', () => {
    component.dataState = DataStateType.loading;
    fixture.detectChanges();
    const loadingIndicator = fixture.debugElement.query(By.css('#entity-container-loading-indicator'))
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show not found alert when data state not found', () => {
    component.dataState = DataStateType.notFound;
    fixture.detectChanges();
    const loadingIndicator = fixture.debugElement.query(By.css('#entity-container-not-found'))
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show error alert when data state load failed', () => {
    component.dataState = DataStateType.loadFailed;
    fixture.detectChanges();
    const loadingIndicator = fixture.debugElement.query(By.css('#entity-container-error-occurred'))
    expect(loadingIndicator).toBeTruthy()
  });
});
