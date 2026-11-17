import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount || 0);

function ProductCard({ product }) {
  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;
  const badge = discount
    ? `${discount}% off`
    : product.badge && product.badge !== "New"
      ? product.badge
      : "Just in";

  return (
    <article className="store-product-card">
      <div className="store-product-art">
        <Link
          to={`/products/${product._id}`}
          className="store-product-image-link"
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            product={product}
            alt={product.name}
            className="store-product-image"
          />
        </Link>
        <span className={`store-product-badge ${discount ? "is-sale" : ""}`}>
          {badge}
        </span>
        <Link
          to="/wishlist"
          className="store-product-wishlist"
          aria-label={`Open wishlist to save ${product.name}`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20.2 8.8c0 5-8.2 10.1-8.2 10.1S3.8 13.8 3.8 8.8A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 8.2 2.1Z" />
          </svg>
        </Link>
      </div>

      <div className="store-product-copy">
        <div className="store-product-meta">
          <span>{product.category}</span>
          {product.rating > 0 && (
            <span className="store-product-rating">
              <span aria-hidden="true">★</span> {Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>
        <Link
          to={`/products/${product._id}`}
          className="store-product-name"
        >
          {product.name}
        </Link>
        <p className="store-product-brand">{product.brand}</p>
        <div className="store-product-bottom">
          <div className="store-product-prices">
            <strong>
              ₹{formatPrice(hasDiscount ? product.discountPrice : product.price)}
            </strong>
            {hasDiscount && (
              <del>₹{formatPrice(product.price)}</del>
            )}
          </div>
          <Link
            to={`/products/${product._id}`}
            className="store-product-view"
            aria-label={`View details for ${product.name}`}
          >
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {product.numReviews > 0 && (
          <p className="store-product-review-count">
            {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
