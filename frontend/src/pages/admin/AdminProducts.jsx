import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductImage from "../../components/ProductImage";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    stock: "",
    badge: "New",
    image: "",
  });

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
    const { data } = await API.get("/products");
    setProducts(data.products || []);
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        badge: form.badge,
        images: [{ url: form.image, public_id: "admin_product" }],
        tags: [form.category, form.brand],
        isFeatured: true,
      });

      alert("Product added");
      setForm({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "",
        stock: "",
        badge: "New",
        image: "",
      });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Product add failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      alert("Product deleted");
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      <form
        onSubmit={addProduct}
        className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-2 gap-4"
      >
        {Object.keys(form).map((field) => (
          <input
            key={field}
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="border px-4 py-3 rounded-lg"
          />
        ))}

        <button className="bg-indigo-600 text-white py-3 rounded-lg md:col-span-2">
          Add Product
        </button>
      </form>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-xl shadow">
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

              <button
                onClick={() => deleteProduct(product._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
