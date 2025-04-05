import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sustainability',
  standalone: true,
  imports: [],
  templateUrl: './sustainability.component.html',
  styleUrls: ['./sustainability.component.css']
})
export class SustainabilityComponent implements OnInit {
  // Animation triggers should be defined here inside the component class
  // or moved to a separate animations file
  fadeIn = trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]);
    
  zoomIn = trigger('zoomIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.6)' }),
      animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ])
  ]);

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }
}