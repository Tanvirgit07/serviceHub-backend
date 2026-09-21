import cloudinary from "../config/cloudinary.js";
import AppError from "../errors/AppError.js";

export type UploadedImage = {
  url: string;
  publicId: string;
};

export const uploadImage = (
  file: Express.Multer.File,
  folder = "servicehub",
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError("Image upload failed", 502));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.on("error", () => {
      reject(new AppError("Image upload failed", 502));
    });

    stream.end(file.buffer);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new AppError("Image deletion failed", 502);
  }
};

// Cleanup ব্যর্থ হলেও অন্য image-এর cleanup চেষ্টা করবে।
export const cleanupImages = async (
  images: UploadedImage[],
): Promise<void> => {
  const results = await Promise.allSettled(
    images.map((image) => deleteImage(image.publicId)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        "Image cleanup failed:",
        images[index]?.publicId,
        result.reason,
      );
    }
  });
};

export const uploadImages = async (
  files: Express.Multer.File[],
  folder = "servicehub",
): Promise<UploadedImage[]> => {
  const uploaded: UploadedImage[] = [];

  try {
    for (const file of files) {
      uploaded.push(await uploadImage(file, folder));
    }

    return uploaded;
  } catch (error) {
    await cleanupImages(uploaded);
    throw error;
  }
};