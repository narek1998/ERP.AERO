const fs = require('fs');
const File = require('./../../../lib/service/src/repository/file/file');
const response = require('./../../../helpers/http/response');
const util = require('../../../lib/shared/src/util/util');

exports.uploadFile = async (req, res, next) => {
  try {
    const { mimetype, filename, size } = req.file;
    const { id } = req.user;
    const file = await File.create({
      userId: id,
      name: req.file.filename,
      extension: util.getExtension(filename),
      mimetype: mimetype,
      size: size
    });
    return res.json(file);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.updateFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const file = await File.findOne({ where: { id, userId } });

    if (!file) {
      const responseStatus = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'File not found',
        code: responseStatus
      });
      return res.status(responseStatus).json(data);
    }

    if (req.file) {
      const filePath = `${process.cwd()}/public/files/${file.name}`;
      await fs.unlink(filePath, async (err) => {
        if (err) {
          const responseStatus = response.status.BAD_REQUEST;
          const data = response.dispatch({
            error: 'Wrong',
            code: responseStatus
          });
          return res.status(responseStatus).json(data);
        }
      });
    }
    const { mimetype, filename, size } = req.file;

    const fileUp = await File.update(
      {
        mimetype,
        name: req.file.filename,
        size,
        extension: util.getExtension(filename)
      },
      {
        where: { id, userId }
      }
    );
    return res.json(fileUp);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.deleteFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const file = await File.findOne({ where: { id, userId } });
    if (!file) {
      const responseStatus = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'File not found',
        code: responseStatus
      });
      return res.status(responseStatus).json(data);
    }
    const filePath = `${process.cwd()}/public/files/${file.name}`;
    await File.destroy({ where: { id } });
    await fs.unlink(filePath, async (err) => {
      if (err) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'Wrong',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      } else {
        const responseStatus = response.status.OK;
        const data = response.dispatch({
          error: 'Successfully deleted the file.',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }
    });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.downloadFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const file = await File.findOne({ where: { id, userId } });
    if (!file) {
      const responseStatus = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'File not found',
        code: responseStatus
      });
      return res.status(responseStatus).json(data);
    }
    await File.update(
      { dataDownload: new Date() },
      {
        where: { id }
      }
    );
    const filePath = `${process.cwd()}/public/files/${file.name}`;
    return res.download(filePath, file.name);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const file = await File.findOne({ where: { id, userId } });
    return res.json(file);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    let { list_size: limit, page } = req.query;
    page = +page || 1;
    limit = +limit || 10;
    let offset = page * +limit - +limit;
    const files = await File.findAndCountAll({
      where: { userId },
      limit,
      offset
    });
    return res.json(files);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};
