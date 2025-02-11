import { Book } from '@/app/models/book';
import { AuthorService } from '@/app/services/author/author.service';
import { BookService } from '@/app/services/book/book.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'tr[app-table-row]',
  imports: [RouterLink],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css'
})
export class TableRowComponent {

  @Input()
  data!: Book;

  @Output()
  onEditClid = new EventEmitter<Book>();

  constructor(private bookService : BookService,
              private authorService: AuthorService,
              private router: Router) { }

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
        this.authorService._deleteAuthor(this.data.author? this.data.author : undefined);
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


  goToDetailsPage(data: Book){
    console.log("goToDetailsPage btn click", data.id)
    // this.router.navigate()
  }

  showEditDialog(){
    // console.log('show edit dialog');
    this.onEditClid.emit(this.data);
  }

}
