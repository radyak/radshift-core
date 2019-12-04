import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendItemComponent } from './backend-item.component';

describe('BackendItemComponent', () => {
  let component: BackendItemComponent;
  let fixture: ComponentFixture<BackendItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
