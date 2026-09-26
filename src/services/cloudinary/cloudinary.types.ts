export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}

export interface CloudinaryDeleteResult {
  result: string;
  deleted?: Record<string, string>;
}
