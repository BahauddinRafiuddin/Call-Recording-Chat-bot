import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

const uploadPath = join(process.cwd(), 'uploads');

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const multerConfig = {
  storage: diskStorage({
    destination: uploadPath,

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, uniqueName + extname(file.originalname));
    },
  }),

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
};