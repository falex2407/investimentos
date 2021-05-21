import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class GenericoService {

  constructor(private http: HttpClient) {

  }

  listInvestimentos(): Observable<any> {
    return this.http.get<any>(`http://www.mocky.io/v2/5e76797e2f0000f057986099`);
  }

}
