const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data

  Tag.findAll({
    include: [{ model: Product }]

  }).then(productData => {
    res.status(200).json(productData);
  }).catch((err) => {
    console.log("Server error 500", err)
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  let pID = req.params.id;
  Tag.findAll({

    where: [{ id: pID }],
    include: [{ model: Product }],

  }).then(productData => {
    res.status(200).json(productData);
  }).catch((err) => {
    console.log("Server error 500", err)
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  // create a new tag

  Tag.create(req.body)
    .then((productData) => {

      res.status(200).json(productData);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value

  let pID = req.params.id;
  Tag.update(req.body, {
    where: [{ id: pID }],
  })
    .then((productData) => {

      res.status(200).json(productData)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value

  let id = req.params.id;
  Tag.destroy(
    { where: { id } });

  res.status(200).json();
});

module.exports = router;
