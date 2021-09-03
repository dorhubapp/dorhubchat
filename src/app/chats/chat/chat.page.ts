/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { IMAGE, RestService, SOCKET, USER } from 'src/app/services/rest.service';
import { StorageService } from 'src/app/services/storage.service';
import io from 'socket.io-client';
import _ from 'lodash';
// import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('content')
  content: any;
  socket: any;
  userId: string;
  localData: any;
  user: any;
  imgUrl: string;
  sharedImgUrl: string;
  chatMessages = [];
  userData: any;
  saveChatLocally: any;
  requestData: any;
  userInput = '';
  receiverAvatar: string;
  senderAvatar: string;
  typingMessage;
  typing = false;
  isOnline = false;
  onlineUsers: [];

  toggled = false;
  toggledUpload = false;
  isEmpty: boolean;
  firstPick: boolean;
  martBGcolor = '#ebeff2';
  martHeaderBG = '#e3e7e8';
  martFooterBG = '#e3e7e8';
  martActiveCategoryIndicatorColor = '#00897b';
  martCategoryColor = '#94a0a6';
  martCategoryColorActive = '#455a64';
  martBorderRadius = 10;
  showHeader = true;
  showFooter = true;
  martActiveCategoryIndicatorHeight = 4;
  martEmojiFontSize = 150;
  martCategoryFontSize = 20;

  x1 = 0;
  x2 = 0;
  x3 = 40;
  y1 = 0;
  y2 = 0;
  y3 = 40;

  constructor(
    private rest: RestService,
    private popoverCtrl: PopoverController,
    private storageServ: StorageService,
    private activeRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    // private photoView: PhotoViewer
  ) {
    this.socket = io(SOCKET);
  }

  ngOnInit() {
    this.requestData = JSON.parse(this.activeRoute.snapshot.params.chat);
    console.log('Request: ',this.requestData);
    this.userId = this.requestData.senderId;
    this.imgUrl = IMAGE;
    this.sharedImgUrl = 'http://localhost:5000/uploads/chat/';
    this.saveChatLocally = `chat_${this.requestData.messageId}`;
    this.storageServ.get(USER).then((res) => {
      this.userId = res._id;
      this.loggedInUser();
    });
    this.getDate();
  }

  ionViewWillLeave() {
    this.storageServ.store(this.saveChatLocally, this.chatMessages);
  }

  loggedInUser() {
    this.rest.getOne('users/', this.userId).subscribe(async (res) => {
      if (res.status === 'success') {
        this.localData = res.data;
        this.senderAvatar = this.imgUrl + 'thumb_' + this.localData.profile_photo;
        this.getChatMessages(this.localData._id);
      }
    }, err => {
      console.error(err);
    });
  }

  getDate() {
    this.rest.getOne('users/', this.requestData.receiverId).subscribe(res => {
      if (res.status === 'success') {
        this.userData = res.data;
        this.receiverAvatar = this.imgUrl + 'thumb_' + this.userData.profile_photo;
        this.viewEntered();
      }
    }, err => console.error(err));
  }

  getChatMessages(userId) {
    const params = `${userId}/${this.requestData.receiverId}`;
    this.storageServ.get(`chat_${this.requestData.messageId}`).then((res) => {
      this.chatMessages = res === false ? [] : res;
      this.scrollDown();
      this.socket.on('receiveMsg', (message) => {
        this.chatMessages.push(message);
        this.storageServ.store(this.saveChatLocally, this.chatMessages);
        this.scrollDown();
      });
    });
    setTimeout(() => {
      this.rest.getOne('messages/chat/', params).subscribe((res) => {
        console.log(res);
        if (res.status === 'success') {
          const chats = res.data ? res.data.message : [];
          if (chats.length > 0) {
            for (const chat of chats) {
              if (this.userId !== chat.receiver_id._id) { return; }
              this.chatMessages.push(chat);
              this.clearServeChat(chat);
            }
            this.storageServ.store(this.saveChatLocally, this.chatMessages);
          }
        }
      }, err => console.error(err));
    }, 50);
  }

  clearServeChat(chat) {
    const param = `messages/clear-chat/${this.requestData.messageId}`;
    this.rest.create(param, chat).subscribe((res: any) => {
      console.log('clear chat: ',res);
    }, (err) => {
      console.error(err);
    });
  }

  viewEntered() {
    const onlineData = { room: 'global', user: this.userId };
    this.socket.emit('online', onlineData);

    const p2pChat = { room: `p2p_${this.requestData.conversationId}`, user: this.userId };
    this.socket.emit('p2p', p2pChat);

    this.socket.on('is typing', (data) => {
      console.log(data);
      if (data.sender === this.userData.username) {
        this.typing = true;
      }
    });

    this.socket.on('stopped typing', (data) => {
      if (data.sender === this.userData.username) {
        this.typing = false;
      }
    });

    this.socket.on('usersOnline', (data) => {
      this.onlineUsers = data;
      console.log(this.onlineUsers);
      const result = _.indexOf(data, this.userData.username);
      if (result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    });

    this.socket.on('p2pUsers', (data) => {
      console.log('p2pusers: ',data);
    });
  }

  presentPopover(ev) {
    //
  }

  showPhoto(msg) {
    //
  }

  openEmoji() {
    //
  }

  sendMsg() {
    if (!this.userInput.trim()) {return;}
    console.log(this.onlineUsers);
    const isFound = _.indexOf(this.onlineUsers, this.userData._id);
    const file = false;
    const details = {
      conversationId: this.requestData.conversationId,
      receiver_id: this.userData,
      sender_id: this.localData,
      body: this.userInput,
      file,
      isRead: false,
      created_at: new Date()
    };
    this.chatMessages.push(details);
    this.storageServ.store(this.saveChatLocally, this.chatMessages);
    console.log('sending: ',this.chatMessages);
    const params = `messages/chat/${this.localData._id}/${this.userData._id}`;
    if (isFound > -1) {
      console.log('i am online');
      details.isRead = true;
      this.socket.emit('sendMsg', details);
      this.userInput = '';
    } else {
      console.log('i am not online');
      this.rest.create(params, details).subscribe(data => {
        console.log(data);
        this.userInput = '';
      }, err => console.error(err));
    }
    this.socket.emit('refreshOthers', {});
    this.scrollDown();
  }

  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 300);
  }

  isTyping() {}

  takePicture() {}

  loadPicture() {}

  voiceRecording() {}

}
