import { Component } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import {Router, RouterLink} from "@angular/router"
import { trigger, transition, style, animate, state } from "@angular/animations"
import { NgIf } from "@angular/common"
import {CarouselComponent} from "../login/carousel/carousel.component";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CarouselComponent, RouterLink],
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  animations: [
    trigger("fadeInOut", [state("void", style({ opacity: 0 })), transition(":enter, :leave", [animate(300)])]),
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("300ms ease-in", style({ transform: "translateX(0%)" })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ transform: "translateX(-100%)" }))]),
    ]),
  ],
})
export class ForgotPasswordComponent {
  phoneForm: FormGroup
  focusedField: string | null = null
  isLoading = false;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {
    this.phoneForm = this.fb.group({
      phoneNumber: ["", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    })
  }

  onFocus(fieldName: string) {
    this.focusedField = fieldName
  }

  onBlur() {
    this.focusedField = null
  }

  onSubmit(): void {
    if (this.phoneForm.invalid || this.isLoading) {
      return;
    }

    const phoneNumber = this.phoneForm.value.phoneNumber;

    this.userService.initiatePasswordReset(phoneNumber).subscribe({
      next: () => {
        this.router.navigate(['/verify-otp'], {
          state: { phoneNumber },
          queryParams: { step: 2 }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP. Please try again.';
        console.error('Error sending OTP:', err);
      }
    });
  }

  get phoneNumber() {
    return this.phoneForm.get('phoneNumber');
  }
}
