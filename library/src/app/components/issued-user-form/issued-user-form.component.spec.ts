import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedUserFormComponent } from './issued-user-form.component';

describe('IssuedUserFormComponent', () => {
  let component: IssuedUserFormComponent;
  let fixture: ComponentFixture<IssuedUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
