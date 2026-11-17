const productImages = {
  "wireless noise cancelling headphones": "/product-images/headphones.jpg",
  "ergonomic office chair": "/product-images/office-chair.jpg",
  "smart fitness watch": "/product-images/fitness-watch.png",
  "4k ultra hd smart tv 55": "/product-images/smart-tv.jpg",
  "minimalist leather backpack": "/product-images/leather-backpack.jpg",
  "stainless steel cookware set 5 pcs": "/product-images/cookware-set.jpg",
  "wireless bluetooth speaker": "/product-images/bluetooth-speaker.jpg",
  "gaming mechanical keyboard": "/product-images/gaming-keyboard.jpg",
  "professional dslr camera": "/product-images/dslr-camera.jpg",
  "eco friendly bamboo toothbrush set 4 pcs": "/product-images/bamboo-toothbrush.jpg",
  "premium cashew nuts 500g": "/product-images/cashews.jpg",
};

function normalizeProductName(name) {
  return typeof name === "string"
    ? name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
    : "";
}

export function getCuratedProductImage(product) {
  return productImages[normalizeProductName(product?.name)] || null;
}
