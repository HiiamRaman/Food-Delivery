import multer from "multer";

// 1. first handle storage then go for upload   and handle routes
//disk storage


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/tmp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
