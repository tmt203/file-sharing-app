const File = require('../models/fileModel');
const catchAsync = require('../utils/catchAsync');

const getDownloadPage = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return res.render('download', {
      error: 'Link has been expired.'
    });
  }
  res.render('download', {
    id: file._id, 
    fileName: file.filename,
    fileSize: file.size, 
    downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.id}`
  });
});

const getMainPage = (req, res) => {
  res.render('index');
};

module.exports = {
  getDownloadPage,
  getMainPage
}