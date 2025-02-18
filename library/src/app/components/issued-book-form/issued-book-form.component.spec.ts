import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedBookFormComponent } from './issued-book-form.component';

describe('IssuedBookFormComponent', () => {
  let component: IssuedBookFormComponent;
  let fixture: ComponentFixture<IssuedBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedBookFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
