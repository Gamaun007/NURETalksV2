import { v4 as uuid } from 'uuid';

export class Upload {
  public $uuid: string;
  public file: File;

  public constructor(file: File) {
    this.file = file;
    this.$uuid = uuid();
  }
}
