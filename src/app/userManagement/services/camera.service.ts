import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;


  initializeCamera(videoElement: HTMLVideoElement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            this.videoElement = videoElement;
            this.stream = stream;
            this.videoElement.srcObject = stream;
            this.videoElement.play();
            resolve(true);
          })
          .catch(err => {
            console.error('Camera error:', err);
            reject(false);
          });
      } else {
        reject(false);
      }
    });
  }

  captureImage(): string | null {
    if (!this.videoElement) return null;

    const canvas = document.createElement('canvas');
    // Reduce size for storage
    canvas.width = 640;  // Reduced from original video size
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      // Use lower quality (0.7) to reduce size
      return canvas.toDataURL('image/jpeg', 0.7);
    }
    return null;
  }
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }
}
