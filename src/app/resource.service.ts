import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resources;

  constructor() {
    this.resources = require('./resources.jsonc');
    console.log(this.resources);
  }
}
