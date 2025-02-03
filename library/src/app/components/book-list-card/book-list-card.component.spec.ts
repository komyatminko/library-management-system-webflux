import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListCardComponent } from './book-list-card.component';

describe('BookListCardComponent', () => {
  let component: BookListCardComponent;
  let fixture: ComponentFixture<BookListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
