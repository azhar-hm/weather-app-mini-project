import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WeatherDetails } from 'src/app/model';
import { WeatherService } from 'src/app/services/weather.service';


export interface Location {
  zipcode: FormControl<string>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  locationForm!: FormGroup<Location>;
  weatherDetailsList: WeatherDetails[] = [];
  enteredZipcodes: string[] = [];

  constructor(private formBuilder: FormBuilder, private weatherService: WeatherService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveZipcodesFromSessionStorage();
    this.initializeFormGroup();
  }

  initializeFormGroup(): void {
    this.locationForm = this.formBuilder.nonNullable.group({
      zipcode: ['', [Validators.required]]
    });
  }

  addLocation(): void {
    console.log('addLocation: ', this.locationForm.value);
    this.getWeatherDetailsByZipcode(this.locationForm.get('zipcode')?.value);
  }

  getWeatherDetailsByZipcode(zipcode: string | undefined): void {
    if (zipcode) {
      this.weatherService.fetchWeatherDetailsByZipcode(zipcode).subscribe({
        next: (res: WeatherDetails) => {
          res.zipcode = zipcode;
          this.weatherDetailsList = [...this.weatherDetailsList, res];
          this.enteredZipcodes = [...this.enteredZipcodes, zipcode];
          this.addZipCodesToSessionStorage(this.enteredZipcodes);
          console.log('getWeatherDetailsByZipcode:: ', res);
        },
        error: (msg) => {
          console.log('Error getting weather details: ', msg);
        }
      });  
    }
  }

  addZipCodesToSessionStorage(zipcodes: string[]): void {
    sessionStorage.setItem('zipcodes', JSON.stringify(zipcodes));
  }

  retrieveZipcodesFromSessionStorage(): void {
    const zipcodes = sessionStorage.getItem('zipcodes');
    if (zipcodes) {
      console.log(zipcodes);
      this.loadWeatherDetails(JSON.parse(zipcodes));
    }
  }

  loadWeatherDetails(zipcodes: string[]): void {
    zipcodes.forEach(zipcode => {
      this.getWeatherDetailsByZipcode(zipcode);
    })
  }

  removeWeatherDetails(index: number) {
    console.log('removeWeatherDetails:: ', index);
    this.weatherDetailsList.splice(index, 1);
    this.removeWeatherDetailsFromSessionStorage(index);
    console.log('weatherDetailsList:: ', this.weatherDetailsList);
  }

  removeWeatherDetailsFromSessionStorage(index: number): void {
    const zipcodes = sessionStorage.getItem('zipcodes');
    if (zipcodes) {
      const existingEntries = JSON.parse(zipcodes);
      existingEntries.splice(index, 1);
      this.addZipCodesToSessionStorage(existingEntries);
    }
  }

  getIconPath(main: string): string {
    const iconPathBase: string = 'assets/icons/';
    switch (main) {
      case 'Rain':
        return iconPathBase + 'rain.png';
      case 'Snow':
        return iconPathBase + 'snow.png';
      case 'Sun':
        return iconPathBase + 'sun.png';
      case 'Clear':
        return iconPathBase + 'sun.png';
      case 'Clouds':
        return iconPathBase + 'clouds.png';  
      default:
        return '';
    }
  }

  getForecastLink(zipcode: string): string {
    return '/forecast/' + zipcode;
  }

}
