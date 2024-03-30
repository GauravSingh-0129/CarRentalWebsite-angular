import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

const BASIC_URL = ["http://localhost:8080"];

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }
  
  getAllCars(): Observable<any>{
    return this.http.get(BASIC_URL + "/api/customer/cars", {
      headers : this.createAuthorization()
    });
  }

  createAuthorization(): HttpHeaders{
    let authHeaders : HttpHeaders = new HttpHeaders();
    console.log(StorageService.getToken())
    return authHeaders.set('Authorization', 'Bearer ' + StorageService.getToken()
    );
  }
}
