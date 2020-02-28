import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ResourceService } from "./resource.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  title = "satisfactory-planner";

  constructor(private resourceService: ResourceService) {}

  ngAfterViewInit(): void {
    this.resourceService.getResources().subscribe(data => console.log(data));
  }
}
