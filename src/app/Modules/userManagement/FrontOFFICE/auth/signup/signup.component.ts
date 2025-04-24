import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators, AbstractControl, FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterLink} from '@angular/router';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {animate, style, transition, trigger} from "@angular/animations";
import {FaceAuthComponent} from "../face-auth/face-auth.component";
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FaceService} from "../../services/face.service";
import {CameraService} from "../../services/camera.service";
import {FaceCaptureModalComponent} from "../face-capture-modal/face-capture-modal.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgOptimizedImage, FormsModule, FaceAuthComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class SignupComponent implements AfterViewInit ,OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  formSubmitted = false;
  isLoading = false;
  serverError = '';
  isFetchingLocation = false;
  locationError = '';
  geolocationUnavailable = false;
  currentStep = 1;
  totalSteps = 4;
  transitionDirection: 'left' | 'right' = 'right';
  showSuccessMessage = false;
  successMessage = '';
  userId: number | null = null;
  isCameraActive = false;
  isCapturingFace = false;
  faceImages: string[] = [];
  showFaceCaptureModal = false;
  registrationInProgress = false;
  captureProgress = 0;
  currentCapture = 0;
  totalCaptures = 5;
  captureMessages = [
    "Look straight ahead",
    "Turn slightly left",
    "Turn slightly right",
    "Look up slightly",
    "Smile for the camera"
  ];
  currentMessage: string = '';
  isSubmitting = false;
  errorMessage = '';
  capturedImages: string[] = [];
  isCapturing = false;

  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator()
    ]],
    confirmPassword: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, this.phoneValidator]],
    address: this.fb.group({
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    })
  }, {
    validators: this.passwordMatchValidator
  });
  showFaceReg: boolean = false;
  toggleFaceReg() {
    this.showFaceReg = !this.showFaceReg;
    if (this.showFaceReg) {
      setTimeout(() => this.initializeCamera(), 100);
    } else {
      this.closeFaceCapture();
    }
  }
  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private faceService: FaceService,
    private cameraService: CameraService,
    // private dialogRef: MatDialogRef<SignupComponent>


  ) {}

  ngOnInit() {
    this.autoFillAddress();
  }

  autoFillAddress() {
    this.isFetchingLocation = true;
    this.locationError = '';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.getAddressFromCoordinates(lat, lon);
        },
        error => {
          this.isFetchingLocation = false;
          this.locationError = "Unable to fetch location. You can still enter it manually.";
          console.error("Geolocation error:", error);
        }
      );
    } else {
      this.isFetchingLocation = false;
      this.locationError = "Geolocation not supported.";
      console.error("Geolocation is not supported by this browser.");
    }
  }

  getAddressFromCoordinates(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    this.http.get<any>(url).subscribe(response => {
      const address = response.address;

      this.signupForm.get('address')?.patchValue({
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        country: address.country || '',
        zipCode: address.postcode || ''
      });

      this.isFetchingLocation = false;
    }, error => {
      this.isFetchingLocation = false;
      this.locationError = "Could not fetch address from location.";
      console.error("Error fetching address:", error);
    });
  }

  phoneValidator(control: AbstractControl) {
    const valid = /^\d{8}$/.test(control.value);
    return valid ? null : { invalidPhone: true };
  }

  passwordValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;

      const errors: any = {};
      if (!/(?=.*[a-z])/.test(value)) errors.lowercase = true;
      if (!/(?=.*[A-Z])/.test(value)) errors.uppercase = true;
      if (!/(?=.*\d)/.test(value)) errors.number = true;
      if (!/(?=.*[@$!%*?&])/.test(value)) errors.specialChar = true;

      return Object.keys(errors).length ? errors : null;
    };
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }



  // onSubmit(): void {
  //   this.formSubmitted = true;
  //   if (this.signupForm.invalid) {
  //     return;
  //   }
  //
  //   this.isLoading = true;
  //   this.serverError = '';
  //
  //   const formData = this.signupForm.value;
  //   const registrationData = {
  //     ...formData,
  //     faceImages: this.faceImages
  //   };
  //
  //   this.authService.signup(registrationData).subscribe({
  //     next: (response) => {
  //       this.isLoading = false;
  //       this.userId = response.userId;
  //       this.showSuccessMessage = true;
  //       this.successMessage = 'Registration successful!';
  //       setTimeout(() => {
  //         this.router.navigate(['/dashboard']);
  //       }, 2000);
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       this.serverError = error.message || 'Registration failed. Please try again.';
  //     }
  //   });
  // }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.serverError = '';

    const formData = this.signupForm.value;
    const registrationData = {
      ...formData,
      faceImages: this.faceImages
    };

    this.authService.signup(registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/verify-email'], {
          queryParams: { email: formData.email }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.serverError = error.message || 'Registration failed. Please try again.';
      }
    });
  }


  private registerFaceImages(userId: number): void {
    this.faceService.registerFace(userId, this.faceImages).subscribe({
      next: () => {
        this.router.navigate(['/verify-email']);
      },
      error: (error) => {
        console.error('Face registration failed, but user was created', error);
        this.router.navigate(['/verify-email']);
      }
    });
  }


  shouldShowError(field: string): boolean {
    const control = this.signupForm.get(field);
    return !!control && (control.touched || this.formSubmitted) && control.invalid;
  }

  getPasswordErrors(): string {
    const control = this.signupForm.get('password');
    const errors = control?.errors;
    if (!errors || !control?.touched) return '';

    const messages = [];
    if (errors['required']) return 'Password is required';
    if (errors['minlength']) messages.push('at least 8 characters');
    if (errors['lowercase']) messages.push('1 lowercase letter');
    if (errors['uppercase']) messages.push('1 uppercase letter');
    if (errors['number']) messages.push('1 number');
    if (errors['specialChar']) messages.push('1 special character (@$!%*?&)');

    return messages.length ? `Include: ${messages.join(', ')}` : '';
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  openFaceRegister(userId: number | null) {
    if (!userId) {
      console.error('userId is required but not provided!');
      return;
    }

    const dialogRef = this.dialog.open(FaceAuthComponent);
    dialogRef.componentInstance.userId = userId;  // Ensure userId is passed
    dialogRef.componentInstance.isLoginMode = false;
  }

  ngAfterViewInit(): void {
    // View initialization complete
  }

  async registerWithFace(): Promise<void> {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.showFaceCaptureModal = true;
    // Small delay to ensure modal is rendered
    setTimeout(() => this.initializeCamera(), 100);
  }

  async initializeCamera(): Promise<void> {
    try {
      this.isCameraActive = await this.cameraService.initializeCamera(this.videoElement.nativeElement);
      if (!this.isCameraActive) {
        throw new Error('Camera initialization failed');
      }
    } catch (error) {
      console.error('Failed to initialize camera:', error);
      this.showFaceCaptureModal = false;
      alert('Could not access camera. Please try again or continue without Face ID.');
    }
  }

  async captureFaceImages(): Promise<void> {
    if (!this.isCameraActive || this.isCapturing) return;

    this.isCapturing = true;
    this.capturedImages = [];
    this.currentCapture = 0;

    for (let i = 0; i < this.totalCaptures; i++) {
      this.currentCapture = i + 1;
      this.captureProgress = (this.currentCapture / this.totalCaptures) * 100;
      this.currentMessage = this.captureMessages[i];

      // Wait a moment to let user adjust
      await this.delay(1000);

      // Capture the image
      const img = this.cameraService.captureImage();
      if (img) {
        this.capturedImages.push(img);
      }

      // Wait between captures (except after last one)
      if (i < this.totalCaptures - 1) {
        await this.delay(1000);
      }
    }

    this.isCapturing = false;
  }



  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  // toggleFaceCapture(): void {
  //   const enableFaceId = this.signupForm.get('enableFaceId')?.value;
  //
  //   if (enableFaceId) {
  //     this.openFaceCaptureModal();
  //   } else {
  //     this.faceImages = [];
  //   }
  // }
  // openFaceCaptureModal(): void {
  //   const dialogRef = this.dialog.open(FaceCaptureModalComponent, {
  //     width: '600px',
  //     disableClose: true
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.faceImages = result;
  //     } else {
  //       this.signupForm.get('enableFaceId')?.setValue(false);
  //       this.faceImages = [];
  //     }
  //   });
  // }
  // completeRegistrationWithFace(): void {
  //   this.registrationInProgress = true;
  //   const formData = this.signupForm.value;
  //
  //   this.faceService.registerWithFace(formData, this.faceImages).subscribe({
  //     next: (response) => {
  //       this.registrationInProgress = false;
  //       this.cameraService.stopCamera();
  //       this.router.navigate(['/dashboard']); // Or wherever you want to redirect
  //     },
  //     error: (err) => {
  //       console.error('Registration with Face ID failed:', err);
  //       // Fallback to normal registration
  //       this.registerWithoutFace();
  //     }
  //   });
  // }



  closeFaceCapture(): void {
    this.showFaceCaptureModal = false;
    this.cameraService.stopCamera();
    this.isCameraActive = false;
    this.isCapturingFace = false;
  }


  ngOnDestroy(): void {
    this.cameraService.stopCamera();
  }



  // openFaceCapture(): void {
  //   this.showFaceCaptureModal = true;
  //   setTimeout(() => this.initializeCamera(), 100);
  // }

  openFaceCapture(): void {
    const dialogRef = this.dialog.open(FaceCaptureModalComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.faceImages = result;
      }
    });
  }
}
