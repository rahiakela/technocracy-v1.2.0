/**
 * File Context : Blog Reducer-Blog State Branch
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This branch of the state tree could hold information about all of the blog and describes
 *                the state concerning blog, how to modify it using given a particular action through the reducer,
 *                and the selectors.
 * */
import {Blog} from "../../shared/model/blog-model";
import {Action} from "redux";
import * as BlogActions from "./blog.actions";

export interface BlogState {
  selectedBlog: Blog;
  blogs: Blog[];
  blogList: Blog[];
  pendingBlogList: Blog[];
  filteredBlog: Blog[];
}

const initialState: BlogState = {
  selectedBlog: {},
  blogs: [],
  blogList: [],
  pendingBlogList: [],
  filteredBlog: []
};

/**
 * The `BlogReducer` describes how to modify the `BlogState` given a particular action.
 */
export const BlogReducer = (state: BlogState = initialState, action: Action): BlogState => {

  switch (action.type) {

    case BlogActions.ADD_BLOGS:
      const blogs = (<BlogActions.BlogAction>action).blogs;

      return {
        // state.blogs.concat(Object.assign({},blog))
        blogs: blogs, // add this blog into existing blogs array (blogs: [...state.blogs, blog])
        selectedBlog: state.selectedBlog,
        blogList: state.blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.ADD_BLOG:
      const blog = (<BlogActions.ResetBlogAction>action).blog;

      return {
        // state.blogs.concat(Object.assign({},blog))
        blogs: [...state.blogs, blog], // add this blog into existing blogs array (blogs: [...state.blogs, blog])
        selectedBlog: state.selectedBlog,
        blogList: state.blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.UPDATE_BLOG:
      // only blogs is required after logout
      return {
        blogs: state.blogs,
        selectedBlog: {},
        blogList: [],
        pendingBlogList: [],
        filteredBlog: []
      };

    case BlogActions.SET_SELECTED_BLOG:
      // set selected blog
      let selectedBlog = {};
      const blogId = (<BlogActions.SetBlogAction>action).blogId;
      const setFor = (<BlogActions.SetBlogAction>action).setFor;
      // query blog from blog array using blog id based on set parameter
      if (setFor === 'dpp_view') {
        selectedBlog = state.blogList.find(blog => blog._id === blogId);
      } else if (setFor === 'p_b_view') {
        selectedBlog = state.pendingBlogList.find(blog => blog._id === blogId);
      } else {
        selectedBlog = state.blogs.find(blog => blog._id === blogId);
      }
      // normalize blog state using blog schema normalizr
      // const normalizedBlog = normalize(selectedBlog, blogSchema);

      return {
        blogs: state.blogs,
        selectedBlog: selectedBlog,
        blogList: state.blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.RESET_SELECTED_BLOG:
      // get blog payload from action
      const resetBlog = (<BlogActions.ResetBlogAction>action).blog;
      // update state blog array of store
      const resetBlogs = state.blogs.map(blog => {
        if(blog._id === resetBlog._id) {
          return {...blog, ...resetBlog}
        }
        return blog
      });

      return {
        blogs: resetBlogs,
        selectedBlog: resetBlog,
        blogList: state.blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.SET_BLOG_LIST:
      const blogList = (<BlogActions.BlogAction>action).blogs;
      return {
        blogs: state.blogs,
        selectedBlog: state.selectedBlog,
        blogList: blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.RESET_BLOG_LIST:
      const resetBlogList = (<BlogActions.BlogAction>action).blogs;
      return {
        blogs: state.blogs,
        selectedBlog: state.selectedBlog,
        blogList: resetBlogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.UPDATE_BLOG_LIST:
      const updateBlog = (<BlogActions.ResetBlogAction>action).blog;
      // remove old blog from blog list
      const filteredBlogList = state.blogList.filter(blog => blog._id !== updateBlog._id);
      return {
        blogs: state.blogs,
        selectedBlog: updateBlog,
        blogList: filteredBlogList.concat(updateBlog), // update blog list with updated one
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.DELETE_ITEM_FROM_BLOG_LIST:
      const deletedBlog = (<BlogActions.ResetBlogAction>action).blog;
      // remove deleted blog from blog list
      const updatedBlogList = state.blogList.filter(blog => blog._id !== deletedBlog._id);

      return {
        blogs: state.blogs,
        selectedBlog: state.selectedBlog,
        blogList: updatedBlogList, // update blog list after removing deleted one
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.SET_PENDING_BLOG_LIST:
      const pendingBlogList = (<BlogActions.BlogAction>action).blogs;
      return {
        blogs: state.blogs,
        selectedBlog: state.selectedBlog,
        blogList: state.blogList,
        pendingBlogList: pendingBlogList,
        filteredBlog: state.filteredBlog
      };

    case BlogActions.UPDATE_PENDING_BLOG_LIST:
      const updatedPendingBlog = (<BlogActions.ResetBlogAction>action).blog;
      // remove old blog from pending blog list
      const filteredPendingBlogList = state.pendingBlogList.filter(blog => blog._id !== updatedPendingBlog._id);
      return {
        blogs: state.blogs,
        selectedBlog: state.selectedBlog,
        blogList: state.blogList,
        pendingBlogList: filteredPendingBlogList, // update pending blog list
        filteredBlog: state.filteredBlog
      };

    case BlogActions.SEARCH_BLOG:
      const keyword = (<BlogActions.SearchBlogAction>action).keyword;
      // search blog from blog list array using status keyword
      const filteredBlog = state.blogList.filter(blog => blog.status === keyword);
      return {
        blogs: state.blogs,
        selectedBlog: state.selectedBlog,
        blogList: state.blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: filteredBlog
      };

    /*case BlogActions.ADD_COMMENT:
      const comment = (<BlogActions.AddCommentAction>action).comment;
      // use concat method becoz it does not change the existing arrays, but instead returns a new array
      const updatedSelectedBlog = state.selectedBlog.comments.concat(comment);

      return {
        blogs: state.blogs, // assign blogs from state
        selectedBlog: updatedSelectedBlog,   // make empty selected blog
        blogList: state.blogList,
        pendingBlogList: state.pendingBlogList,
        filteredBlog: state.filteredBlog
      };*/

    default:
      return state;
  }
};

