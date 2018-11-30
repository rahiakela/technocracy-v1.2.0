import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {FileUploadService} from '../service/file-upload.service';
import {UtilsService} from '../service/utils-service';

declare var tinymce: any;

@Component({
  selector: 'app-tinymce-editor',
  template: `<textarea id="{{elementId}}">{{editorValue}}</textarea>`
})
export class TinymceEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  elementId: String;
  @Input()
  editorValue: String;
  @Input()
  type: string;

  @Output()
  onEditorContentChange = new EventEmitter<any>();

  editor: any;

  input: any;
  uploadPath: string;

  constructor(private utilService: UtilsService, private fileUploadService: FileUploadService) {

  }

  ngOnInit() {
    // console.log('EditorValue:' + this.editorValue);
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins : ['link', 'paste', 'table', 'codesample'],
      toolbar: 'styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table codesample imageupload',
      skin_url : 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          // editor.setContent(this.editorValue);
          const content = editor.getContent();
          // console.log('Content>>' + content);
          this.onEditorContentChange.emit(content)
        });
        editor.on('change', () => {
          // editor.setContent(this.editorValue);
          const content = editor.getContent();
          // console.log('Content>>' + content);
          this.onEditorContentChange.emit(content)
        });
        this.initImageUpload(editor);
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  initImageUpload(editor: any) {

    // create input and insert in the DOM
    this.input = $('<input type="file" name="pic" accept="image/*" style="display:none">');
    $(editor.getElement()).parent().append(this.input);

    // add the image upload button to the editor toolbar
    editor.addButton('imageupload', {
      text: '',
      icon: 'image',
      title: 'add image to your post',
      onclick: (e) => this.input.trigger('click') // when toolbar button is clicked, open file select modal
    });

    // when a file is selected, upload it to the server
    this.input.on('change', (e) => this.uploadFile(this.input, editor));
  }

  uploadFile(input, editor) {
    const file = input.get(0).files[0];

    // check the file size, it should not be more than 150KB=1024*150=153600
    if (file.size > 153600) {
      alert('Please make sure, the attached file should not be more than 150KB');
      return false;
    }

    this.prepareUploadPath();
    this.fileUploadService.upload(editor, file, this.uploadPath);
  }

  prepareUploadPath() {
    switch (this.type) {
      case 'blog-comment':
        if (this.utilService.getCurrentCommentId() === '') { // check, this image upload is for new comment or existing comment's reply for blog
          this.uploadPath = `images/blogs/${this.utilService.getCurrentBlog()._id}/comments/${this.utilService.getCurrentUser()}`;
        } else {
          this.uploadPath = `images/blogs/${this.utilService.getCurrentBlog()._id}/comments/${this.utilService.getCurrentCommentId()}`;
        }
        break;
      case 'question-comment':
        if (this.utilService.getCurrentCommentId() === '') { // check, this image upload is for new comment or existing comment's reply for question
          this.uploadPath = `images/question/${this.utilService.getCurrentQuestion()._id}/comments/${this.utilService.getCurrentUser()}`;
        } else {
          this.uploadPath = `images/question/${this.utilService.getCurrentQuestion()._id}/comments/${this.utilService.getCurrentCommentId()}`;
        }
        break;
      case 'new-update-question':
          if (this.utilService.getSelectedQuestion() === null) { // check, this image upload is for new question  or update question
            this.uploadPath = `images/question/users/${this.utilService.getCurrentUser()}`;
          } else {
            this.uploadPath = `images/question/${this.utilService.getSelectedQuestion()._id}/${this.utilService.getCurrentUser()}`;
          }
        break;
      case 'new-update-blog':
        if (this.utilService.getSelectedBlog() === null) { // check, this image upload is for new blog  or update blog
          this.uploadPath = `images/blogs/users/${this.utilService.getCurrentUser()}`;
        } else {
          this.uploadPath = `images/blogs/${this.utilService.getSelectedBlog()._id}/${this.utilService.getCurrentUser()}`;
        }
        break;
    }
  }
}
