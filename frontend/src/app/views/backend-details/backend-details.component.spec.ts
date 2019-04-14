import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendDetailsComponent } from './backend-details.component';

describe('BackendDetailsComponent', () => {
  let component: BackendDetailsComponent;
  let fixture: ComponentFixture<BackendDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
