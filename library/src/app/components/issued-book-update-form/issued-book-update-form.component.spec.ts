import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedBookUpdateFormComponent } from './issued-book-update-form.component';

describe('IssuedBookUpdateFormComponent', () => {
  let component: IssuedBookUpdateFormComponent;
  let fixture: ComponentFixture<IssuedBookUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedBookUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedBookUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
