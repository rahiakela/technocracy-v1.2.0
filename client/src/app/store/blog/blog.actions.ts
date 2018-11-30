/**
 * File Context : Blog Action
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This list out all the actions that specifies actions creators concerning Blog
 * */
import {Action, ActionCreator} from "redux";
import {Blog} from "../../shared/model/blog-model";
import {Comment} from "../../shared/model/comment-model";

export const ADD_BLOGS = '[Blogs] Add';
export const ADD_BLOG = '[Blog] Add';
export const UPDATE_BLOG = '[Blog State] Update';
export const SET_SELECTED_BLOG = '[Selected Blog] Set';
export const RESET_SELECTED_BLOG = '[Selected Blog] Reset';
export const GET_SELECTED_BLOG = '[Selected Blog] Get';
export const SET_BLOG_LIST = '[Blog List] Set';
export const SET_PENDING_BLOG_LIST = '[Pending Blog List] Set';
export const UPDATE_PENDING_BLOG_LIST = '[Pending Blog List] Update';
export const RESET_BLOG_LIST = '[Blog List] Reset';
export const UPDATE_BLOG_LIST = '[Blog List] Update';
export const DELETE_ITEM_FROM_BLOG_LIST = '[Blog List] Delete Item';
export const SEARCH_BLOG = '[Blog] Search';
export const ADD_COMMENT = '[Comment] Add';

export interface BlogAction extends Action {
  blogs: Blog[];
}
export interface SetBlogAction extends Action {
  blogId: string;
  setFor?: string;
}
export interface ResetBlogAction extends Action {
  blog: Blog;
}
export interface AddCommentAction extends Action {
  comment: Comment;
}
export interface SearchBlogAction extends Action {
  keyword: string;
}

export const addBlogs: ActionCreator<BlogAction> = (blogs) => ({
  type: ADD_BLOGS,
  blogs: blogs
});

export const updateBlogState: ActionCreator<Action> = () => ({
  type: UPDATE_BLOG
});

export const setSelectedBlog: ActionCreator<SetBlogAction> = (blogId, setFor) => ({
  type: SET_SELECTED_BLOG,
  setFor: setFor,
  blogId: blogId
});
export const resetSelectedBlog: ActionCreator<ResetBlogAction> = (blog) => ({
  type: RESET_SELECTED_BLOG,
  blog: blog
});

export const getSelectedBlog: ActionCreator<SetBlogAction> = (blogId) => ({
  type: GET_SELECTED_BLOG,
  blogId: blogId
});

export const setBlogList: ActionCreator<BlogAction> = (blogs) => ({
  type: SET_BLOG_LIST,
  blogs: blogs
});

export const resetBlogList: ActionCreator<BlogAction> = (blogs) => ({
  type: RESET_BLOG_LIST,
  blogs: blogs
});

export const updateBlogList: ActionCreator<ResetBlogAction> = (blog) => ({
  type: UPDATE_BLOG_LIST,
  blog: blog
});

export const deletedItemFromBlogList: ActionCreator<ResetBlogAction> = (blog) => ({
  type: DELETE_ITEM_FROM_BLOG_LIST,
  blog: blog
});

export const setPendingBlogList: ActionCreator<BlogAction> = (blogs) => ({
  type: SET_PENDING_BLOG_LIST,
  blogs: blogs
});

export const updatePendingBlogList: ActionCreator<ResetBlogAction> = (blog) => ({
  type: UPDATE_PENDING_BLOG_LIST,
  blog: blog
});

export const searchBlog: ActionCreator<SearchBlogAction> = (keyword) => ({
  type: SEARCH_BLOG,
  keyword: keyword
});

export const addComment: ActionCreator<AddCommentAction> = (comment) => ({
  type: ADD_COMMENT,
  comment: comment
});


