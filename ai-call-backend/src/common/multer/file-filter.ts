import { BadRequestException } from '@nestjs/common';

export const audioFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/mpeg', // mp3
    'audio/wav',
    'audio/x-wav',
    'audio/mp4', // m4a
    'audio/ogg',    //  WhatsApp audio
    'audio/wave'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.log("tyep",file.mimetype)
    return cb(
      new BadRequestException(
        'Only audio files (mp3, wav, m4a) are allowed',
      ),
      false,
    );
  }

  cb(null, true);
};