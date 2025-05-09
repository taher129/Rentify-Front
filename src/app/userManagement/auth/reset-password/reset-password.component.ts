import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import {Router, ActivatedRoute, RouterLink} from "@angular/router"
import { trigger, transition, style, animate, state } from "@angular/animations"
import { NgIf } from "@angular/common"
import {CarouselComponent} from "../login/carousel/carousel.component";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CarouselComponent, RouterLink],
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
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
export class ResetPasswordComponent implements OnInit {
  phoneNumber = ""
  resetForm: FormGroup
  focusedField: string | null = null
  passwordStrength = 0

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", Validators.required],
      },
      {validator: this.passwordMatchValidator},
    )
  }

  ngOnInit() {
    this.phoneNumber = history.state.phoneNumber || ""
    if (!this.phoneNumber) {
      this.router.navigate(["/forgot-password"])
    }

    // Listen for password changes to calculate strength
    this.resetForm.get("newPassword")?.valueChanges.subscribe((password) => {
      this.calculatePasswordStrength(password)
    })
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get("newPassword")?.value === form.get("confirmPassword")?.value ? null : {mismatch: true}
  }

  calculatePasswordStrength(password: string) {
    if (!password) {
      this.passwordStrength = 0
      return
    }

    let strength = 0

    // Length check
    if (password.length >= 8) strength++

    // Contains lowercase
    if (/[a-z]/.test(password)) strength++

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++

    // Contains number
    if (/[0-9]/.test(password)) strength++

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength++

    this.passwordStrength = Math.min(4, strength)
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return ""
    }
  }

  onFocus(fieldName: string) {
    this.focusedField = fieldName
  }

  onBlur() {
    this.focusedField = null
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const {newPassword, confirmPassword} = this.resetForm.value;
      this.userService.resetPassword(this.phoneNumber, newPassword, confirmPassword).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }
}
