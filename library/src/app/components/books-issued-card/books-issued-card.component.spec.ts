import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksIssuedCardComponent } from './books-issued-card.component';

describe('BooksIssuedCardComponent', () => {
  let component: BooksIssuedCardComponent;
  let fixture: ComponentFixture<BooksIssuedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksIssuedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksIssuedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
