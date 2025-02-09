import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/book/book.service';
import { Component, Input } from '@angular/core';
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

  constructor(private bookService : BookService,
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


}
