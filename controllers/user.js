import { createError } from '../error.js';
import User from '../models/User.js';
import Video from '../models/Video.js';
/**
import { createError } from '../error';
 * @Desc    Update a User
 * @Route    PUT /api/users/:id
 * @Access   Private
 */
export const update = async (req, res, next) => {
  // Check ownership
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, 'You can update only your account!'));
  }
};

/**
 * @Desc    Delete a   User
 * @Route   DELETE  /api/users/:id
 * @Access   Private
 */
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json(' User has be deleted ');
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, 'You can delete only your account!'));
  }
};

/**
 * @Desc    Get a   User
 * @Route    GET  /api/users/find/:id
 * @Access   Private
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * @Desc    Subscribe
 * @Route   PUT /api/users/sub/:id
 * @Access   Private
 */
export const subscribe = async (req, res, next) => {
  try {
    // User id
    await User.findByIdAndUpdate(req.user.id, {
      // other channel user id
      $push: { subscribedUsers: req.params.id },
    });
    //  find the channel and increse the subscribers
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json('Subscribtion Successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @Desc    Unsubscribe a   User
 * @Route   PUT  /api/users/unsub/:id
 * @Access   Private
 */
export const unsubscribe = async (req, res, next) => {
  try {
    // User id
    await User.findByIdAndUpdate(req.user.id, {
      // other channel user id
      $pull: { subscribedUsers: req.params.id },
    });
    //  find the channel and increse the subscribers
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json('Unsubscribtion Successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @Desc    Like a video
 * @Route   PUT  /api/users/like/:videoId
 * @Access   Private
 */
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json('The video has been liked.');
  } catch (err) {
    next(err);
  }
};

/**
 * @Desc    Dislike a video
 * @Route   PUT /api/users/dislike/:videoId
 * @Access   Private
 */
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json('The video has been disliked.');
  } catch (err) {
    next(err);
  }
};
