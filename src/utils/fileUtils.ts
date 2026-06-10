import path from 'path';
import fs from 'fs';

export const saveFile = (file: any, folder: string) => {
  const uploadPath = path.join('uploads', folder);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadPath, fileName);
  file.mv(filePath);
  return filePath;
};
