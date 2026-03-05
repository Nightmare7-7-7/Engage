import cloudinary from "../configs/cloudinary";

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    uploadStream.on('error', reject);
    uploadStream.end(buffer);
  });
};