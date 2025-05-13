import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripe: Stripe | null = null;
  private backendUrl = '/api/payments';

  async initializeStripe(): Promise<void> {
    // Ensure you're using your correct public key here.
    this.stripe = await loadStripe('pk_test_51Oo6YNBLhdhPWlxZbkFevDT8UpfxYrGjLOFG4a2sbKNKvqzSYsYqmDMoHuFz0aTBAfL3PoyyUGeWxvA4V1nM663B0077TyaYhT');
  }

  async createCheckoutSession(amount: number, productName: string, description: string, productId: number, userId: number, rentDuration: number, startDate: string, endDate: string): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          productName,
          description,
          productId,
          userId,
          rentDuration,
          startDate,
          endDate
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to create checkout session:', error);
      throw error;
    }
  }

  getStripeInstance(): Stripe | null {
    return this.stripe;
  }
}
