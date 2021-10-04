import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable()
export class FileStorageService {
  constructor(private angularStorage: AngularFireStorage) {}

  uploadFileToStorage(filePath: string, fileName: string, file: File): AngularFireUploadTask {
    return this.angularStorage.upload(`${filePath}/${fileName}`, file);
  }

  getFileFromStorage(filePath: string, fileName: string): Observable<string> {
    const ref = this.angularStorage.ref(`${filePath}/${fileName}`);
    return ref.getDownloadURL();
  }
}
