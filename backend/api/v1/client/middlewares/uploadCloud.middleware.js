import { v2 as cloudinary } from "cloudinary";

let streamUpload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
        folder: "CAU_TRUC_DU_AN_MERN",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};

const uploadAvatar = async (buffer) => {
  return await streamUpload(buffer, {
    folder: "CAU_TRUC_DU_AN_MERN/avatar",
  });
};

const uploadImage = async (buffer) => {
  return await streamUpload(buffer, {
    folder: "CAU_TRUC_DU_AN_MERN/product",
  });
};

// Upload 1 ảnh
export const uploadSingle = async (req, res, next) => {
  try {
    let result;

    if (req.file.fieldname == "avatar") {
      result = await uploadAvatar(req.file.buffer);
    }

    req.body[req.file.fieldname] = result.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Lỗi khi upload file" });
  }

  next();
};

// upload nhiều ảnh
export const uploadMulti = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploads = req.files.map((file) => uploadImage(file.buffer));

    const results = await Promise.all(uploads);
    const fieldName = req.files[0].fieldname;

    req.body[fieldName] = results.map((item, index) => item.secure_url);
  } catch (error) {
    console.error("Upload multi error:", error);
    return res.status(500).json({ message: "Lỗi khi upload files" });
  }

  next();
};
