import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

const newLocal: string = `
    .title {
      font-weight:bold;
      font-size: 24px;
    }
    .about-card {
      display: grid;
      justify-content: center;
      text-align: center;
    }
    .subheader{
      font-size: 46px;
      color:darkcyan;
      padding-top: 50px;
      padding-bottom: 50px
    }
  `;

@Component({
  selector: "about",
  styles: [
    newLocal
  ],
  template: `
    <div class="about-card">
      <p class="subheader">
        CRM-APP
      </p>
    </div>

  `
})
export class AboutComponent implements OnInit {
  public localState: any;
  pageTitle: string = "About";

  constructor(public route: ActivatedRoute) { }

  public ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.localState = data.yourData;
    });

  }

}
