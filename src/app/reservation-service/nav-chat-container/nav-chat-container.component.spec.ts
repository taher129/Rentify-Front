import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavChatContainerComponent } from './nav-chat-container.component';

describe('NavChatContainerComponent', () => {
  let component: NavChatContainerComponent;
  let fixture: ComponentFixture<NavChatContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavChatContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavChatContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
