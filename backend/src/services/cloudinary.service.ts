import { cloudinary } from '../config/cloudinary.js';

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export const cloudinaryService = {
  /**
   * Upload an image (base64 string or file Buffer) to a specified Cloudinary folder
   */
  async uploadImage(
    fileInput: string | Buffer,
    folderOrOptions: string | { folder?: string; filename?: string; altText?: string } = 'ryzite/uploads',
    options: { filename?: string; altText?: string } = {}
  ): Promise<CloudinaryUploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'cqpwjere';
    const apiKey = process.env.CLOUDINARY_API_KEY || '618832689671566';

    let folder = 'ryzite/uploads';
    let opts = options;

    if (typeof folderOrOptions === 'object' && folderOrOptions !== null) {
      folder = folderOrOptions.folder || 'ryzite/uploads';
      opts = folderOrOptions;
    } else if (typeof folderOrOptions === 'string') {
      folder = folderOrOptions;
    }

    // Standardize Cloudinary folder path under ryzite/
    const targetFolder = folder.startsWith('ryzite/') ? folder : `ryzite/${folder.replace(/^\/+/, '')}`;

    // Clean filename for public_id prefix
    const safeBaseName = (opts.filename || 'asset')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();

    // If Cloudinary environment variables are missing, fallback gracefully for local sandbox testing
    if (!cloudName || !apiKey) {
      const mockPublicId = `${targetFolder}/${safeBaseName}-${Date.now()}`;
      const mockUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${mockPublicId}.webp`;
      console.log(`[CLOUDINARY MOCK UPLOAD] Generated CDN URL: ${mockUrl}`);
      return {
        url: mockUrl,
        secure_url: mockUrl,
        public_id: mockPublicId,
        format: 'webp'
      };
    }

    try {
      let uploadOptions: any = {
        folder: targetFolder,
        public_id: `${safeBaseName}-${Date.now()}`,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      };

      if (options.altText) {
        uploadOptions.context = { alt: options.altText };
      }

      let result: any;

      if (Buffer.isBuffer(fileInput)) {
        result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, res) => {
              if (error) return reject(error);
              resolve(res);
            }
          );
          uploadStream.end(fileInput);
        });
      } else {
        // Base64 data string or URL
        result = await cloudinary.uploader.upload(fileInput, uploadOptions);
      }

      return {
        url: result.secure_url || result.url,
        secure_url: result.secure_url || result.url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      };
    } catch (err: any) {
      console.error('[CLOUDINARY UPLOAD ERROR]', err.message || err);
      throw new Error(`Cloudinary Upload Failed: ${err.message || err}`);
    }
  },

  /**
   * Delete an image from Cloudinary by its public ID
   */
  async deleteImage(publicId: string | null | undefined): Promise<{ result: string }> {
    if (!publicId) return { result: 'not_found' };

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.log(`[CLOUDINARY MOCK DELETE] Removed public_id: ${publicId}`);
      return { result: 'ok' };
    }

    try {
      const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      console.log(`[CLOUDINARY DELETE] Destroyed asset "${publicId}":`, res.result);
      return { result: res.result || 'ok' };
    } catch (err: any) {
      console.warn(`[CLOUDINARY DELETE WARNING] Failed to destroy asset "${publicId}":`, err.message);
      return { result: 'error' };
    }
  },

  /**
   * Replace an existing image asset: deletes old public ID and uploads new file
   */
  async replaceImage(
    oldPublicId: string | null | undefined,
    fileInput: string | Buffer,
    folder: string = 'ryzite/uploads',
    options: { filename?: string; altText?: string } = {}
  ): Promise<CloudinaryUploadResult> {
    if (oldPublicId) {
      await this.deleteImage(oldPublicId).catch(() => {});
    }
    return this.uploadImage(fileInput, folder, options);
  }
};
