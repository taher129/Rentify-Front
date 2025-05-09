import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [],
  templateUrl: './oauth2-redirect.component.html',
  styleUrl: './oauth2-redirect.component.css'
})
export class Oauth2RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const role = params['role'];

      if (token && role) {
        this.authService.setToken(token);
        this.authService.setRole(role);

        this.authService.getUserDetailsFromServer().subscribe(() => {
          this.router.navigate(['/home']);
        });
      } else {
        this.router.navigate(['/visit']);
      }
    });
  }
}
