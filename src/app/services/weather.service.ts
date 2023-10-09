import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { List, WeatherDetails, WeatherForecastDetails } from '../model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private appId = '5a4b2d457ecbef9eb2a71e480b947604';
  private units = 'metric';
  private countryCode = 'us';
  
  constructor(private htppClient: HttpClient) { }

  fetchWeatherDetailsByZipcode(zipcode: string): Observable<WeatherDetails> {
    return this.htppClient.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${this.appId}&units=${this.units}`) as Observable<WeatherDetails>;
  }

  fetchDailyWeatherForecastByZipcode(zipcode: string, count: number): Observable<WeatherForecastDetails> {
    return this.htppClient.get<WeatherForecastDetails>(`https://api.openweathermap.org/data/2.5/forecast/daily?zip=${zipcode},${this.countryCode}&appid=${this.appId}&units=${this.units}&cnt=${count}`);
  }
}
