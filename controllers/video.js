import Video from '../models/Video.js';
import User from '../models/User.js';
import { createError } from '../error.js';
// import { SubscriptionsOutlinedIcon } from '@mui/icons-material/SubscriptionsOutlined';
/**
 * @Desc    Add video
 * @Route   POST /api/videos
 * @Access   Private
 */

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();

    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

/**
 * @Desc    Update vide
 * @Route   PUT /api/videos/:id
 * @Access   Private
 */

export const updateVideo = async (req, res, next) => {
  try {
    // take the user from the video
    const video = await Video.findById(req.params.id);

    if (!video) return next(createError(404, 'Video not found'));

    //   Comapre users ids to check ownerships
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, 'You can update only your video'));
    }
  } catch (error) {
    next(err);
  }
};

/**
 * @Desc    Delete a video
 * @Route   Delete /api/videos/:id
 * @Access   Private
 */

export const deleteVideo = async (req, res, next) => {
  try {
    // take the user from the video
    const video = await Video.findById(req.params.id);

    if (!video) return next(createError(404, 'Video not found'));

    //   Comapre users ids to check ownerships
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json('The video has been deleted');
    } else {
      return next(createError(403, 'You can delete only your video'));
    }
  } catch (error) {
    next(err);
  }
};

/**
 * @Desc    Get a  video by Id
 * @Route   PUT /api/videos/find/:id
 * @Access   Private
 */

export const getVideo = async (req, res, next) => {
  try {
    // get video  url
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {}
};

/**
 * @Desc    Get a  video by Id
 * @Route   POST /api/videos
 * @Access   Private
 */

export const addViews = async (req, res, next) => {
  try {
    // get video  url
    await Video.findById(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json('The view has been increased');
  } catch (error) {}
};

/**
 * @Desc    Get random id
 * @Route   POST /api/videos
 * @Access   Private
 */

export const random = async (req, res, next) => {
  try {
    // get video  url
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (error) {}
};

/**
 * @Desc    Get trending video
 * @Route   GET /api/videos/trend
 * @Access   Private
 */

export const trend = async (req, res, next) => {
  try {
    // get video  url
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {}
};

/**
 * @Desc    Subscribe to a video
 * @Route   POST /api/videos/sud/:id
 * @Access   Private
 */

export const sub = async (req, res, next) => {
  try {
    // find user id from jwt token
    const user = await User.findById(req.user.id);

    // find subsicried cheenls
    const SubscribedChanels = user.subscribedUsers;

    // Finding all the channels
    const list = await Promise.all(
      SubscribedChanels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt)); // mackind ir desensing
    // res.status(200).json(video);
  } catch (error) {}
};

/**
 * @Desc    Get Video By tags
 * @Route   GET /api/videos/tags
 * @Access   Private
 */

export const getByTag = async (req, res, next) => {
  // using querys and split by comma
  const tags = req.querys.tags.split(',');
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {}
};

/**
 * @Desc    Search Videos
 * @Route   GET /api/videos/trend
 * @Access   Private
 */

export const search = async (req, res, next) => {
    // get the search params 
    const query = req.query.q;

  try {
    // get video  url
    const videos = await Video.find({ $regex: query, $options: "i"}).limit(40)
    res.status(200).json(videos);
  } catch (error) {}
};
