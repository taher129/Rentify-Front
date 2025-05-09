// human-verification.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {HumanVerificationComponent} from "../auth/human-verification/human-verification.component";

@Injectable({
  providedIn: 'root'
})
export class HumanVerificationService {
  constructor(private dialog: MatDialog) {}

  async verifyBlink(): Promise<boolean> {
    const dialogRef = this.dialog.open(HumanVerificationComponent, {
      width: '700px',
      disableClose: true,
      panelClass: 'human-verification-dialog',
      backdropClass: 'human-verification-backdrop'
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === true;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }
}
