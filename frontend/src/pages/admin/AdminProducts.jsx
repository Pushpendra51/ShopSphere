
import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductImage from "../../components/ProductImage";

const initialForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  brand: "",
  stock: "",
  badge: "New",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    API.get("/products")
      .then(({ data }) => {
        if (active) setProducts(data.products || []);
      })
      .catch(() => {
        if (active) alert("Failed to load products");
      });

    return () => {
      active = false;
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products || []);
    } catch {
      alert("Failed to refresh products");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", Number(form.price));
      formData.append(
        "discountPrice",
        form.discountPrice === "" ? 0 : Number(form.discountPrice)
      );
      formData.append("category", form.category.trim());
      formData.append("brand", form.brand.trim());
      formData.append("stock", Number(form.stock));
      formData.append("badge", form.badge);
      formData.append("isFeatured", "true");

      // Preserve category and brand as product tags
      formData.append("tags", form.category.trim());
      formData.append("tags", form.brand.trim());

      // Image is optional while editing
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
        alert("Product updated successfully");
      } else {
        await API.post("/products", formData);
        alert("Product added successfully");
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (editingId ? "Product update failed" : "Product add failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock ?? "",
      badge: product.badge || "New",
    });

    setSelectedImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);

      if (editingId === id) {
        resetForm();
      }

      alert("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      {/* Add / Edit Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-2 gap-4"
      >
        <h2 className="text-xl font-bold md:col-span-2">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border px-4 py-3 rounded-lg"
        />

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          required
          className="border px-4 py-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          required
          className="border px-4 py-3 rounded-lg md:col-span-2"
          rows={3}
        />

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border px-4 py-3 rounded-lg"
        />

        <input
          name="discountPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="Discount Price"
          value={form.discountPrice}
          onChange={handleChange}
          className="border px-4 py-3 rounded-lg"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          className="border px-4 py-3 rounded-lg"
        />

        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="border px-4 py-3 rounded-lg"
        />

        <select
          name="badge"
          value={form.badge}
          onChange={handleChange}
          className="border px-4 py-3 rounded-lg"
        >
          {["New", "Trending", "Best Seller", "Out of Stock", ""].map(
            (badge) => (
              <option key={badge || "none"} value={badge}>
                {badge || "No Badge"}
              </option>
            )
          )}
        </select>

        <div className="md:col-span-2">
          <label className="block font-medium mb-2">
            Product Image {editingId ? "(Optional - select to replace)" : ""}
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setSelectedImage(e.target.files?.[0] || null)
            }
            className="border px-4 py-3 rounded-lg w-full"
          />

          {selectedImage && (
            <p className="text-sm text-slate-500 mt-2">
              Selected: {selectedImage.name}
            </p>
          )}

          {editingId && !selectedImage && (
            <p className="text-sm text-slate-500 mt-2">
              Current product image will be retained.
            </p>
          )}

          <p className="text-xs text-slate-500 mt-2">
            Accepted image files up to 5 MB.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg md:col-span-2"
        >
          {loading
            ? "Please wait..."
            : editingId
              ? "Update Product"
              : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="bg-slate-200 hover:bg-slate-300 py-3 rounded-lg md:col-span-2"
          >
            Cancel Editing
          </button>
        )}
      </form>

      {/* Product List */}
      <h2 className="text-2xl font-bold mb-6">Existing Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <ProductImage
                product={product}
                alt={product.name}
                className="aspect-square w-full object-contain rounded-lg bg-slate-50"
              />

              <h2 className="font-bold mt-4">{product.name}</h2>

              <p className="text-slate-500">{product.brand}</p>

              <p className="text-indigo-600 font-bold">
                ₹{product.discountPrice || product.price}
              </p>

              <p className="text-sm">Stock: {product.stock}</p>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => editProduct(product)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
