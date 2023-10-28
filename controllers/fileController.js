const path = require('path');
const File = require('../models/fileModel');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const downloadFile = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return res.render('download', {
      error: 'Link has been expired.'
    });
  }

  await file.save();
  const filePath = path.join(__dirname, `../${file.path}`);
  res.download(filePath);
});

const uploadFile = catchAsync(async (req, res) => {
  const file = {
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size
  };

  const newFile = await File.create(file);
  res.status(200).json({
    status: 'success',
    file: `${process.env.APP_BASE_URL}/files/${newFile._id}`
  });
});

const sendEmail = catchAsync(async (req, res, next) => {
  const { id, emailTo, emailFrom, expiresIn } = req.body;
  if (!id || !emailTo || !emailFrom) {
    return next(new AppError('All fields are required except expiry.', 422));
  }

  const file = await File.findById(id);
  file.sender = emailFrom;
  file.receiver = emailTo;
  await file.save();
  
  const downloadLink = `${process.env.APP_BASE_URL}/files/${file._id}?source=email`;
  const htmlData = {
    emailFrom,
    downloadLink,
    size: parseInt(file.size / 1000) + ' KB',
    expires: '24 hours'
  };

  try {
    await new Email(emailFrom, emailTo).sendEmailDownloadFile(htmlData);
    res.status(200).json({
      status: 'success',
      message: 'Email was sent.'
    })
  } catch (error) {
    console.log(error);
    return next(new AppError('There was an error sending the mail. Try again later!', 500));
  }
});

module.exports = {
  downloadFile,
  uploadFile,
  sendEmail
};