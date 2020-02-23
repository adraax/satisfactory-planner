import { Component } from '@angular/core';
import { ResourceService } from './resource.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'satisfactory-planner';

  constructor(private resourceService: ResourceService) {}
}
