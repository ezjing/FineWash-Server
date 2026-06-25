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

module.exports = {
  MapProduct,
  MapProductSummary,
};
