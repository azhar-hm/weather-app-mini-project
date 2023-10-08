import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List } from 'src/app/model';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  zipcode!: string;
  forecastList: List[] = [];

  constructor(private weatherService: WeatherService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.zipcode = this.route.snapshot.params['zipcode'];
    console.log('zipcode:: ', this.zipcode);
    this.fetchFiveDaysWeatherForecastByZipcode(this.zipcode);
  }

  fetchFiveDaysWeatherForecastByZipcode(zipcode: string): void {
    this.weatherService.fetchFiveDaysWeatherForecastByZipcode(zipcode).subscribe((response: List[]) => {
      console.log('response:: ', response);
      this.forecastList = response;
      this.forecastList.forEach(forecast => {
        forecast.day = this.getDay(forecast.dt);
      });
    });
  }

  getDay(unixTimestamp: number): string {
    console.log(unixTimestamp);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(unixTimestamp * 1000);
    const day = date.getDay();
    const month = date.getMonth();
    console.log(date);
    return dayNames[day] + ' ' + month;
  }

}
