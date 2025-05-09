import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators, AbstractControl, FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterLink} from '@angular/router';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatDialog} from '@angular/material/dialog';
import {CameraService} from "../../services/camera.service";
import {CarouselComponent} from "../login/carousel/carousel.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgOptimizedImage, FormsModule, CarouselComponent],
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
  showSuccessMessage = false;
  successMessage = '';
  isCameraActive = false;
  isCapturingFace = false;
  showFaceCaptureModal = false;
  registrationInProgress = false;
  captureProgress = 0;
  currentCapture = 0;

  currentMessage: string = '';



  totalCaptures = 5;
  faceImages: string[] = [];
  captureInstructions = [
    "Look straight ahead",
    "Turn slightly left",
    "Turn slightly right",
    "Look up slightly",
    "Smile naturally"
  ];
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
    private cameraService: CameraService,
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
        this.showSuccessMessage = true;
        this.successMessage = 'Registration successful! Please check your email to verify your account.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.serverError = error.message || 'Registration failed. Please try again.';
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
////////////////////

  showPasswordSuggestion = false;
  suggestedPassword = this.generateStrongPassword();
  rememberMe = false;

  hideSuggestionTimeout: any;

  hideSuggestionDelayed() {
    this.hideSuggestionTimeout = setTimeout(() => {
      this.showPasswordSuggestion = false;
    }, 200); // Delay to allow click
  }

  applySuggestedPassword(event: MouseEvent) {
    event.preventDefault();
    const passwordControl = this.signupForm.get('password');
    const confirmControl = this.signupForm.get('confirmPassword');

    if (passwordControl && confirmControl) {
      passwordControl.setValue(this.suggestedPassword);
      confirmControl.setValue(this.suggestedPassword);
    }

    this.showPasswordSuggestion = false;
  }

  generateStrongPassword(): string {
    const length = 12;

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "@$!%*?&";
    const allChars = lowercase + uppercase + numbers + special;

    let password = '';
    // Ensure at least one of each required type
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));

    // Fill the rest with random characters
    for (let i = password.length; i < length; ++i) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle to avoid predictable order
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }


  cancelHideSuggestion() {
    if (this.hideSuggestionTimeout) {
      clearTimeout(this.hideSuggestionTimeout);
    }
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




  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  closeFaceCapture(): void {
    this.showFaceCaptureModal = false;
    this.cameraService.stopCamera();
    this.isCameraActive = false;
    this.isCapturingFace = false;
  }



  copySuggestedPassword(event: MouseEvent): void {
    event.stopPropagation(); // prevent triggering applySuggestedPassword
    navigator.clipboard.writeText(this.suggestedPassword).then(() => {
      console.log('Password copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy password: ', err);
    });
  }






  flashCameraEffect() {
    const preview = document.querySelector('.camera-preview') as HTMLElement;
    if (!preview) return;
    preview.style.animation = 'flash 0.2s';
    setTimeout(() => preview.style.animation = '', 200);
  }





  openFaceCaptureModal(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.showFaceCaptureModal = true;
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

  startCapture() {
    if (!this.isCameraActive) return;
    this.isCapturingFace = true;
    this.faceImages = [];
    this.currentCapture = 0;
    this.captureNextImage();
  }


  captureNextImage(): void {
    if (this.currentCapture >= this.totalCaptures) {
      this.completeCapture();
      return;
    }

    this.currentMessage = this.captureInstructions[this.currentCapture];
    this.captureProgress = (this.currentCapture / this.totalCaptures) * 100;

    setTimeout(() => {
      this.captureImage();
      this.currentCapture++;
      this.captureNextImage();
    }, 3000);
  }


  captureImage(): void {
    const canvas = document.createElement('canvas');
    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      this.faceImages.push(dataUrl);
      this.flashCameraEffect();
    }
  }

  completeCapture(): void {
    this.isCapturingFace = false;
    this.captureProgress = 100;
    setTimeout(() => {
      this.showFaceCaptureModal = false;
      // Now submit the form with face images
      this.onSubmit();
    }, 1000);
  }


}
