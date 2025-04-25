import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  shareOnFacebook(url: string): void {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnTwitter(url: string, text: string): void {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnLinkedIn(url: string): void {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnInstagram(): void {
    // Note: Instagram doesn't support direct sharing via URL
    alert('Copy the link and share it on Instagram manually');
  }
}
