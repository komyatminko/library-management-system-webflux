import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book';
import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { BookIssuedTableRowComponent } from '@/app/components/book-issued-table-row/book-issued-table-row.component';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { IssuedBookFormComponent } from '@/app/components/issued-book-form/issued-book-form.component';
import { map, Observable, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from '@/app/components/not-found/not-found.component';

@Component({
  selector: 'app-books-issued-list',
  imports: [CommonModule,
            FormsModule,
            RouterLink,
            BookIssuedTableRowComponent,
            IssuedBookFormComponent,
            NotFoundComponent
          ],
  templateUrl: './books-issued-list.component.html',
  styleUrl: './books-issued-list.component.css'
})
export class BooksIssuedListComponent {

  allBooks !: Book[];
  originBooks !: Book[];
  borrowedUsers : BorrowedUser[] = [];
  searchKeyword :string = '';
  nothingToShow: boolean = false;

  isClickFilter : boolean = false;
  filterStatus: string = 'all';
  filteredBooks: Book[] = [];

  private processedUsers = new Set<string>();

  constructor(private bookService: BookService,
              private router: Router,
            
            ){ }

  
  ngOnInit() {
    this.bookService.getBorrowedBooks().subscribe(data => {
      this.allBooks = data; 
      this.originBooks = data;

      this.borrowedUsers = [];
      
      data.forEach(book => {
        book.borrowedBy?.forEach(user => {
          if (user && !this.borrowedUsers.some(bu => bu.id === user.id)) {
            this.borrowedUsers.push(user);
          }
        });
      });

      // set true to isOverdue and update book 
      this.allBooks.forEach(book=>{
        if(book.borrowedBy){
          book.borrowedBy.forEach(borrowedUser=> {
            //check whether return date is overdue or not
            if(this.bookService.isOverdue(borrowedUser.returnDate) && !borrowedUser.isOverdue){
              //if yes, call fun updateBookWhenOverdue from service to update the book
              if(borrowedUser.id){
                if (!this.processedUsers.has(borrowedUser.id)) {
                  this.bookService.updateBookWhenOverdue(book, borrowedUser);
                  this.processedUsers.add(borrowedUser.id);
                } else {
                  console.log(`Skipping already processed user ${borrowedUser.id}`);
                }
              }
            }
          })
        }
      })
    });

    
  }

  showSearchResult() {
    
    if (this.searchKeyword.length > 0) {
      this.allBooks = this.originBooks
        .map(book => ({
          ...book,
          borrowedBy: book.borrowedBy?.filter(user =>
            user?.username?.toLowerCase().includes(this.searchKeyword.toLowerCase())
          )
        }))
        .filter(book => {
          if(book.borrowedBy){
            return book.borrowedBy?.length > 0
          }
          return 'book does not have borrowed user';
          
        }); 
        this.borrowedUsers = this.allBooks.flatMap(book => book.borrowedBy || []);
        //showing nothing to show text when keyword is not equal
        if(this.allBooks.length == 0 ){
          this.nothingToShow = true;
        }else{
          this.nothingToShow = false;
        }
    } else {
      this.allBooks = [...this.originBooks];
      this.borrowedUsers = this.originBooks.flatMap(book => book.borrowedBy || []);
    }
  }
  
  showFilterBox(){
    this.isClickFilter = !this.isClickFilter;
  }

  filterBooks() {
    if (this.filterStatus === 'all') {
      this.allBooks = this.originBooks;
      this.borrowedUsers = this.allBooks.flatMap(book => book.borrowedBy || []);
    } else if (this.filterStatus === 'notOverdue') {
      this.allBooks = this.originBooks.filter(book => book.borrowedBy?.every(user => !user.isOverdue));
      this.borrowedUsers = this.allBooks.flatMap(book => book.borrowedBy || []);
    } else if (this.filterStatus === 'overdue') {
      this.allBooks = this.originBooks.filter(book => book.borrowedBy?.some(user => user.isOverdue));
      this.borrowedUsers = this.allBooks.flatMap(book => book.borrowedBy || []);
    }
  }
}
