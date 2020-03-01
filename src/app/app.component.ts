import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ResourceService } from "./resource.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "satisfactory-planner";
  resources = [];
  resourcesName = [];
  output = {};

  /** control for the selected resource */
  public resourceCtrl: FormControl = new FormControl();
  public resourceNumberCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public resourceFilterCtrl: FormControl = new FormControl();

  /** list of resources filtered by search keyword */
  public filteredresources: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;
  @ViewChild("singleSelect", { static: true }) numberInput: MatInput;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resourceService.getResources().subscribe((data: any) => {
      if ("resources" in data) {
        this.resources = data.resources;
        this.resourcesName = Object.keys(this.resources);
        this.initSelect();
      }
    });
  }

  initSelect() {
    this.resourceCtrl.setValue(this.resourcesName.sort());
    this.resourceNumberCtrl.setValue(1);
    this.filteredresources.next(this.resourcesName.slice());

    // listen for search field value changes
    this.resourceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterResources();
      });
  }

  protected filterResources() {
    if (!this.resources) {
      return;
    }
    // get the search keyword
    let search = this.resourceFilterCtrl.value;
    if (!search) {
      this.filteredresources.next(this.resourcesName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredresources.next(
      this.resourcesName.filter(
        resource => resource.toLowerCase().indexOf(search) > -1
      )
    );
  }

  calculate() {
    console.log(this.singleSelect.value);
  }
}
