import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewOrderDialogComponent } from './preview-order-dialog.component';

describe('PreviewOrderDialogComponent', () => {
  let component: PreviewOrderDialogComponent;
  let fixture: ComponentFixture<PreviewOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewOrderDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
