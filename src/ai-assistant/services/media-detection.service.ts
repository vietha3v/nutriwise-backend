import { Injectable, Logger } from '@nestjs/common';
import { MediaType } from '../dto/ai-action.dto';

@Injectable()
export class MediaDetectionService {
  private readonly logger = new Logger(MediaDetectionService.name);

  detectMediaType(message: string, contentType?: string): {
    mediaType: MediaType;
    detectedFrom: 'content_type' | 'file_extension' | 'url_pattern' | 'base64' | 'manual';
    originalMessage: string;
  } {
    // 1. Kiểm tra content-type header (ưu tiên cao nhất)
    if (contentType) {
      if (contentType.startsWith('audio/')) {
        return {
          mediaType: MediaType.VOICE,
          detectedFrom: 'content_type',
          originalMessage: message
        };
      }
      if (contentType.startsWith('image/')) {
        return {
          mediaType: MediaType.IMAGE,
          detectedFrom: 'content_type',
          originalMessage: message
        };
      }
      if (contentType === 'application/json') {
        return {
          mediaType: MediaType.TEXT,
          detectedFrom: 'content_type',
          originalMessage: message
        };
      }
    }

    // 2. Kiểm tra base64 data
    if (this.isBase64Audio(message)) {
      return {
        mediaType: MediaType.VOICE,
        detectedFrom: 'base64',
        originalMessage: message
      };
    }

    if (this.isBase64Image(message)) {
      return {
        mediaType: MediaType.IMAGE,
        detectedFrom: 'base64',
        originalMessage: message
      };
    }

    // 3. Kiểm tra file extension trong message
    const fileExtensions = {
      // Audio files
      '.mp3': MediaType.VOICE,
      '.wav': MediaType.VOICE,
      '.m4a': MediaType.VOICE,
      '.aac': MediaType.VOICE,
      '.ogg': MediaType.VOICE,
      '.flac': MediaType.VOICE,
      
      // Image files
      '.jpg': MediaType.IMAGE,
      '.jpeg': MediaType.IMAGE,
      '.png': MediaType.IMAGE,
      '.gif': MediaType.IMAGE,
      '.bmp': MediaType.IMAGE,
      '.webp': MediaType.IMAGE,
      '.svg': MediaType.IMAGE,
      '.tiff': MediaType.IMAGE
    };

    for (const [ext, mediaType] of Object.entries(fileExtensions)) {
      if (message.toLowerCase().includes(ext)) {
        return {
          mediaType,
          detectedFrom: 'file_extension',
          originalMessage: message
        };
      }
    }

    // 4. Kiểm tra URL patterns
    if (this.isImageUrl(message)) {
      return {
        mediaType: MediaType.IMAGE,
        detectedFrom: 'url_pattern',
        originalMessage: message
      };
    }

    if (this.isAudioUrl(message)) {
      return {
        mediaType: MediaType.VOICE,
        detectedFrom: 'url_pattern',
        originalMessage: message
      };
    }

    // 5. Mặc định là text message
    const result: {
      mediaType: MediaType;
      detectedFrom: 'content_type' | 'file_extension' | 'url_pattern' | 'base64' | 'manual';
      originalMessage: string;
    } = {
      mediaType: MediaType.TEXT,
      detectedFrom: 'manual',
      originalMessage: message
    };
    
    return result;
  }

  private isBase64Audio(message: string): boolean {
    // Kiểm tra base64 audio data
    const audioBase64Patterns = [
      /^data:audio\/(mp3|wav|m4a|aac|ogg|flac);base64,/i,
      /^[A-Za-z0-9+/=]{100,}$/ // Base64 pattern (ít nhất 100 ký tự)
    ];
    
    return audioBase64Patterns.some(pattern => pattern.test(message));
  }

  private isBase64Image(message: string): boolean {
    // Kiểm tra base64 image data
    const imageBase64Patterns = [
      /^data:image\/(jpeg|jpg|png|gif|bmp|webp|svg);base64,/i,
      /^[A-Za-z0-9+/=]{100,}$/ // Base64 pattern (ít nhất 100 ký tự)
    ];
    
    return imageBase64Patterns.some(pattern => pattern.test(message));
  }

  private isImageUrl(url: string): boolean {
    const imagePatterns = [
      /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif)$/i,
      /https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif)/i,
      /data:image\//i,
      /blob:.*image/i
    ];

    return imagePatterns.some(pattern => pattern.test(url));
  }

  private isAudioUrl(url: string): boolean {
    const audioPatterns = [
      /\.(mp3|wav|m4a|aac|ogg|flac)$/i,
      /https?:\/\/.*\.(mp3|wav|m4a|aac|ogg|flac)/i,
      /data:audio\//i,
      /blob:.*audio/i
    ];

    return audioPatterns.some(pattern => pattern.test(url));
  }

  extractMetadata(message: string, mediaType: MediaType): {
    size?: number;
    format?: string;
    duration?: number;
    width?: number;
    height?: number;
  } {
    const metadata: any = {};

    // Extract format from file extension
    const formatMatch = message.match(/\.([a-zA-Z0-9]+)(\?|$)/);
    if (formatMatch) {
      metadata.format = formatMatch[1].toLowerCase();
    }

    // Extract size from URL parameters (if any)
    const sizeMatch = message.match(/[?&]size=(\d+)/);
    if (sizeMatch) {
      metadata.size = parseInt(sizeMatch[1]);
    }

    // Extract duration from URL parameters (for audio)
    if (mediaType === MediaType.VOICE) {
      const durationMatch = message.match(/[?&]duration=(\d+)/);
      if (durationMatch) {
        metadata.duration = parseInt(durationMatch[1]);
      }
    }

    // Extract dimensions from URL parameters (for images)
    if (mediaType === MediaType.IMAGE) {
      const widthMatch = message.match(/[?&]width=(\d+)/);
      const heightMatch = message.match(/[?&]height=(\d+)/);

      if (widthMatch) {
        metadata.width = parseInt(widthMatch[1]);
      }
      if (heightMatch) {
        metadata.height = parseInt(heightMatch[1]);
      }
    }

    return metadata;
  }

  isUrl(message: string): boolean {
    const urlPatterns = [
      /^https?:\/\//i,
      /^data:/i,
      /^blob:/i,
      /^ftp:\/\//i
    ];

    return urlPatterns.some(pattern => pattern.test(message));
  }

  isFileUpload(message: string): boolean {
    // Kiểm tra xem có phải là file upload không
    // Có thể là base64, blob URL, hoặc file path
    return this.isUrl(message) || message.startsWith('data:') || message.startsWith('blob:');
  }
}
