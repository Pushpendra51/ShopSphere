import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ProductImage from "../components/ProductImage";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    API.get(`/products/${id}`)
      .then(({ data }) => {
        if (active) {
          setProduct(data.product);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message || "Product could not be loaded."
          );
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const addToCart = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      return;
    }

    try {
      await API.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      alert("Product added to cart");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding to cart");
    }
  };

  const addToWishlist = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      return;
    }

    try {
      await API.post("/wishlist", {
        productId: product._id,
      });

      alert("Added to wishlist");
    } catch (error) {
      alert(error.response?.data?.message || "Wishlist failed");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/products/${product._id}/review`, {
        rating,
        comment,
      });

      alert("Review submitted");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Review failed");
    }
  };

  if (!product) {
    return (
      <div className="p-10" role={error ? "alert" : undefined}>
        {error || "Loading product..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <ProductImage
          product={product}
          alt={product.name}
          className="aspect-square w-full object-contain rounded-2xl bg-white shadow"
        />

        <div>
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
            {product.badge}
          </span>

          <h1 className="text-4xl font-bold mt-5 text-slate-800">
            {product.name}
          </h1>

          <p className="text-slate-500 mt-2">{product.brand}</p>

          <p className="text-slate-600 mt-6 leading-7">
            {product.description}
          </p>

          <div className="flex gap-4 mt-6 items-center">
            <span className="text-3xl font-bold text-indigo-600">
              ₹{product.discountPrice > 0
                ? product.discountPrice
                : product.price}
            </span>

            {product.discountPrice > 0 && (
              <span className="text-xl text-slate-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="mt-4 text-slate-600">Stock: {product.stock}</p>
          <p className="mt-2 text-slate-600">
            Rating: ⭐ {product.rating} ({product.numReviews} reviews)
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={addToCart}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700"
            >
              Add to Cart
            </button>

            <button
              onClick={addToWishlist}
              className="bg-pink-500 text-white px-8 py-3 rounded-xl hover:bg-pink-600"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Write a Review</h2>

          <form onSubmit={submitReview}>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg mb-4"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Bad</option>
            </select>

            <textarea
              placeholder="Write your review..."
              value={comment}
              className="w-full border px-4 py-3 rounded-lg mb-4"
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="bg-green-600 text-white px-6 py-3 rounded-xl">
              Submit Review
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

          {product.reviews?.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-4 rounded-xl shadow mb-3"
              >
                <p className="font-semibold">{review.name}</p>
                <p>⭐ {review.rating}</p>
                <p className="text-slate-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
