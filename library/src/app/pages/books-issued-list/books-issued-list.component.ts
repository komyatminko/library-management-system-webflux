import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book';
import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { BookIssuedTableRowComponent } from '@/app/components/book-issued-table-row/book-issued-table-row.component';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { IssuedBookFormComponent } from '@/app/components/issued-book-form/issued-book-form.component';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-books-issued-list',
  imports: [CommonModule,
            RouterLink,
            BookIssuedTableRowComponent,
            IssuedBookFormComponent
          ],
  templateUrl: './books-issued-list.component.html',
  styleUrl: './books-issued-list.component.css'
})
export class BooksIssuedListComponent {

  allBooks !: Book[];
  borrowedUsers : BorrowedUser[] = [];


  constructor(private bookService: BookService,
              private router: Router,
            
            ){ }

  
  ngOnInit() {
    this.bookService.getBorrowedBooks().subscribe(data => {
      this.allBooks = data; 

      this.borrowedUsers = [];
      
      data.forEach(book => {
        book.borrowedBy?.forEach(user => {
          if (user && !this.borrowedUsers.some(bu => bu.id === user.id)) {
            this.borrowedUsers.push(user);
          }
        });
      });
    });
  }

}
