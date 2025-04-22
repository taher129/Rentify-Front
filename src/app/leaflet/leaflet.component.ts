import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css'],
  standalone: true
})
export class LeafletComponent implements AfterViewInit, OnDestroy {
  @Input() address: any = {
    city: 'Gabes',
    state: 'Metouia',
    country: 'Tunisia',
    zipCode: '6010'
  };

  private map!: L.Map;

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  private initMap() {
    // Default coordinates (Gabes, Tunisia)
    const defaultCoords = L.latLng(33.8815, 10.0982);

    this.map = L.map('map', {
      center: defaultCoords,
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Add marker to the map
    this.addMarker(defaultCoords);
  }

  private addMarker(coords: L.LatLng) {
    L.marker(coords)
      .addTo(this.map)
      .bindPopup(this.getPopupContent())
      .openPopup();
  }

  private getPopupContent(): string {
    return `
      <div>
        <strong>${this.address.city || 'Unknown city'}</strong><br>
        ${[this.address.state, this.address.country].filter(Boolean).join(', ')}<br>
        ${this.address.zipCode || ''}
      </div>
    `;
  }
}
