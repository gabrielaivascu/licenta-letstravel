import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousTripComponent } from './previous-trip.component';

describe('PreviousTripComponent', () => {
  let component: PreviousTripComponent;
  let fixture: ComponentFixture<PreviousTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
