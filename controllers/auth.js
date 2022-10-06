import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';

/**
 * @Desc    Register new User
 * @Route    POST /api/auth/signup
 * @Access   Public
 */
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).json('User has been created');
  } catch (error) {
    next(error);
  }
};

/**
 * @Desc    Login User
 * @Route    POST /api/auth/signi
 * @Access   Public
 */
export const signin = async (req, res, next) => {
  try {
    //    Find the user
    const user = await User.findOne({ name: req.body.name });
    // check user existv
    if (!user) return next(createError(404, 'User not found'));

    //  compare passwords
    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, 'Wrong credential!'));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = User.findOne({ email: req.body.email });
    // check if the user is already registered
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (error) {
    next(error);
  }
};
