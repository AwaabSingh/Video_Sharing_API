import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { createError } from '../error.js';

/**
 * @Desc     Add Comments
 * @Route    POST /api/comments
 * @Access   Private
 */

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    return res.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
};

/**
 * @Desc     Delete Comments
 * @Route    DELETE /api/comments/:Id
 * @Access   Private
 */

export const deleteComment = async (req, res, next) => {
  try {
    // get comment ownerships
    const comment = await Comment.findById(req.params.id);
    // find the video
    const video = await Video.findById(req.params.id);
    // owner of comment or owner of video
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findOneAndDelete(req.params.id);
      res.status(200).json('The comment has been deleted');
    } else {
      return next(createError(403, 'You can delete only your comment'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @Desc     Get  Comments for each videos
 * @Route    GET /api/comments/:id
 * @Access   Private
 */

export const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
