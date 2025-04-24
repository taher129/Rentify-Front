import {Component, ElementRef, ViewChild} from '@angular/core';
import {CameraService} from "../../services/camera.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-face-capture-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatProgressBar,
    MatDialogActions,
    NgIf,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './face-capture-modal.component.html',
  styleUrl: './face-capture-modal.component.css'
})
export class FaceCaptureModalComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;

  isCameraActive = false;
  isCapturing = false;
  capturedImages: string[] = [];
  captureMessages = [
    "Look straight ahead",
    "Turn slightly left",
    "Turn slightly right",
    "Look up slightly",
    "Smile for the camera"
  ];
  currentCapture = 0;
  captureProgress = 0;

  constructor(
    private dialogRef: MatDialogRef<FaceCaptureModalComponent>,
    private cameraService: CameraService
  ) {}

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  async initializeCamera(): Promise<void> {
    try {
      this.isCameraActive = await this.cameraService.initializeCamera(this.videoElement.nativeElement);
      if (!this.isCameraActive) {
        this.dialogRef.close();
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      this.dialogRef.close();
    }
  }

  async captureFaceImages(): Promise<void> {
    if (!this.isCameraActive || this.isCapturing) return;

    this.isCapturing = true;
    this.capturedImages = [];

    for (let i = 0; i < this.captureMessages.length; i++) {
      this.currentCapture = i;
      this.captureProgress = ((i + 1) / this.captureMessages.length) * 100;

      await this.delay(1000); // Give user time to adjust

      const image = this.cameraService.captureImage();
      if (image) {
        this.capturedImages.push(image);
      }
    }

    this.isCapturing = false;
  }

  completeCapture(): void {
    this.cameraService.stopCamera();
    this.dialogRef.close(this.capturedImages);
  }

  cancelCapture(): void {
    this.cameraService.stopCamera();
    this.dialogRef.close();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
