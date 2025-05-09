import { Component, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIf } from "@angular/common";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-human-verification',
  template: `
    <div class="verification-container">
      <div class="verification-card">
        <div class="header">
          <h2 class="title">Human Verification</h2>
          <p class="subtitle" *ngIf="modelLoaded && cameraStarted">
            Please look at the camera and blink twice
          </p>
        </div>

        <div class="camera-wrapper">
          <div class="camera-container">
            <video #video autoplay muted playsinline></video>
            <div class="camera-overlay" [class.active]="verificationSuccess"></div>

            <div *ngIf="!cameraStarted" class="camera-placeholder">
              <mat-spinner color="primary" diameter="36"></mat-spinner>
              <p>Initializing camera...</p>
            </div>
          </div>
        </div>

        <div class="status-container">
          <div *ngIf="verificationResult" class="status-message"
               [class.success]="verificationSuccess">
            <div class="status-icon" *ngIf="verificationSuccess">✓</div>
            <span>{{ verificationResult }}</span>
          </div>

          <div *ngIf="!modelLoaded && !errorMessage" class="loading-message">
            <mat-spinner color="primary" diameter="20"></mat-spinner>
            <span>Loading AI model...</span>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            <span class="error-icon">!</span>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <div class="actions">
          <button *ngIf="errorMessage"
                  class="retry-button"
                  (click)="retry()">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinner,
    MatButtonModule
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .verification-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100%;
      padding: 24px;
      background-color: #fafafa;
    }

    .verification-card {
      background: white;
      border-radius: 28px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.04);
      padding: 40px;
      width: 100%;
      min-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
      width: 100%;
    }

    .title {
      margin: 0;
      color: #000;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .subtitle {
      margin: 12px 0 0;
      color: #555;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
    }

    .camera-wrapper {
      width: 100%;
      padding: 0;
      margin-bottom: 32px;
    }

    .camera-container {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 75%; /* 4:3 aspect ratio */
      border-radius: 24px;
      overflow: hidden;
      background: #f0f0f0;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 24px;
    }

    .camera-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      pointer-events: none;
      transition: all 0.5s ease;
      border: 2px solid transparent;
    }

    .camera-overlay.active {
      background-color: rgba(0, 0, 0, 0.05);
      border: 2px solid #000;
    }

    .camera-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: #f5f5f5;
      color: #555;
      font-size: 15px;
      border-radius: 24px;
    }

    .status-container {
      width: 100%;
      min-height: 64px;
      margin-bottom: 28px;
    }

    .status-message, .loading-message, .error-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px;
      border-radius: 18px;
      font-size: 15px;
      font-weight: 500;
      text-align: center;
      transition: all 0.3s ease;
    }

    .status-message {
      background: #f5f5f5;
      color: #333;
    }

    .status-message.success {
      background: #000;
      color: #fff;
    }

    .status-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: #fff;
      color: #000;
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
    }

    .loading-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #555;
      background: #f5f5f5;
      border-radius: 18px;
      padding: 16px;
    }

    .error-message {
      background: #f5f5f5;
      color: #d32f2f;
      border: 1px solid rgba(211, 47, 47, 0.2);
    }

    .error-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: #d32f2f;
      color: white;
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
    }

    .actions {
      width: 100%;
    }

    .retry-button {
      width: 100%;
      padding: 16px 24px;
      background-color: #000;
      color: white;
      border: none;
      border-radius: 18px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .retry-button:hover {
      background-color: #222;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .retry-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
      .verification-card {
        padding: 28px;
        border-radius: 24px;
      }

      .title {
        font-size: 24px;
      }

      .subtitle {
        font-size: 15px;
      }

      .camera-container,
      .camera-overlay,
      video {
        border-radius: 20px;
      }

      .status-message,
      .loading-message,
      .error-message,
      .retry-button {
        border-radius: 16px;
      }
    }
  `]
})
export class HumanVerificationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;

  modelLoaded = false;
  cameraStarted = false;
  verificationResult: string | null = null;
  verificationSuccess = false;
  errorMessage: string | null = null;

  private model: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private video!: HTMLVideoElement;
  private stream: MediaStream | null = null;
  private detectionInterval: any = null;
  private blinkCount = 0;
  private lastBlinkTime = 0;
  private eyesClosed = false;

  constructor(private dialogRef: MatDialogRef<HumanVerificationComponent>) {}

  async ngAfterViewInit() {
    this.video = this.videoElement.nativeElement;
    await this.initializeVerification();
  }

  async initializeVerification() {
    try {
      await Promise.all([
        this.loadModel(),
        this.startCamera()
      ]);
      this.modelLoaded = true;
      this.cameraStarted = true;
      this.startDetection();
    } catch (error) {
      console.error('Initialization error:', error);
      this.errorMessage = this.getErrorMessage(error);
    }
  }

  retry() {
    this.errorMessage = null;
    this.blinkCount = 0;
    this.verificationResult = null;
    this.verificationSuccess = false;
    this.initializeVerification();
  }

  private async loadModel() {
    await tf.setBackend('webgl');
    this.model = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: 'mediapipe',
        maxFaces: 1,
        refineLandmarks: true,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'
      }
    );
  }

  private async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      this.video.srcObject = this.stream;
      await new Promise((resolve) => {
        this.video.onloadedmetadata = resolve;
      });
      await this.video.play();
    } catch (error) {
      console.error('Camera error:', error);
      throw new Error('Camera access denied. Please enable permissions.');
    }
  }

  private startDetection() {
    this.verificationResult = "Looking for your face...";
    this.detectionInterval = setInterval(async () => {
      try {
        if (!this.model) return;
        const faces = await this.model.estimateFaces(this.video, { flipHorizontal: false });

        if (faces.length === 0) {
          this.verificationResult = "No face detected. Please look at the camera";
          return;
        }

        const face = faces[0];
        const isBlinking = this.checkForBlink(face.keypoints);

        if (isBlinking && !this.eyesClosed) {
          this.handleBlink();
        } else if (!isBlinking) {
          this.eyesClosed = false;
        }

        if (this.blinkCount >= 2) {
          this.handleVerificationSuccess();
        }
      } catch (error) {
        this.handleDetectionError(error);
      }
    }, 300);
  }

  private checkForBlink(keypoints: faceLandmarksDetection.Keypoint[]): boolean {
    const leftEyeIndices = [33, 160, 158, 133, 153, 144];
    const rightEyeIndices = [362, 385, 380, 374, 390, 263];
    const blinkThreshold = 0.15;

    const leftEyeOpenness = this.calculateEyeOpenness(keypoints, leftEyeIndices);
    const rightEyeOpenness = this.calculateEyeOpenness(keypoints, rightEyeIndices);

    return leftEyeOpenness < blinkThreshold && rightEyeOpenness < blinkThreshold;
  }

  private handleBlink() {
    this.eyesClosed = true;
    const now = Date.now();
    if (now - this.lastBlinkTime > 300) {
      this.blinkCount++;
      this.verificationResult = `Blinks detected: ${this.blinkCount}/2`;
      this.lastBlinkTime = now;
    }
  }

  private handleVerificationSuccess() {
    this.verificationResult = "Verification successful!";
    this.verificationSuccess = true;
    this.completeVerification(true);
  }

  private handleDetectionError(error: any) {
    console.error('Detection error:', error);
    this.errorMessage = "Error during detection. Please try again.";
    this.completeVerification(false);
  }

  private calculateEyeOpenness(keypoints: faceLandmarksDetection.Keypoint[], indices: number[]): number {
    const points = indices.map(i => keypoints[i]);
    if (points.length < 6) return 1;

    const topLid = points[1].y;
    const bottomLid = points[2].y;
    const eyeHeight = Math.abs(topLid - bottomLid);
    const eyeWidth = Math.abs(points[0].x - points[3].x);

    return eyeWidth > 0 ? eyeHeight / eyeWidth : 1;
  }

  private completeVerification(success: boolean) {
    this.stopDetection();
    setTimeout(() => {
      this.dialogRef.close(success);
    }, success ? 1500 : 0);
  }

  private stopDetection() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    this.stopCamera();
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.message.includes('camera')) {
      return 'Camera access denied. Please enable permissions.';
    } else if (error.message.includes('model')) {
      return 'Failed to load AI model. Check your connection.';
    }
    return 'An error occurred. Please try again.';
  }

  ngOnDestroy() {
    this.stopDetection();
  }
}
