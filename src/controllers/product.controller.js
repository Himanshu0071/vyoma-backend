import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import NotifyRequest from "../models/notifyRequest.model.js";
import sendBackInStockEmail from "../utils/sendBackInStockEmail.js";

const SHOP_CATEGORIES = [
  { title: "Tshirts", slug: "tshirts" },
  { title: "Shirts", slug: "shirts" },
  { title: "Vest", slug: "vest" },
  { title: "Kurta", slug: "kurta" },
  { title: "Jeans", slug: "jeans" },
  { title: "Pant", slug: "pant" },
  { title: "Shoes", slug: "shoes" },
  { title: "Trousers", slug: "trousers" },
  { title: "Cargo", slug: "cargo" },
  { title: "Joggers", slug: "joggers" },
  { title: "Shorts", slug: "shorts" },
];

const escapeRegex = (value) =>
  String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

const parseCoupons = (raw) => {
  if (!raw) return [];

  try {
    const parsed =
      typeof raw === "string"
        ? JSON.parse(raw)
        : raw;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (coupon) =>
          coupon?.code &&
          coupon?.discountValue !==
            undefined
      )
      .map((coupon) => ({
        code: String(coupon.code)
          .trim()
          .toUpperCase(),
        title: coupon.title || "",
        discountType:
          coupon.discountType ===
          "flat"
            ? "flat"
            : "percentage",
        discountValue: Number(
          coupon.discountValue
        ),
        maxDiscount: Number(
          coupon.maxDiscount || 0
        ),
        minOrderValue: Number(
          coupon.minOrderValue || 0
        ),
        description:
          coupon.description || "",
        termsAndConditions:
          coupon.termsAndConditions ||
          "",
        isActive:
          coupon.isActive !== false,
      }));
  } catch {
    return [];
  }
};

export const getProducts =
  async (req, res) => {
    try {
      const {
        keyword,
        category,
        sort,
        collection,
      } = req.query;

      let query = {
        isActive: {
          $ne: false,
        },
      };

      /* SEARCH */
      if (keyword) {
        const safeKeyword = escapeRegex(keyword);
        query.$or = [
          {
            title: {
              $regex: safeKeyword,
              $options: "i",
            },
          },
          {
            category: {
              $regex: safeKeyword,
              $options: "i",
            },
          },
          {
            brand: {
              $regex: safeKeyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: safeKeyword,
              $options: "i",
            },
          },
          {
            gender: {
              $regex: safeKeyword,
              $options: "i",
            },
          },
        ];
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

export const globalSearch = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(200).json({
        products: [],
        categories: [],
      });
    }

    const safeQuery = escapeRegex(q);
    const regex = new RegExp(safeQuery, "i");

    const products = await Product.find({
      isActive: { $ne: false },
      $or: [
        { title: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } },
        { brand: { $regex: safeQuery, $options: "i" } },
        { description: { $regex: safeQuery, $options: "i" } },
        { gender: { $regex: safeQuery, $options: "i" } },
      ],
    })
      .select("title category price brand variants")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const lowerQ = q.toLowerCase();
    const categories = SHOP_CATEGORIES.filter(
      (cat) =>
        cat.slug.includes(lowerQ) ||
        regex.test(cat.title) ||
        regex.test(cat.slug)
    );

    res.status(200).json({
      products,
      categories,
    });
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

    const coupons = parseCoupons(
      req.body.coupons
    );

    const product =
      await Product.create({
        title:
          req.body.title,

        description:
          req.body.description,

        mrp: Number(
          req.body.mrp || 0
        ),

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

        coupons,
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

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          isActive: false,
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      message:
        "Product archived",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const updateProduct = async (
  req,
  res
) => {
  try {
    const before = await Product.findById(req.params.id).lean();
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

    for (
      let i = 0;
      i < variants.length;
      i++
    ) {
      const existingImages = (
        Array.isArray(variants[i].images)
          ? variants[i].images
          : []
      ).filter(
        (img) =>
          typeof img ===
          "string" &&
          img.length > 0
      );

      const variantFiles =
        req.files?.filter(
          (file) =>
            file.fieldname ===
            `variantImages_${i}`
        ) || [];

      if (
        variantFiles.length > 0
      ) {
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

        variants[i].images = [
          ...existingImages,
          ...uploadedImages,
        ];
      } else {
        variants[i].images =
          existingImages;
      }
    }

    const coupons = parseCoupons(
      req.body.coupons
    );

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          title:
            req.body.title,

          description:
            req.body.description,

          mrp: Number(
            req.body.mrp || 0
          ),

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

          coupons,
        },
        {
          new: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    res.status(200).json(
      product
    );

    // Fire-and-forget notifications when stock changes 0 -> >0 per color
    try {
      if (!before || !product) return;

      const clientUrl = process.env.CLIENT_URL
        ? String(process.env.CLIENT_URL).split(",")[0].trim()
        : "";

      const beforeMap = new Map(
        (before.variants || []).map((v) => [String(v.color), Number(v.stock || 0)])
      );

      const restockedColors = (product.variants || [])
        .filter((v) => {
          const oldStock = beforeMap.get(String(v.color)) ?? 0;
          const newStock = Number(v.stock || 0);
          return oldStock <= 0 && newStock > 0;
        })
        .map((v) => String(v.color));

      if (restockedColors.length === 0) return;

      const pending = await NotifyRequest.find({
        productId: product._id,
        notified: false,
        variantColor: { $in: restockedColors },
      });

      if (!pending.length) return;

      await Promise.all(
        pending.map(async (r) => {
          const shopUrl = clientUrl
            ? `${clientUrl}/product/${product._id}`
            : "";

          await sendBackInStockEmail({
            email: r.email,
            name: r.name,
            productTitle: r.productTitle || product.title,
            size: r.variantSize,
            color: r.variantColor,
            shopUrl,
          });

          r.notified = true;
          await r.save();
        })
      );
    } catch (e) {
      console.log("Back-in-stock notify error:", e?.message || e);
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const restoreProduct =
  async (req, res) => {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          isActive: true,
        },
        {
          new: true,
        }
      );

    res.json(product);
  };