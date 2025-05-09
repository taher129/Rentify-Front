import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanVerificationComponent } from './human-verification.component';

describe('HumanVerificationComponent', () => {
  let component: HumanVerificationComponent;
  let fixture: ComponentFixture<HumanVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
