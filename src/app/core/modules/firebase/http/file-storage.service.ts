import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { from, Observable, of } from 'rxjs';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class FileStorageService {
  constructor(private angularStorage: AngularFireStorage, private http: HttpClient) {}

  uploadFileToStorage(
    filePath: string,
    fileName: string,
    file: File,
    metadata?: UploadMetadata
  ): AngularFireUploadTask {
    return this.angularStorage.upload(this.createFileFullPath(filePath, fileName), file, metadata);
  }

  uploadFileToStorageByFullPath(fileFullPath: string, file: File, metadata?: UploadMetadata): AngularFireUploadTask {
    return this.angularStorage.upload(fileFullPath, file, metadata);
  }

  getFileFromStorage(filePath: string, fileName: string): Observable<string> {
    const ref = this.angularStorage.ref(this.createFileFullPath(filePath, fileName));
    return ref.getDownloadURL();
  }
  getFileFromStorageByFullPath(fullPath: string): Observable<string> {
    const ref = this.angularStorage.ref(fullPath);
    return ref.getDownloadURL();
  }

  // If It doesn't work with request to  fire storage because of CORSE.
  // Look at https://firebase.google.com/docs/storage/web/download-files#cors_configuration
  getFileByHttp(fileUrl: string): Observable<Blob> {
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

  createFileFullPath(filePath: string, fileName: string): string {
    return `${filePath}/${fileName}`;
  }
}
