import { User } from '@/app/models/user';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tr[app-user-issued-table-row]',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './user-issued-table-row.component.html',
  styleUrl: './user-issued-table-row.component.css'
})
export class UserIssuedTableRowComponent {

  hasInjectedButton: boolean = false;
  @Input()
  user!: User;

  constructor(private elementRef: ElementRef){}

  ngOnInit(){
  }

  ngAfterContentInit() {
    
    this.hasInjectedButton = !!this.elementRef.nativeElement.querySelector('[details-btn]');
  }

  showEditDialog(){

  }

  showDeleteConfirmDailog(){

  }
}
