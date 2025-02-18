import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issued-book-details',
  imports: [],
  templateUrl: './issued-book-details.component.html',
  styleUrl: './issued-book-details.component.css'
})
export class IssuedBookDetailsComponent {

  uniqueBookId!: string | null;
  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.uniqueBookId = params.get('id'); 
      console.log(this.uniqueBookId);
    })
  }

}
