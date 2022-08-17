import {
  Component,
  EventEmitter,
  OnInit,
  Output} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AuthenticationService } from "../_services";

@Component({
  selector: "login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  @Output() isAuth = new EventEmitter<boolean>();
  model: any = {};
  isValidating = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.model.username = "Admin@test.com";
    this.model.password = "password";
    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] || "loading";
  }

  login() {
    this.isValidating = true;
    this.authenticationService.login(this.model).subscribe(
      error => {
        console.log(error);
        this.isValidating = false;
      },
      ()=>{
        this.isValidating = false;
        this.isAuth.emit(true);
        this.router.navigate([this.returnUrl]);
      }
    );
  }
}
