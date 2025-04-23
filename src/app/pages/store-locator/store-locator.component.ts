import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-store-locator',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker],
  templateUrl: './store-locator.component.html',
  styleUrl: './store-locator.component.css'
})
export class StoreLocatorComponent {
  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
  zoom = 12;

  markers = [
    { position: { lat: 48.8566, lng: 2.3522 }, label: 'Paris - Centre' },
    { position: { lat: 48.8738, lng: 2.2950 }, label: 'Champs-Élysées' },
    { position: { lat: 48.8584, lng: 2.2945 }, label: 'Tour Eiffel' }
  ];
}
