import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverDueBookListComponent } from './over-due-book-list.component';

describe('OverDueBookListComponent', () => {
  let component: OverDueBookListComponent;
  let fixture: ComponentFixture<OverDueBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverDueBookListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverDueBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
