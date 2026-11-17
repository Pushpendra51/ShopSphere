import heroFallback from "../assets/hero.png";
import { getCuratedProductImage } from "../data/productImages";

function ProductImage({ product, alt, className }) {
  const image = Array.isArray(product?.images)
    ? product.images[0]
    : product?.images;
  const imageUrl =
    getCuratedProductImage(product) ||
    (typeof image === "string" ? image : image?.url) ||
    (typeof product?.image === "string"
      ? product.image
      : product?.image?.url) ||
    product?.imageUrl ||
    heroFallback;

  const handleError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied !== "true") {
      event.currentTarget.dataset.fallbackApplied = "true";
      event.currentTarget.src = heroFallback;
    }
  };

  return (
    <img
      src={imageUrl}
      alt={alt || product?.name || "Product"}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}

export default ProductImage;

