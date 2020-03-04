import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatInput } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ResourceService } from "./resource.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
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
  @ViewChild("numberInput", { static: true }) numberInput: MatInput;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();

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

  ngOnDestroy() {
    this.onDestroy.next();
  }

  initSelect() {
    this.resourceCtrl.setValue(this.resourcesName.sort());
    this.resourceNumberCtrl.setValue(1);
    this.filteredresources.next(this.resourcesName.slice());

    // listen for search field value changes
    this.resourceFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
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
    console.log(
      this.getRequirements(
        this.singleSelect.value,
        parseInt(this.resourceNumberCtrl.value, 10)
      )
    );
  }

  private getRequirements(resource, demand) {
    const obj: any = {};

    obj.from = this.resources[resource].from;
    obj.name = resource;
    if (obj.from === "miner") {
      delete obj.from;
      obj.quantity = demand;
      return obj;
    } else {
      obj.quantity = demand / this.resources[resource].rate;

      for (const req of this.resources[resource].require) {
        if (!("children" in obj)) {
          obj.children = [];
        }

        obj.children.push(
          this.getRequirements(req.item, req.quantity * obj.quantity)
        );
      }

      return obj;
    }
  }
}
