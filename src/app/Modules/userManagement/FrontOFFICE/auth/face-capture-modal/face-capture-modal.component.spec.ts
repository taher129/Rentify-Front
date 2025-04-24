import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceCaptureModalComponent } from './face-capture-modal.component';

describe('FaceCaptureModalComponent', () => {
  let component: FaceCaptureModalComponent;
  let fixture: ComponentFixture<FaceCaptureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceCaptureModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaceCaptureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
