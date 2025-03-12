import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssuedTableRowComponent } from './book-issued-table-row.component';

describe('BookIssuedTableRowComponent', () => {
  let component: BookIssuedTableRowComponent;
  let fixture: ComponentFixture<BookIssuedTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookIssuedTableRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookIssuedTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
