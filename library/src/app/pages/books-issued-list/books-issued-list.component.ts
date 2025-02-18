import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book';
import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { BookIssuedTableRowComponent } from '@/app/components/book-issued-table-row/book-issued-table-row.component';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { IssuedBookFormComponent } from '@/app/components/issued-book-form/issued-book-form.component';

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
  bookName!: string ;
  uniqueBookId!: string;

  constructor(private bookService: BookService,
              private router: Router,
            
            ){ }

  ngOnInit(){
    this.bookService.getBorrowedBooks().subscribe(data=> 
      
      data.map(book=> {
        // console.log(book)
        this.allBooks = data;
        // console.log('all books ',this.allBooks);
        book.borrowedBy?.map(user=>{
          this.borrowedUsers.push(user);
          // console.log('borrowed users ' , this.borrowedUsers);
        })
        
        
        this.bookName = book.name;
        // console.log('book name ', this.bookName);
        if(book.uniqueBookId) this.uniqueBookId = book.uniqueBookId;
        // console.log(this.allBooks)
      }) 
    )
    // 

  }

  

}
