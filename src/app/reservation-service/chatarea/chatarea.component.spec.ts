import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAreaComponent } from './chatarea.component';

describe('ChatareaComponent', () => {
  let component: ChatAreaComponent;
  let fixture: ComponentFixture<ChatAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
