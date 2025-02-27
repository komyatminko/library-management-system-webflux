import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersIssuedListComponent } from './users-issued-list.component';

describe('UsersIssuedListComponent', () => {
  let component: UsersIssuedListComponent;
  let fixture: ComponentFixture<UsersIssuedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersIssuedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersIssuedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
