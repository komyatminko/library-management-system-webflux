import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuIconBtnComponent } from './menu-icon-btn.component';

describe('MenuIconBtnComponent', () => {
  let component: MenuIconBtnComponent;
  let fixture: ComponentFixture<MenuIconBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuIconBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuIconBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
