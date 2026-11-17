import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductImage from "../components/ProductImage";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart");
      setCart(data.cart);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Cart could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    API.get("/cart")
      .then(({ data }) => {
        if (active) setCart(data.cart);
      })
      .catch(() => {
        if (active) setError("Cart could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      await API.put("/cart", { productId, quantity });
      await fetchCart();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Cart update failed."
      );
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Cart update failed."
      );
    }
  };

  const total =
    cart?.items?.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = item.product.discountPrice > 0
        ? item.product.discountPrice
        : item.product.price;
      return sum + price * item.quantity;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">My Cart</h1>

        {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
        {loading ? (
          <p>Loading cart...</p>
        ) : !cart?.items?.length ? (
          <div>
            <p>Your cart is empty.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 text-indigo-600 underline"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id || item.product?._id}
                  className="bg-white p-4 rounded-xl shadow flex gap-4"
                >
                  <ProductImage
                    product={item.product}
                    alt={item.product.name}
                    className="h-28 w-28 flex-shrink-0 object-contain rounded-lg bg-slate-50"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item.product.name}
                    </h2>

                    <p className="text-indigo-600 font-bold mt-2">
                      ₹{item.product.discountPrice > 0
                        ? item.product.discountPrice
                        : item.product.price}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="ml-4 text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <p className="flex justify-between mb-3">
                <span>Total</span>
                <span className="font-bold">₹{total}</span>
              </p>

              <button
                disabled={!cart.items.length}
                onClick={() => navigate("/checkout")}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
