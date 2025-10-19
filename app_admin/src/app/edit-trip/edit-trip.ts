import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule }
from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';


@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})

export class EditTripComponent implements OnInit {

  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message : string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit() : void{

    // Retrieve stashed trip ID
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    })

this.tripDataService.getTrip(tripCode)
  .subscribe({
    next: (value: any) => {
      this.trip = value[0];
      
      // Format the date for the input field
      let startDate = '';
      if (value[0].start) {
        startDate = new Date(value[0].start).toISOString().split('T')[0];
      }
      
      // Populate our record into the form
      this.editForm.patchValue({
        _id: value[0]._id,
        code: value[0].code,
        name: value[0].name,
        length: value[0].length,
        start: startDate,  // Use the formatted date
        resort: value[0].resort,
        perPerson: value[0].perPerson,
        image: value[0].image,
        description: value[0].description
      });
      
      if(!value)
      {
        this.message = 'No Trip Retrieved!';
      }
      else{
        this.message = 'Trip: ' + tripCode + ' retrieved';
      }
      console.log(this.message);
    },
          error: (error: any) => {
            console.log('Error: ' + error);
        }
      })
  }

  public onSubmit()
  {
    this.submitted = true;

    if(this.editForm.valid)
    {
      this.tripDataService.updateTrip(this.editForm.value)
      .subscribe({
        next: (value: any) => {
            console.log(value);
            this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
    }
  }

  // get the form short name to access the form fields
  get f() { return this.editForm.controls; }
}


