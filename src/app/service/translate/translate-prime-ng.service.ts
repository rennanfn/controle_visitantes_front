import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatePrimeNGService {

  constructor(
    private http: HttpClient
  ) { }


  getTranslate(lang: string) {
    const url = 'assets/l18n';
    return this.http.get<any>(`${url}/${lang}.json`)
      .toPromise()
      .then( res => <any>res.primeng)
      .then( data => { return data} );
  }
}
