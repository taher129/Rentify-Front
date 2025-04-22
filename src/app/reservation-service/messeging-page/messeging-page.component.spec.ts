import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessegingPageComponent } from './messeging-page.component';

describe('MessegingPageComponent', () => {
  let component: MessegingPageComponent;
  let fixture: ComponentFixture<MessegingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessegingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessegingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
