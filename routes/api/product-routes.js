const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {

  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({

    include: [
      { model: Category },
      {
        model: Tag,
        through: ProductTag
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

// get one product
router.get('/:id', (req, res) => {

  let pID = req.params.id;
  Product.findAll({
    where: [{ id: pID }],
    include: [

      { model: Category },
      {
        model: Tag,
        through: ProductTag
      }
    ],
  }).then(productData => {
    res.status(200).json(productData);
  }).catch((err) => {
    console.log("Server error 500", err)
    res.status(500).json(err);
  });

});

// // create new product
router.post('/', (req, res) => {

  Product.create(req.body, {
    include: [

      { model: Category },
      {
        model: Tag,
        through: ProductTag
      }
    ]
  }).then((productData) => {
    console.log("=====")
    console.log(req.body.tagIds)
    console.log(productData.dataValue)
    console.log("=====")
    // let tagIdsTemp = [req.body]
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length > 1) {
      const productTagIdArr = productData.dataValue.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(productData);
  })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  let id = req.params.id;
  console.log(req.params.id)
  Product.destroy(
    { where: { id } });

  res.status(200).json();
})
module.exports = router;
