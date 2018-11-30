import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Blog, BlogInfo} from '../shared/model/blog-model';
import {Comment, Reply} from '../shared/model/comment-model';
import {BlogRepository} from './blog-repository';

@Injectable()
export class BlogService {

  constructor(private blogRepository: BlogRepository) {

  }

  search(query: string): Observable<Blog[]> {
    return this.blogRepository.search(query);
  }

  showAllBlogs(writtenBy: string): Observable<any> {
    return this.blogRepository.showAllBlogs(writtenBy);
  }

  postBlog(blog: Blog, profileId: string, actionType: string): Observable<BlogInfo> {
    return this.blogRepository.postBlog(blog, profileId, actionType);
  }

  modifyBlog(blogId: string, actionType: string): Observable<BlogInfo> {
    return this.blogRepository.modifyBlog(blogId, actionType);
  }

  editBlog(blog: Blog, blogId: string, profileId: string): Observable<BlogInfo> {
    return this.blogRepository.editBlog(blog, blogId, profileId);
  }

  deleteBlog(blogId: string): Observable<any> {
    return this.blogRepository.deleteBlog(blogId);
  }

  getPendingBlogList(): Observable<any> {
    return this.blogRepository.getPendingBlogList();
  }

  like(blogId: string, userId: string): Observable<any> {
    return this.blogRepository.like(blogId, userId);
  }

  likeComment(blogId: string, userId: string, commentId: string): Observable<any> {
    return this.blogRepository.likeComment(blogId, userId, commentId);
  }

  likeReply(blogId: string, userId: string, commentId: string, replyId: string): Observable<any> {
    return this.blogRepository.likeReply(blogId, userId, commentId, replyId);
  }

  addComment(blogId: string, userId: string, comments: Comment): Observable<any> {
    return this.blogRepository.addComment(blogId, userId, comments);
  }

  editCommentReply(actionType: string, questionId: string, commentReply: any): Observable<BlogInfo> {
    return this.blogRepository.editCommentReply(actionType, questionId, commentReply);
  }

  deleteCommentAndReply(questionId: string, actionId: string, actionType: string): Observable<any> {
    if (actionType === 'comment') {
      return this.blogRepository.deleteComment(questionId, actionId);
    } else {
      return this.blogRepository.deleteReply(questionId, actionId);
    }
  }

  reply(blogId: string, userId: string, commentId: string, reply: Reply): Observable<any> {
    return this.blogRepository.reply(blogId, userId, commentId, reply);
  }

}
