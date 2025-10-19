import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service'; // Added for delete fucntion
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})

export class TripCardComponent implements OnInit {

  @Input('trip') trip: any;

  constructor(
    private router: Router,
    private tripDataService: TripDataService, 
    private authenticationService: AuthenticationService, 
  ) {}

  ngOnInit(): void {
  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(trip: Trip) {
    // Add confirmation dialog
    if (confirm(`Are you sure you want to delete the trip: ${trip.name}?`)) {
      this.tripDataService.deleteTrip(trip.code)
        .subscribe({
          next: (value: any) => {
            console.log('Trip deleted:', value);
            // Reload the page to refresh the trip list
            window.location.reload();
          },
          error: (error: any) => {
            console.log('Error: ' + error);
            alert('Failed to delete trip');
          }
        });
    }
  }

  public isLoggedIn()
  {
    return this.authenticationService.isLoggedIn();
  }

}
