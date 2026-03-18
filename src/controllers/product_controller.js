const ProductService = require("../services/product_service");
const { Ok, Fail } = require("../utils/response");

const SearchLogic1 = async (req, res) => {
  try {
    const result = await ProductService.SearchLogic1();
    if (result.source === "dummy") {
      return Ok(res, { products: result.products });
    }
    return Ok(res, {
      products: result.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        description: p.description,
        stock: p.stock,
      })),
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.json({
      success: true,
      products: ProductService.dummyProducts,
    });
  }
};

const SearchLogic2 = async (req, res) => {
  try {
    const product = await ProductService.SearchLogic2(req.params.id);
    return Ok(res, {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock,
      },
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return Fail(res, 404, "상품을 찾을 수 없습니다.");
    }
    console.error("Get product error:", error);
    return Fail(res, 500, "상품 조회 중 오류가 발생했습니다.");
  }
};

const SearchLogic3 = async (req, res) => {
  try {
    const products = await ProductService.SearchLogic3(req.params.category);
    return Ok(res, {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
      })),
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    return Fail(res, 500, "상품 조회 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SearchLogic3,
};

