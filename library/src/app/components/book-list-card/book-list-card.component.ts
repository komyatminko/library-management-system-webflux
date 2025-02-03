import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list-card',
  imports: [RouterLink],
  templateUrl: './book-list-card.component.html',
  styleUrl: './book-list-card.component.css'
})
export class BookListCardComponent {

  constructor(private router: Router){}
  
}
