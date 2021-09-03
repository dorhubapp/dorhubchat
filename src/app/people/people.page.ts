/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { RestService, SOCKET, USER } from '../services/rest.service';
import { StorageService } from '../services/storage.service';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-people',
  templateUrl: 'people.page.html',
  styleUrls: ['people.page.scss'],
})
export class PeoplePage implements OnInit {
  socket: any;
  people: any;
  user: any;

  constructor(
    private rest: RestService,
    private router: Router,
    private alertServ: AlertService,
    private storageServ: StorageService
  ) {
    this.socket = io(SOCKET);
  }

  ngOnInit() {
    this.getPeople();

    this.socket.on('refreshPage', () => {
      this.getPeople();
    });
  }

  login() {
    const btn = [{ type: 'text', placeholder: 'Telephone', name: 'telephone' }];
    this.alertServ
      .requestAlert(
        'Kindly enter your phone number',
        'Login User',
        'Cancel',
        'Login',
        btn
      )
      .then((res) => {
        if (res.role === 'ok') {
          const telephone = +res.data.values.telephone;
          this.rest.getOne('users/telephone/', telephone).subscribe(
            (result) => {
              if (result.status === 'success') {
                this.storageServ.store(USER, result.data);
                this.socket.emit('refresh', {});
              }
            },
            (err) => console.error(err)
          );
        }
      });
  }

  getPeople() {
    this.storageServ.get(USER).then((response) => {
      if (response === false) {
        this.login();
      } else {
        this.user = response;
        this.rest.getAll('users').subscribe(
          (res) => {
            if (res.status === 'success') {
              _.remove(res.data, { _id: response._id });
              this.people = res.data;
            }
          },
          (err) => console.error(err)
        );
      }
    });
  }

  viewPerson(user) {
    this.router.navigate(['/person', JSON.stringify(user)]);
  }
}
