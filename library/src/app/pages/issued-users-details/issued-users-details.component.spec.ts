import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedUsersDetailsComponent } from './issued-users-details.component';

describe('IssuedUsersDetailsComponent', () => {
  let component: IssuedUsersDetailsComponent;
  let fixture: ComponentFixture<IssuedUsersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedUsersDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
