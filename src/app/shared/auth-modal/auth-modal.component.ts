import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AuthModalComponent>,
    private router: Router
  ) {}

  onLogin() {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  onSignup() {
    this.dialogRef.close();
    this.router.navigate(['/signup']);
  }


}
