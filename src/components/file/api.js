const express = require('express');
const fileCtr = require('./service');
const authMiddleware = require('./../../../middleware/auth.middleware');

const fileRouter = express.Router();
const Upload = require('../../../lib/shared/src/uploadFile');

const upload = new Upload('public/files');

fileRouter.get('/list', authMiddleware, fileCtr.getFiles);
fileRouter.get('/:id', authMiddleware, fileCtr.getFileById);
fileRouter.get('/download/:id', authMiddleware, fileCtr.downloadFileById);
fileRouter.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  fileCtr.uploadFile
);
fileRouter.put(
  '/update/:id',
  authMiddleware,
  upload.single('file'),
  fileCtr.updateFileById
);
fileRouter.delete('/delete/:id', authMiddleware, fileCtr.deleteFileById);

module.exports = fileRouter;
