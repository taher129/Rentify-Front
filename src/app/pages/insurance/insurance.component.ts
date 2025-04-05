import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  insuranceDetails: any[] = [];

  constructor(private insuranceService: InsuranceService) {}

  ngOnInit() {
    this.insuranceDetails = this.insuranceService.getInsuranceDetails();
  }
}