/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'formidable' {
  
    interface File {
      size: number;
      path: string;
      name: string;
      type: string;
      lastModifiedDate?: Date;
      hash?: string;
  
      toJSON(): Record<string, any>;
    }
  
    interface Files {
      [key: string]: File | File[];
    }
  
    interface Fields {
      [key: string]: string | string[];
    }
  
    interface IncomingFormOptions {
      uploadDir?: string;
      keepExtensions?: boolean;
      maxFileSize?: number;
      maxFieldsSize?: number;
      maxFields?: number;
      hash?: boolean | 'sha1' | 'md5';
      multiples?: boolean;
    }
  
    class IncomingForm {
      constructor(options?: IncomingFormOptions);
  
      parse(
        req: any,
        callback?: (
          err: Error | null,
          fields: Fields,
          files: Files
        ) => void
      ): void;
  
      on(event: string, callback: (...args: any[]) => void): this;
    }
  }
  