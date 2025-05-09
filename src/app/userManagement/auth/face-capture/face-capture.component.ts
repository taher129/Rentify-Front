import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {FaceService} from "../../services/face.service";
import {MatIcon} from "@angular/material/icon-module.d-BeibE7j0";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner.d-DRWEU4qb";
@Component({
  selector: 'app-face-capture',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    NgIf,
    MatProgressSpinner,
    NgForOf
  ],
  templateUrl: './face-capture.component.html',
  styleUrl: './face-capture.component.css'
})

export class FaceCaptureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraActive = false;
  isCapturing = false;
  capturedImages: string[] = [];
  currentStep = 0;
  progress = 0;
  errorMessage = '';

  private stream: MediaStream | null = null;
  protected readonly captureInstructions = [
    "Look straight at the camera",
    "Turn slightly to your left",
    "Turn slightly to your right",
    "Look up slightly",
    "Smile for the camera"
  ];
  protected readonly totalSteps = this.captureInstructions.length;

  constructor(private faceService: FaceService) {}

  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      this.videoElement.nativeElement.srcObject = this.stream;
      this.isCameraActive = true;
    } catch (err) {
      console.error('Camera access error:', err);
      this.errorMessage = 'Could not access camera. Please ensure permissions are granted.';
      this.isCameraActive = false;
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  startCapture() {
    if (!this.isCameraActive || this.isCapturing) return;

    this.isCapturing = true;
    this.capturedImages = [];
    this.currentStep = 0;
    this.progress = 0;
    this.captureNextImage();
  }

  private captureNextImage() {
    if (this.currentStep >= this.totalSteps) {
      this.completeCapture();
      return;
    }

    this.progress = (this.currentStep / this.totalSteps) * 100;

    setTimeout(() => {
      this.captureImage();
      this.currentStep++;
      this.captureNextImage();
    }, 2000); // 2 seconds between captures
  }

  private captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 and store
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    this.capturedImages.push(imageData);

    // Visual feedback
    this.flashEffect();
  }

  private flashEffect() {
    const videoContainer = this.videoElement.nativeElement.parentElement;
    if (videoContainer) {
      videoContainer.classList.add('flash');
      setTimeout(() => videoContainer.classList.remove('flash'), 200);
    }
  }

  private completeCapture() {
    this.isCapturing = false;
    this.progress = 100;

    // Here you would typically send the images to your backend
    // this.faceService.registerFace(this.userId, this.capturedImages).subscribe(...);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }

    this.isCameraActive = false;
  }

  retryCapture() {
    this.stopCamera();
    this.errorMessage = '';
    setTimeout(() => this.ngAfterViewInit(), 300);
  }

  completeRegistration() {

  }
}
