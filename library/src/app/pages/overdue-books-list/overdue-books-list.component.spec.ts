import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueBooksListComponent } from './overdue-books-list.component';

describe('OverdueBooksListComponent', () => {
  let component: OverdueBooksListComponent;
  let fixture: ComponentFixture<OverdueBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverdueBooksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverdueBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
