import { Book } from '@/app/models/book';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'tr[app-table-row]',
  imports: [],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css'
})
export class TableRowComponent {

  @Input()
  data!: Book;

}
