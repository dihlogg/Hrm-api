import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  generateSignature(folder: string = 'general') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret!,
    );

    return {
      timestamp,
      signature,
      apiKey,
    };
  }
  private extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/upload/');
      if (parts.length !== 2) return null;

      const pathWithoutVersion = parts[1].replace(/^v\d+\//, '');
      const lastDotIndex = pathWithoutVersion.lastIndexOf('.');
      if (lastDotIndex === -1) return pathWithoutVersion;

      return pathWithoutVersion.substring(0, lastDotIndex);
    } catch (error) {
      return null;
    }
  }

  async deleteImageByUrl(url: string): Promise<void> {
    if (!url) return;
    const publicId = this.extractPublicId(url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        this.logger.log(`Deleted avatar from Cloudinary: ${publicId}`);
      } catch (error) {
        this.logger.error(`Failed to delete avatar: ${publicId}`, error);
      }
    }
  }
}
