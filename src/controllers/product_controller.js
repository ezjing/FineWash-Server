const ProductService = require("../services/product_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const { MapProduct, MapProductSummary } = require("../mappers/product_mapper");

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const result = await ProductService.SearchLogic1();
  const products =
    result.source === "dummy"
      ? result.products
      : Array.isArray(result.products)
        ? result.products.map(MapProduct)
        : [];
  return Ok(res, { products });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const product = await ProductService.SearchLogic2(req.params.id);
  return Ok(res, { product: MapProduct(product) });
});

const SearchLogic3 = AsyncHandler(async (req, res) => {
  const products = await ProductService.SearchLogic3(req.params.category);
  return Ok(res, {
    products: Array.isArray(products) ? products.map(MapProductSummary) : [],
  });
});

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SearchLogic3,
};
