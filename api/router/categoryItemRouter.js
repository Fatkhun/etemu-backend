const CategoryItem = require('../model/categoryItem');
const express = require('express');
const router = express.Router();

router.post("/create", (req, res, next) => {
  const categoryItem = new CategoryItem({
    name: req.body.name
  });
  categoryItem
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
    name: req.body.name
  };
  CategoryItem.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
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
  CategoryItem.find()
    .select("name")
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
  CategoryItem.findById(id)
    .select('name createdAt updatedAt')
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
  CategoryItem.remove({ _id: id })
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