import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resources = new BehaviorSubject({});

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('/assets/resources.json').subscribe((data: any) => this.resources.next(data));
  }

  getResources() {
   return this.resources;
  }
}
