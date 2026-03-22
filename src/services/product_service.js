const { Product } = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const dummyProducts = [
  { id: "1", name: "프리미엄 세차 샴푸", price: 25000, image: "🧴", category: "세차용품" },
  { id: "2", name: "마이크로파이버 타월", price: 15000, image: "🧽", category: "세차용품" },
  { id: "3", name: "왁스 코팅제", price: 35000, image: "✨", category: "코팅제" },
  { id: "4", name: "타이어 광택제", price: 18000, image: "⚫", category: "타이어" },
  { id: "5", name: "실내 방향제", price: 12000, image: "🌸", category: "방향제" },
  { id: "6", name: "유리세정제", price: 16000, image: "💧", category: "세정제" },
];

const SearchLogic1 = async () => {
  let products;
  try {
    products = await Product.findAll({ order: [["created_at", "DESC"]] });
  } catch (dbError) {
    products = null;
  }

  if (!products || products.length === 0) {
    return { source: "dummy", products: dummyProducts };
  }
  return { source: "db", products };
};

const SearchLogic2 = async (id) => {
  let product;
  try {
    product = await Product.findByPk(id);
  } catch (dbError) {
    product = null;
  }

  if (!product) {
    product = dummyProducts.find((p) => p.id === id) || null;
  }
  if (!product) {
    throw new AppError(
      CODES.PRODUCT.NOT_FOUND_PRODUCT.code,
      CODES.PRODUCT.NOT_FOUND_PRODUCT.status,
      CODES.PRODUCT.NOT_FOUND_PRODUCT.message,
    );
  }
  return product;
};

const SearchLogic3 = async (category) => {
  let products;
  try {
    products = await Product.findAll({ where: { category } });
  } catch (dbError) {
    products = null;
  }

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

