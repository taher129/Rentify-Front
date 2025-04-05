import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  insuranceDetails = [
    {
      category: 'Items',
      coverage: 'All items insured up to CHF 15,000.',
      premium: 'Borrowers pay an insurance premium per rental.',
      depreciation: 'Up to 24 months: new value, then current value.',
      handlingFee: '10% handling fee, min CHF 100.',
    },
    {
      category: 'Vehicles',
      coverage: 'Cars, motorcycles, vans, campers insured up to CHF 100,000.',
      premium: 'Borrowers pay an insurance premium per rental.',
      check: 'Vehicles are checked at each handover.',
      deductible: 'Liability damage/accident: deductible CHF 1,000.',
    },
  ];

  getInsuranceDetails() {
    return this.insuranceDetails;
  }
}
