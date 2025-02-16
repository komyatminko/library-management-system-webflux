import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksIssuedListComponent } from './books-issued-list.component';

describe('BooksIssuedListComponent', () => {
  let component: BooksIssuedListComponent;
  let fixture: ComponentFixture<BooksIssuedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksIssuedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksIssuedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
