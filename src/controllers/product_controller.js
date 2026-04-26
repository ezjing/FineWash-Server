const ProductService = require("../services/product_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const MapProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  image: p.image,
  category: p.category,
  description: p.description,
  stock: p.stock,
});

const MapProductSummary = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  image: p.image,
  category: p.category,
});

const SearchLogic1 = async (req, res) => {
  try {
    const result = await ProductService.SearchLogic1();
    if (result.source === "dummy") {
      return Ok(res, { products: result.products });
    }
    return Ok(res, {
      products: Array.isArray(result.products) ? result.products.map(MapProduct) : [],
    });
  } catch (error) {
    const products = await ProductService.SearchLogic4();
    return Ok(res, { products });
  }
};

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const product = await ProductService.SearchLogic2(req.params.id);
  return Ok(res, { product: MapProduct(product) });
});

const SearchLogic3 = AsyncHandler(async (req, res) => {
  const products = await ProductService.SearchLogic3(req.params.category);
  return Ok(res, { products: Array.isArray(products) ? products.map(MapProductSummary) : [] });
});

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SearchLogic3,
};
