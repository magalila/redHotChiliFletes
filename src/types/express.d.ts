import type { UploadedFile } from 'express-fileupload';

declare global {
  namespace Express {
    interface Request {
      files?: {
        fotoPerfil?: UploadedFile[];
        dniPdf?: UploadedFile[];
        certificadoAntecedente?: UploadedFile[];
        licenciaConducir?: UploadedFile[];
      };
    }
  }
}
