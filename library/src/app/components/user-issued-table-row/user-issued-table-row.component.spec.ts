import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIssuedTableRowComponent } from './user-issued-table-row.component';

describe('UserIssuedTableRowComponent', () => {
  let component: UserIssuedTableRowComponent;
  let fixture: ComponentFixture<UserIssuedTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIssuedTableRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIssuedTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
