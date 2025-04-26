import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {HomeComponent} from "../layout/home/home.component";
import {AuthService} from "../userManagement/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthModalComponent} from "../shared/auth-modal/auth-modal.component";

@Component({
  selector: 'app-visitor-home',
  standalone: true,
  imports: [
    HomeComponent
  ],
  templateUrl: './visitor-home.component.html',
  styleUrl: './visitor-home.component.css'
})
export class VisitorHomeComponent {
  private hasShownModal = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  @HostListener('document:click', ['$event'])
  handleInteraction(event: MouseEvent) {
    if (!this.authService.isAuthenticated()) {
      event.preventDefault();
      event.stopPropagation();

      if (!this.hasShownModal) {
        this.hasShownModal = true;

        this.dialog.open(AuthModalComponent, {
          width: '400px',
          panelClass: 'custom-dialog-container',
        }).afterClosed().subscribe(() => {
          this.hasShownModal = false;
        });
      }
    }
  }
}
