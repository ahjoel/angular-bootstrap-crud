import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  apiurl = "http://localhost:3000/users";

  constructor(private _Http: HttpClient) { }

  getData(): Observable<any> {
    return this._Http.get(this.apiurl);
  }

  postdata(user:any){
    return this._Http.post(this.apiurl, user)
  }

  update(id:any, user:any){
    return this._Http.put(`${this.apiurl}/${id}`, user)
  }

  delete(id:any, user:any){
    return this._Http.delete(`${this.apiurl}/${id}`, user)
  }
}
