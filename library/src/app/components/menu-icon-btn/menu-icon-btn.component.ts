import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-icon-btn',
  imports: [],
  templateUrl: './menu-icon-btn.component.html',
  styleUrl: './menu-icon-btn.component.css'
})
export class MenuIconBtnComponent {

  private isCol2Hidden = true;
  @Output() toggleCol2 = new EventEmitter<boolean>

  @ViewChild('menuIcon') menuIcon!: ElementRef;

  toggleMenuIcon(): void {
    const menuElement = this.menuIcon.nativeElement;
    menuElement.classList.toggle('open');

    this.isCol2Hidden = !this.isCol2Hidden; // Toggle the state
    this.toggleCol2.emit(this.isCol2Hidden);
  }

}
