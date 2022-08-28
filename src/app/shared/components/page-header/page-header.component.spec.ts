import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';
import { Component } from '@angular/core';
import { PageTitleDirective } from '@shared/directives/page-title.directive';
import { PageActionsDirective } from '@shared/directives/page-actions.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <app-page-header>
      <span id="title" appPageTitle>Title</span>
      <button id="action-button" appPageActions>Button</button>
    </app-page-header>
  `
})
export class TestHostComponent {
}

describe('PageHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, PageHeaderComponent, PageTitleDirective, PageActionsDirective],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show page header', () => {
    expect(fixture.debugElement.query(By.css('#title'))).toBeTruthy();
  });

  it('should show action button', () => {
    expect(fixture.debugElement.query(By.css('#action-button'))).toBeTruthy();
  });
});
