import {
  Component,
   OnInit,
  ViewChildren,
   QueryList,
   ElementRef,
   AfterViewInit,
} from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import {Router, ActivatedRoute, RouterLink} from "@angular/router"
import { trigger, transition, style, animate, state } from "@angular/animations"
import { NgIf, NgFor } from "@angular/common"
import {CarouselComponent} from "../login/carousel/carousel.component";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-verify-otp",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, CarouselComponent, RouterLink],
  templateUrl: "./verify-otp.component.html",
  styleUrls: ["./verify-otp.component.scss"],
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
export class VerifyOtpComponent implements OnInit, AfterViewInit {
  phoneNumber = ""
  otpForm: FormGroup
  otpControls = Array(6).fill("")

  @ViewChildren("otpInput") otpInputs!: QueryList<ElementRef>

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,

  ) {
    // Create form with 6 separate digit controls
    const formControls: any = {}
    for (let i = 0; i < 6; i++) {
      formControls[`digit${i}`] = ["", [Validators.required, Validators.pattern(/^[0-9]$/)]]
    }
    this.otpForm = this.fb.group(formControls)
  }

  ngOnInit() {
    this.phoneNumber = history.state.phoneNumber || ""
    if (!this.phoneNumber) {
      this.router.navigate(["/forgot-password"])
    }
  }

  ngAfterViewInit() {
    // Focus the first input after view is initialized
    setTimeout(() => {
      this.otpInputs.first.nativeElement.focus()
    }, 0)
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace
    if (event.key === "Backspace") {
      if ((event.target as HTMLInputElement).value === "") {
        // Move to previous input if current is empty
        if (index > 0) {
          this.otpInputs.toArray()[index - 1].nativeElement.focus()
        }
      }
    }
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement
    const value = input.value

    // Only allow numbers
    if (value && /^\d$/.test(value)) {
      // Auto advance to next input
      if (index < 5) {
        setTimeout(() => {
          this.otpInputs.toArray()[index + 1].nativeElement.focus()
        }, 0)
      }
    } else {
      // Clear non-numeric input
      input.value = ""
    }

    this.checkFormValidity()
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault()
    const clipboardData = event.clipboardData
    if (clipboardData) {
      const pastedText = clipboardData.getData("text")

      // Check if pasted content is a 6-digit number
      if (/^\d{6}$/.test(pastedText)) {
        // Distribute digits to inputs
        for (let i = 0; i < 6; i++) {
          const control = this.otpForm.get(`digit${i}`)
          if (control) {
            control.setValue(pastedText.charAt(i))
          }
        }

        // Focus the last input
        setTimeout(() => {
          this.otpInputs.toArray()[5].nativeElement.focus()
        }, 0)
      }
    }

    this.checkFormValidity()
  }

  checkFormValidity() {
    // Check if all digits are filled
    let isComplete = true
    for (let i = 0; i < 6; i++) {
      const control = this.otpForm.get(`digit${i}`)
      if (!control || !control.value) {
        isComplete = false
        break
      }
    }

    if (isComplete) {
      // Mark all controls as touched to trigger validation
      Object.keys(this.otpForm.controls).forEach((key) => {
        this.otpForm.get(key)?.markAsTouched()
      })
    }
  }

  getOtpValue(): string {
    let otp = ""
    for (let i = 0; i < 6; i++) {
      otp += this.otpForm.get(`digit${i}`)?.value || ""
    }
    return otp
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = this.getOtpValue()
      // In a real app, you would call a service to verify OTP
      this.userService.verifyOtp(this.phoneNumber, otp).subscribe({
        next: () => {
          this.router.navigate(['/reset-password'], {
            state: { phoneNumber: this.phoneNumber },
            queryParams: { step: 3 }
          });
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  resendOtp() {
    this.userService.initiatePasswordReset(this.phoneNumber).subscribe({
      next: () => {
        // Show resend success message
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }


}
