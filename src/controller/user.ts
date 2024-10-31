// external import
import { NextFunction, Response, Request } from "express";

//internal import
import userService from "../service/user";
import { customError } from "../utils/customError";
import blogService, { IBlog } from "../service/blog";

// get a single user
async function getUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;

  try {
    const user = await userService.findUserByProperty("_id", userId);
    if (!user) {
      customError("user not found", 400);
    }

    res
      .status(200)
      .json({ message: "User found successfully", success: true, user: user });
  } catch (error) {
    next(error);
  }
}

// get all users
async function getAllUser(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.findUser();
    if (!users) {
      customError("users not found", 400);
    }

    res.status(200).json({
      message: "users found successfully",
      success: true,
      users: users,
    });
  } catch (error) {
    next(error);
  }
}

interface IBlogContent {
  title: string;
  description: string;
  keywords: string[];
}

// create post by user
async function createPostByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.authUser!;
  const blogContent = req.body;

  try {
    const { title, description, keywords }: IBlogContent = blogContent;
    const userId = user._id as string;

    const blogPayload = {
      title: title,
      description: description,
      keywords: [...keywords],
      creator: userId,
    };

    // create a new blog
    const blog = await blogService.postBlog(blogPayload as IBlog);
    if (!blog) {
      customError("blog is not created", 400);
    }

    // set blog id in user
    const updatedUser = await userService.updateUser(
      "_id",
      userId,
      "blogs",
      blog._id
    );
    if (!updatedUser) {
      customError("user update fails", 400);
    }

    res.status(200).json({
      message: "blog created successfully",
      success: true,
      blog: blog,
    });
  } catch (error) {
    next(error);
  }
}

interface IModifyBlog {
  id: string;
  title?: string;
  description?: string;
  keywords?: string[];
}

async function modifyExistBlogByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const blogDetails: IModifyBlog = req.body;

  try {
    const { id, title, description, keywords } = blogDetails;

    const updatedBlogPart = {
      title: title,
      description: description,
      keywords: keywords,
    };

    const updatedBlog = await blogService.updateManyInBlog(
      "_id",
      id,
      updatedBlogPart
    );
    if (!updatedBlog) {
      customError("blog updation failed", 401);
    }

    res
      .status(200)
      .json({
        message: "Blog updated successfully",
        success: true,
        updatedBlog: updatedBlog,
      });
  } catch (error) {
    next(error);
  }
}

// update user TODO:
function modifyUser(req: Request, res: Response, next: NextFunction) {}

// delete user
async function removeUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;

  try {
    const deletedUser = await userService.deleteUser("_id", userId);
    if (!deletedUser) {
      customError("user not found", 400);
    }

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
      deletedUser: deletedUser,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getUser,
  getAllUser,
  createPostByUser,
  modifyUser,
  modifyExistBlogByUser,
  removeUser,
};
