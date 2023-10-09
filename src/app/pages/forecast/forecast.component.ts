import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { List, WeatherForecastDetails } from 'src/app/model';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  zipcode!: string;
  weatherForecastDetails!: WeatherForecastDetails;

  constructor(private weatherService: WeatherService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.zipcode = this.route.snapshot.params['zipcode'];
    console.log('zipcode:: ', this.zipcode);
    this.fetchFiveDaysWeatherForecastByZipcode(this.zipcode);
  }

  fetchFiveDaysWeatherForecastByZipcode(zipcode: string): void {
    this.weatherService.fetchDailyWeatherForecastByZipcode(zipcode, 5).subscribe((response: WeatherForecastDetails) => {
      console.log('response:: ', response);
      this.weatherForecastDetails = response;
      this.weatherForecastDetails.list.forEach(forecast => {
        forecast.day = this.getDay(forecast.dt);
      });
    });
  }

  getDay(unixTimestamp: number): string {
    console.log(unixTimestamp);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const date = new Date(unixTimestamp * 1000);
    const day = date.getDay();
    const month = date.getMonth();
    console.log(date);
    return dayNames[day] + ', ' + monthNames[month] + ' ' + date.getDate();
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

  navigateToHome(): void {
    this.router.navigateByUrl('/home');
  }

}
