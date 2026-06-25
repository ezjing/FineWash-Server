const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const ProductRepository = require("../repositories/product_repository");
const dummyProducts = require("../data/product_dummy");

const SearchLogic1 = async () => {
  const products = await ProductRepository.FindAllOrdered();
  if (!products || products.length === 0) {
    return { source: "dummy", products: dummyProducts };
  }
  return { source: "db", products };
};

const SearchLogic2 = async (id) => {
  let product = await ProductRepository.FindById(id);
  if (!product) {
    product = dummyProducts.find((p) => p.id === id) || null;
  }
  if (!product) ThrowFromCode(CODES.PRODUCT.NOT_FOUND_PRODUCT);
  return product;
};

const SearchLogic3 = async (category) => {
  let products = await ProductRepository.FindByCategory(category);
  if (!products || products.length === 0) {
    products = dummyProducts.filter((p) => p.category === category);
  }
  return products;
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SearchLogic3,
  SearchLogic4: async () => dummyProducts,
};
