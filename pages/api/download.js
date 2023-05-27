// pages/api/download.js

const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'app.apk'); // Update the filename if necessary
  const fileStream = fs.createReadStream(filePath);

  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename=app.apk');

  fileStream.pipe(res);
}
