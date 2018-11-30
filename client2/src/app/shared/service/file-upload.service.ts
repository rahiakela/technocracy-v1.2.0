import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {ProfileService} from "../../profile/service/profile.service";
import * as AWS from 'aws-sdk';
import * as $ from "jquery";
import {UtilsService} from "./utils-service";

@Injectable()
export class FileUploadService {

  constructor(private profileService: ProfileService,
              private utilService: UtilsService) { }

  upload(editor: any, file: any, uploadPath: string) {

    const bucket = new AWS.S3({
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
      region: 'us-east-1'
    });

    const params = {
      Bucket: environment.Bucket,
      Key: `${uploadPath}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };

    bucket.upload(params, (err, data) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
      }

      console.log('Successfully uploaded file.', data.Location);
      // insert image into editor or profile image frame
      if (editor === '.file-upload') {
        $('.profile-pic').attr('src', data.Location);
        // update user with profile image path
        const loggedUser = this.utilService.getLoggedInUser();
        const updatedUser = this.utilService.getUserWithUpdatedImagePath(loggedUser, data.Location);
        this.profileService.updateProfileImage(loggedUser._id, updatedUser);
      } else {
        editor.insertContent(`<img class="img-responsive" src="${data.Location}"/>`);
      }
    });

  }
}

