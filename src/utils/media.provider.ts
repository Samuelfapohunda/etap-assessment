import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from 'src/config/env.config';
import { v2 } from 'cloudinary';
import { Readable } from 'typeorm/platform/PlatformTools';

export class MediaProvider {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret:CLOUDINARY_API_SECRET,
    });
  }

  async uploadAndCompressVideo(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          eager: [{ width: 1280, height: 720, crop: 'pad' }],
          eager_async: true,
          folder: 'course_videos',
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return reject(new Error('Failed to upload and compress video'));
          }
          return resolve(result.secure_url);
        }
      );
  
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });
  }
  

//   async uploadAndCompressVideo(file: Express.Multer.File): Promise<string> {
//     try {
//       const result = await v2.uploader.upload(file.path, {
//         resource_type: 'video',
//         eager: [
//           { width: 1280, height: 720, crop: 'pad' }
//         ],
//         eager_async: true,
//         folder: 'course_videos',
//       });

//       console.log('Video uploaded and compression queued:', result.public_id);
//       return result.secure_url;
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error);
//       throw new Error('Failed to upload and compress video');
//     }
//   }
// }

// async uploadAndCompressVideo(file: Express.Multer.File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const stream = new Readable();
//     stream.push(file.buffer);
//     stream.push(null); // Signal that the stream has ended

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'video',
//         eager: [{ width: 1280, height: 720, crop: 'pad' }],
//         eager_async: true,
//         folder: 'course_videos',
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Error uploading to Cloudinary:', error);
//           return reject(new Error('Failed to upload and compress video'));
//         }
//         console.log('Video uploaded and compression queued:', result.public_id);
//         return resolve(result.secure_url);
//       }
//     );

//     stream.pipe(uploadStream);
//   });
// }
// }
}