import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  subirImagen($event: any, url: string)
  {
    const file = $event.target.files[0];
    const imgRef = ref(this.storage, url);

    return uploadBytes(imgRef, file);
  }
}