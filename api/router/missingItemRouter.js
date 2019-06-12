const MissingItem = require('../model/missingItem');
const multer = require('multer');
const fs = require('fs');
const paths = require('path');
const express = require('express');
const router = express.Router();

var path = './public/uploads';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = paths.join(__dirname, '..', '..', 'public', 'uploads')
    cb (null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + paths.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg or .png files are accepted'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post("/create", upload.single('itemImage'), (req, res, next) => {
  // function to create file from base64 encoded string
  function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  var bitmap = new Buffer.from(base64str, 'base64');
  // write buffer to file
  fs.writeFileSync(file, bitmap);
  console.log('******** File created from base64 encoded string ********');
  }
  if(req.file){
    req.body.itemImage = req.file.filename;
  }

  // var new_img = new MissingItem(req.body);
  // new_img.category = req.body.category;
  // new_img.detail = req.body.detail;
  // new_img.contact = req.body.contact;
  // new_img.itemImage = base64_decode(req.body.itemImage, 'copy.jpeg')
  const missingItem = new MissingItem({
    category: req.body.category,
    detail: req.body.detail,
    contact: req.body.contact,
    itemImage: req.body.itemImage
  });
  missingItem
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  
});

router.post("/update/:id", upload.single('itemImage'), (req, res, next) => {
  const id = req.params.id;
  const updateOps = {
    category: req.body.category,
    detail: req.body.detail,
    contact: req.body.contact,
    itemImage: req.file.path 
  };
  // for (let key of Object.keys(req.body)) {
  //   console.log(key, updateOps[key])
  //   updateOps[key.propName] = key.value;
  // }
  // for (i = 0; i < req.body.length; i++){
  //   updateOps[i.propName] = i.value
  // }
  MissingItem.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          result: result,
          message: 'Item updated'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/all", (req, res, next) => {
  MissingItem.find()
    .select("category detail contact itemType itemImage")
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
            message: 'No found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  MissingItem.findById(id)
    .select('category detail contact itemType itemImage')
    .exec()
    .then(docs => {
      if (docs) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
            message: 'No found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  MissingItem.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Item deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;