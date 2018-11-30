import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {FileUploadService} from "../../shared/service/file-upload.service";
import {UtilsService} from "../../shared/service/utils-service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private fileUploadService: FileUploadService,
              private utilService: UtilsService) { }

  ngOnInit() {
  }

  chooseFile(event) {
    event.preventDefault();
    $(".file-upload").trigger('click');
  }

  // ref: https://stackoverflow.com/questions/47936183/angular-5-file-upload
  uploadImage(files: FileList) {
    const fileToUpload: File = files.item(0);

    // check the file size, it should not be more than 150KB=1024*150=153600
    if (fileToUpload.size > 153600) {
      alert('Please make sure, the attached file should not be more than 150KB');
      return false;
    }

    const UPLOAD_PATH = `images/profiles/${this.utilService.getLoggedInUser()._id}`;
    this.fileUploadService.upload('.file-upload', fileToUpload, UPLOAD_PATH);
  }

  getUserImage(): string {
    return this.utilService.getUserIcon(this.utilService.getLoggedInUser());
  }
}
