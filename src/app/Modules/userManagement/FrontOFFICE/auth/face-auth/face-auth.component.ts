import {AfterViewInit, Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import EventEmitter from "node:events";
import {FaceAuthService} from "../../services/face-auth.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-face-auth',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './face-auth.component.html',
  styleUrl: './face-auth.component.css'
})
export class  FaceAuthComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  @Input() userId!: number | null;

  isCameraActive = false;
  isLoginMode = false;
  isProcessing = false;

  ngOnInit() {
    if (this.userId === null) {
      console.error('userId is missing in FaceAuthComponent');
    }
  }
  constructor(private faceService: FaceAuthService) {}

  startCamera(): void {
    this.isCameraActive = true;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(err => {
        alert('Unable to access camera 😕');
        console.error(err);
      });
  }

  stopCamera(): void {
    const stream = this.videoElement.nativeElement.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track: any) => track.stop());
    }
    this.isCameraActive = false;
  }

  captureAndSendFace(): void {
    this.isProcessing = true;

    const canvasEl = this.canvas.nativeElement;
    const videoEl = this.videoElement.nativeElement;

    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    const base64Image = canvasEl.toDataURL('image/jpeg');

    if (!this.userId || this.userId <= 0) {
      alert('❗ Cannot continue — user ID is missing.');
      this.isProcessing = false;
      return;
    }

    if (this.isLoginMode) {
      this.faceService.loginWithFace(this.userId, base64Image).subscribe({
        next: () => {
          alert('✅ Face login successful');
          this.stopCamera();
        },
        error: (err) => {
          console.error(err);
          alert('❌ Face not recognized');
        },
        complete: () => this.isProcessing = false
      });
    } else {
      this.faceService.registerFace(this.userId, [base64Image]).subscribe({
        next: () => {
          alert('✅ Face registered successfully');
          this.stopCamera();
        },
        error: (err) => {
          console.error(err);
          alert('❌ Face registration failed');
        },
        complete: () => this.isProcessing = false
      });
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }
}
