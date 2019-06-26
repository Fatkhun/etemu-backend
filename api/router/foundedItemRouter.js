const FoundedItem = require('../model/foundedItem');
const multer = require('multer');
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

router.post("/create", (req, res, next) => {
  const foundedItem = new FoundedItem({
    category: req.body.category,
    detail: req.body.detail,
    contact: req.body.contact,
    itemImage: req.body.itemImage 
  });
  foundedItem
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

router.post("/update/:id", (req, res, next) => {
  const id = req.params.id;
  const updateOps = {
    category: req.body.category,
    detail: req.body.detail,
    contact: req.body.contact,
    itemImage: req.body.itemImage
  };
  FoundedItem.update({ _id: id }, { $set: updateOps })
    .exec()
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

router.get("/all", (req, res, next) => {
  FoundedItem.find()
    .select("category detail contact itemImage createdAt updatedAt")
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
  FoundedItem.findById(id)
    .select('category detail contact itemImage createdAt updatedAt')
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
  FoundedItem.remove({ _id: id })
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