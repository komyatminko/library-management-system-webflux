import { Book } from '@/app/models/book';
import { AuthorService } from '@/app/services/author/author.service';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'tr[app-table-row]',
  imports: [RouterLink,
            CommonModule
            ],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css'
})
export class TableRowComponent {

  @Input()
  data!: Book;

  @Output()
  onEditClick = new EventEmitter<Book>();


  hasInjectedButton = false;

  constructor(private bookService : BookService,
              private authorService: AuthorService,
              private elementRef: ElementRef,
              private router: Router) { }

  
  ngAfterContentInit() {
    
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[details-btn]');
  }

  showDeleteConfirmDailog(){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.deleteBook(this.data,this.deleteCallBack);
        this.bookService.deleteBookCover(this.data.imgUrl).subscribe(
          {
            next: () => console.log('Book cover deleted successfully'),
            error: (err) => console.error('Error deleting book cover:', err),
          }
        );
        // this.authorService._deleteAuthor(this.data.author? this.data.author : undefined);
      }
    });
  }

  deleteCallBack()
  {
    Swal.fire({
      title: "Deleted!",
      text: "Book has been deleted.",
      icon: "success"
    });
  }


  

  showEditDialog(){
    this.onEditClick.emit(this.data);
  }

}
