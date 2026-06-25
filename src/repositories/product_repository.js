const { Product } = require("../models");

const FindAllOrdered = async () => {
  try {
    return await Product.findAll({ order: [["created_at", "DESC"]] });
  } catch {
    return null;
  }
};

const FindById = async (id) => {
  try {
    return await Product.findByPk(id);
  } catch {
    return null;
  }
};

const FindByCategory = async (category) => {
  try {
    return await Product.findAll({ where: { category } });
  } catch {
    return null;
  }
};

module.exports = {
  FindAllOrdered,
  FindById,
  FindByCategory,
};
