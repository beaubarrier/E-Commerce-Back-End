const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products

  Category.findAll({
    include: [
      {
        model: Product
      }
    ],
    // },
  }).then(productData => {
    res.status(200).json(productData);
  }).catch((err) => {
    console.log("Server error 500", err)
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products

  let pID = req.params.id;
  Category.findAll({

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
  // create a new category

  Category.create(req.body)
    .then((productData) => {
      console.log("=====")
      console.log(productData.dataValue)
      console.log("=====")

      res.status(200).json(productData);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value

  let pID = req.params.id;
  Category.update(req.body, {
    where: [{ id: pID }]
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
  // delete one product by its `id` value

  let id = req.params.id;

  Category.destroy(
    { where: { id } });

  res.status(200).json();
})
module.exports = router;
