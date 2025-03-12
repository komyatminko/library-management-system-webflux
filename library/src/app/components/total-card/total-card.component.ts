import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-card',
  imports: [],
  templateUrl: './total-card.component.html',
  styleUrl: './total-card.component.css'
})
export class TotalCardComponent {

  @Input()
  total: number = 0;

  @Input()
  title: string = '';
}
