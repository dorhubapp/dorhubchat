import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  async store(key: string, value: any): Promise<void> {
    const encryptedValue = btoa(escape(JSON.stringify(value)));
    await Storage.set({
      key,
      value: encryptedValue,
    });
  }

  async get(key: string): Promise<any> {
    const item = await Storage.get({ key });
    if (item.value) {
      return JSON.parse(unescape(atob(item.value)));
    } else {
      return false;
    }
  }

  async removeItem(key: string): Promise<void> {
    await Storage.remove({
      key,
    });
  }

}
