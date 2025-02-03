import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksAvailableCardComponent } from './books-available-card.component';

describe('BooksAvailableCardComponent', () => {
  let component: BooksAvailableCardComponent;
  let fixture: ComponentFixture<BooksAvailableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksAvailableCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksAvailableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
