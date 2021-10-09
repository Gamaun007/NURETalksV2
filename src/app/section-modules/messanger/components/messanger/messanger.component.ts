import { AuthService } from 'core/modules/auth-core/services';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'core/models/domain';

@Component({
  selector: 'app-messanger',
  templateUrl: './messanger.component.html',
  styleUrls: ['./messanger.component.scss'],
})
export class MessangerComponent implements OnInit {
  user$: Observable<User>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUserObservable();

    this.user$.subscribe((user) => {
      console.log('User returned', user);
    });
  }
}
