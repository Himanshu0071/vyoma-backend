import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
// export const getProducts = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       keyword,
//       category,
//       sort,
//     } = req.query;

//     let query = {};

//     /* SEARCH */
//     if (keyword) {
//       query.title = {
//         $regex: keyword,
//         $options: "i",
//       };
//     }

//     /* CATEGORY */
//     if (category) {
//       query.category = category;
//     }

//     let products =
//       Product.find(query);

//     /* SORTING */
//     if (sort === "low") {
//       products =
//         products.sort({
//           price: 1,
//         });
//     }

//     if (sort === "high") {
//       products =
//         products.sort({
//           price: -1,
//         });
//     }

//     const finalProducts =
//       await products;

//     res.status(200).json(
//       finalProducts
//     );
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const getProducts =
  async (req, res) => {
    try {
      const {
        keyword,
        category,
        sort,
        collection,
      } = req.query;

      let query = {};

      /* SEARCH */
      if (keyword) {
        query.title = {
          $regex: keyword,
          $options: "i",
        };
      }

      /* CATEGORY / COLLECTION */
      if (
        category ||
        collection
      ) {
        query.category =
          (
            category ||
            collection
          ).toLowerCase();
      }

      /* BASE QUERY */
      let products =
        Product.find(query);

      /* SORT LOW TO HIGH */
      if (sort === "low") {
        products =
          products.sort({
            price: 1,
          });
      }

      /* SORT HIGH TO LOW */
      if (sort === "high") {
        products =
          products.sort({
            price: -1,
          });
      }

      /* LATEST */
      if (
        !sort ||
        sort === "latest"
      ) {
        products =
          products.sort({
            createdAt: -1,
          });
      }

      const finalProducts =
        await products;

      res.status(200).json(
        finalProducts
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
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

// export const createProduct = async (
//   req,
//   res
// ) => {
//   try {
//     let uploadedImages = [];

//     if (
//       req.files &&
//       req.files.length > 0
//     ) {
//       uploadedImages =
//         await Promise.all(
//           req.files.map(
//             (file) =>
//               new Promise(
//                 (
//                   resolve,
//                   reject
//                 ) => {
//                   const stream =
//                     cloudinary.uploader.upload_stream(
//                       {
//                         folder:
//                           "vyoma-products",
//                       },
//                       (
//                         error,
//                         result
//                       ) => {
//                         if (
//                           error
//                         ) {
//                           reject(
//                             error
//                           );
//                         } else {
//                           resolve(
//                             result.secure_url
//                           );
//                         }
//                       }
//                     );

//                   streamifier
//                     .createReadStream(
//                       file.buffer
//                     )
//                     .pipe(stream);
//                 }
//               )
//           )
//         );
//     }

//     const product =
//       await Product.create({
//         ...req.body,

//         images:
//           uploadedImages,
//       });

//     res.status(201).json(
//       product
//     );
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message:
//         error.message,
//     });
//   }
// };

export const createProduct = async (
  req,
  res
) => {
  try {
    const sizes =
      req.body.sizes
        ? JSON.parse(
            req.body.sizes
          )
        : [];

    const variants =
      req.body.variants
        ? JSON.parse(
            req.body.variants
          )
        : [];

    /* =========================
       UPLOAD VARIANT IMAGES
    ========================= */

    for (
      let i = 0;
      i < variants.length;
      i++
    ) {
      const variantFiles =
        req.files?.filter(
          (file) =>
            file.fieldname ===
            `variantImages_${i}`
        ) || [];

      const uploadedImages =
        await Promise.all(
          variantFiles.map(
            (file) =>
              new Promise(
                (
                  resolve,
                  reject
                ) => {
                  const stream =
                    cloudinary.uploader.upload_stream(
                      {
                        folder:
                          "vyoma-products",
                      },
                      (
                        error,
                        result
                      ) => {
                        if (
                          error
                        ) {
                          reject(
                            error
                          );
                        } else {
                          resolve(
                            result.secure_url
                          );
                        }
                      }
                    );

                  streamifier
                    .createReadStream(
                      file.buffer
                    )
                    .pipe(stream);
                }
              )
          )
        );

      variants[i].images =
        uploadedImages;
    }

    console.log(
      "FINAL VARIANTS:",
      variants
    );

    const product =
      await Product.create({
        title:
          req.body.title,

        description:
          req.body.description,

        price:
          Number(
            req.body.price
          ),

        category:
          req.body.category,

        brand:
          req.body.brand,

        gender:
          req.body.gender,

        discount:
          Number(
            req.body.discount
          ),

        featured:
          req.body.featured ===
          "true",

        sizes,

        variants,
      });

    res.status(201).json(
      product
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};