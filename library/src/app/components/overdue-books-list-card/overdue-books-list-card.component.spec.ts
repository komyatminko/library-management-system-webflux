import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueBooksListCardComponent } from './overdue-books-list-card.component';

describe('OverdueBooksListCardComponent', () => {
  let component: OverdueBooksListCardComponent;
  let fixture: ComponentFixture<OverdueBooksListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverdueBooksListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverdueBooksListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
