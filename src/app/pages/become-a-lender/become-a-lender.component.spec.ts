import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeALenderComponent } from './become-a-lender.component';

describe('BecomeALenderComponent', () => {
  let component: BecomeALenderComponent;
  let fixture: ComponentFixture<BecomeALenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeALenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BecomeALenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
