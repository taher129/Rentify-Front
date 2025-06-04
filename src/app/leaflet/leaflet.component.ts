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
    city: 'Tunis',
    state: 'El Menzah 6',
    country: 'Tunisia',
    zipCode: '1002'
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
    const defaultCoords = L.latLng(36.8350, 10.1476);

    this.map = L.map('map', {
      center: defaultCoords,
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Add marker to the map
    this.addMarker(defaultCoords);
  }

  private addMarker(coords: L.LatLng) {
    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [32, 32],        // size of the icon
      iconAnchor: [16, 32],      // point of the icon which will correspond to marker's location
      popupAnchor: [0, -32]      // point from which the popup should open relative to the iconAnchor
    });

    L.marker(coords, { icon: customIcon })
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
