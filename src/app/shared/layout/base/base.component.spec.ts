import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponent } from './base.component';
import { HeaderComponent } from '@shared/layout/header/header.component';
import { FooterComponent } from '@shared/layout/footer/footer.component';
import { ContentComponent } from '@shared/layout/content/content.component';
import { By } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@store/auth/state/auth.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

export class MdbDialogRefMock {

}

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseComponent, HeaderComponent, FooterComponent, ContentComponent],
      providers: [{ provide: MdbModalRef, useClass: MdbDialogRefMock }],
      imports: [
        MdbModalModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([AuthState]),
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have header, footer and content', () => {
    expect(fixture.debugElement.query(By.directive(HeaderComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(FooterComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ContentComponent))).toBeTruthy();
  });
});
