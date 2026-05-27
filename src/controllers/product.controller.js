import Product from "../models/product.model.js";

export const getProducts = async (
  req,
  res
) => {
  try {
    const {
      keyword,
      category,
      sort,
    } = req.query;

    let query = {};

    /* SEARCH */
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    /* CATEGORY */
    if (category) {
      query.category = category;
    }

    let products =
      Product.find(query);

    /* SORTING */
    if (sort === "low") {
      products =
        products.sort({
          price: 1,
        });
    }

    if (sort === "high") {
      products =
        products.sort({
          price: -1,
        });
    }

    const finalProducts =
      await products;

    res.status(200).json(
      finalProducts
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleProduct = async (
  req,
  res
) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createProduct = async (
  req,
  res
) => {
  try {
    const product = await Product.create(
      req.body
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};