import { useEffect, useState } from "react";
import API from "../services/api";
import ProductImage from "../components/ProductImage";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get("/wishlist");
      setWishlist(data.wishlist.products || []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Wishlist could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      fetchWishlist();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Wishlist update failed."
      );
    }
  };

  useEffect(() => {
    let active = true;
    API.get("/wishlist")
      .then(({ data }) => {
        if (active) setWishlist(data.wishlist.products || []);
      })
      .catch(() => {
        if (active) setError("Wishlist could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}

        {loading ? (
          <p>Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow p-4"
              >
                <ProductImage
                  product={product}
                  alt={product.name}
                  className="aspect-square w-full object-contain rounded-lg bg-slate-50"
                />

                <h2 className="text-lg font-semibold mt-4">
                  {product.name}
                </h2>

                <p className="text-indigo-600 font-bold mt-2">
                  ₹{product.discountPrice > 0
                    ? product.discountPrice
                    : product.price}
                </p>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
