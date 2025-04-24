import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import { trigger, transition, style, animate, stagger } from '@angular/animations';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { catchError } from 'rxjs/operators';
import {of} from "rxjs";

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms 300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class VerifyEmailComponent implements OnInit {
  countdown: number = 5;
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verifyToken();
  }

  verifyToken(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = "Verification token is missing.";
      this.isError = true;
      this.isLoading = false;
      return;
    }

    this.authService.verifyEmail(token).pipe(
      catchError((err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.error?.error || "Something went wrong during verification.";
        return of(null);
      })
    ).subscribe({
      next: (res) => {
        if (res) {
          this.isLoading = false;
          this.message = res.message || "Email verified successfully!";
          this.isError = false;
          this.startCountdown();
        }
      }
    });
  }

  startCountdown(): void {
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['/login']); // Redirect to login instead of signup
      }
    }, 1000);
  }
}
