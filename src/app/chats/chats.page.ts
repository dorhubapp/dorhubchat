/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMAGE, RestService, SOCKET, USER } from '../services/rest.service';
import _ from 'lodash';
import { StorageService } from '../services/storage.service';
import { AlertService } from '../services/alert.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss']
})
export class ChatsPage implements OnInit {
  socket: any;
  contentLoaded: any = false;
  chats: any;
  userId: any;
  userName: any;
  imgUrl: string;

  constructor(
    private rest: RestService,
    private router: Router,
    private storageServ: StorageService,
    private alertServ: AlertService
  ) {
    this.imgUrl = IMAGE;
    this.socket = io(SOCKET);
  }

  ngOnInit() {
    this.storageServ.get(USER).then((res) => {
      this.userId = res._id;
      this.userName = res.username;
      this.getChats();
    });

    this.socket.on('othersRefreshed', (message) => {
      this.storageServ.get(USER).then((res) => {
        this.userId = res._id;
        this.userName = res.username;
        this.getChats();
      });
    });
  }

  getChats() {
    this.rest.getOne('users/',this.userId).subscribe(async (res) => {
      console.log(res);
      if (res.status === 'success') {
        // _.remove(res.data.chat_list, { request_status: 0 });
        // _.remove(res.data.chat_list, { request_status: 2 });
        this.chats = res.data.chat_list;
        this.chats.forEach(element => {
          this.storageServ.get(`chat_${element.message_id._id}`).then(messages => {
            if (element.message_id.message.length === 0) {
              element.message_id.message = messages;
            }
          });
        });
        console.log(this.chats);
        // setTimeout(() => {
        //   this.checkIfRead(this.chats);
        // }, 3000);
        this.contentLoaded = true;
      }
    }, err => console.error(err));
  }

  accept(receiverId, messageId) {
    const params = `${this.userId}/${receiverId}/1/${messageId}`;
    this.alertServ
      .requestAlert(
        'You are about to accept this invitation, do you want to proceed?'
      )
      .then((res) => {
        if (res.role === 'ok') {
          this.rest.getOne('request/accept-decline/', params)
          .subscribe((response) => {
              console.log(response);
              if (response.status === 'success') {
                // this.socket.emit('refresh', {});
              }
            });
        }
      });
  }

  decline(receiverId, messageId) {
    const params = `${this.userId}/${receiverId}/1/${messageId}`;
    this.alertServ
      .requestAlert(
        'You are about to decline this invitation, do you want to proceed?'
      )
      .then((res) => {
        if (res.role === 'ok') {
          this.rest
            .getOne('request/accept-decline/', params)
            .subscribe((response) => {
              if (response.status === 'success') {
                // this.socket.emit('refresh', {});
              }
            });
        }
      });
  }

  openChat(chat) {
    const data = {
      receiverId: chat.receiver_id._id,
      senderId: this.userId,
      receiverName: chat.receiver_id.username,
      messageId: chat.message_id._id,
      conversationId: chat.message_id.conversation_id
    };
    const param = `${this.userId}/${chat.receiver_id._id}`;
    this.router.navigate(['/chat', JSON.stringify(data)]);
    this.rest.getOne('messages/chat/', param).subscribe((res) => {
      console.log(res);
      // this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

}
