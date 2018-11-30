/**
 * File Context : Blog normalizer schema
 * Author       : Rahi Akela
 * Date         : 30-03-2018
 * Description  : This schema normalize blog document and its sub document's state branch
 * */
import {normalize, schema} from 'normalizr';

// Define users schema
const userSchema = new schema.Entity('users', {}, {idAttribute: '_id'});

// Define authors schema
const authorSchema = new schema.Entity(
  'author',
  {
    profile: [userSchema]
  },
  {idAttribute: '_id'}
  );

// define reply schema
const replySchema = new schema.Entity(
  'replies',
  {
    repliedBy: userSchema
  },
  {idAttribute: '_id'}
  );

// Define comment schema
const commentSchema = new schema.Entity(
  'comments',
  {
    replies: [replySchema],
    commentedBy: userSchema
  },
  {idAttribute: '_id'}
  );

// Define blog schema
const blogSchema = new schema.Entity(
  'blog',
  {
    comments: [commentSchema],
    author: [authorSchema]
  },
  {idAttribute: '_id'}
  );

export default blogSchema;

