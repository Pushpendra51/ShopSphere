import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { getCuratedProductImage } from "../data/productImages";

const heroSlides = [
  {
    eyebrow: "THE EVERYDAY EDIT",
    title: "Good things, picked for you.",
    description:
      "Thoughtful tech and everyday essentials, all in one place.",
    image: "/product-images/headphones.jpg",
    imageAlt: "Wireless headphones from the ShopSphere collection",
    button: "Explore the collection",
  },
  {
    eyebrow: "MAKE ROOM FOR MORE",
    title: "Upgrade your downtime.",
    description: "Settle in with a better screen and a little more comfort.",
    image: "/product-images/smart-tv.jpg",
    imageAlt: "Smart TV from the ShopSphere collection",
    button: "Find your next favorite",
  },
  {
    eyebrow: "READY WHEN YOU ARE",
    title: "Made for your next big idea.",
    description: "The gear you need to capture a fresh perspective.",
    image: "/product-images/dslr-camera.jpg",
    imageAlt: "DSLR camera from the ShopSphere collection",
    button: "Shop popular picks",
  },
];

const promoTiles = [
  {
    eyebrow: "THE SOUND EDIT",
    title: "Bring your playlist along.",
    image: "/product-images/bluetooth-speaker.jpg",
    imageAlt: "Portable Bluetooth speaker",
    category: "Audio",
    className: "bg-[#eee9e2]",
  },
  {
    eyebrow: "WORK, REIMAGINED",
    title: "Make space for focus.",
    image: "/product-images/office-chair.jpg",
    imageAlt: "Ergonomic chair for a home office",
    category: "Furniture",
    className: "bg-[#e7e9ef]",
  },
];

const categoryAccents = [
  "bg-[#e9e9ff]",
  "bg-[#f6e8df]",
  "bg-[#e6f0e9]",
  "bg-[#f3e8f4]",
  "bg-[#e9edf4]",
  "bg-[#f4eedf]",
];

const categoryImageProducts = {
  Audio: "Wireless Bluetooth Speaker",
  Computers: "Gaming Mechanical Keyboard",
  Electronics: "4K Ultra HD Smart TV 55",
  Fashion: "Minimalist Leather Backpack",
  Furniture: "Ergonomic Office Chair",
  Grocery: "Premium Cashew Nuts (500g)",
  "Home & Kitchen": "Stainless Steel Cookware Set (5 pcs)",
  "Personal Care": "Eco-Friendly Bamboo Toothbrush Set (4 pcs)",
  Photography: "Professional DSLR Camera",
  Wearables: "Smart Fitness Watch",
};

function ProductSection({ id, eyebrow, title, products, loading, error }) {
  return (
    <section id={id} className="store-section scroll-mt-32">
      <div className="store-shell">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="store-eyebrow">{eyebrow}</p>
            <h2 className="store-section-title">{title}</h2>
          </div>
          <a
            href="#featured"
            className="store-text-link"
            aria-label={`Browse ${title.toLowerCase()}`}
          >
            View the collection <span aria-hidden="true">→</span>
          </a>
        </div>

        {error ? (
          <p role="alert" className="store-message store-message-error">
            {error}
          </p>
        ) : loading ? (
          <p className="store-message">Finding your next favorite…</p>
        ) : products.length === 0 ? (
          <p className="store-message">No products found. Try another search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const queryKey = JSON.stringify([search.trim(), category]);

  useEffect(() => {
    let active = true;

    API.get("/products/categories")
      .then(({ data }) => {
        if (active) setCategories(data.categories || []);
      })
      .catch(() => {
        if (active) setCategoryError("Categories could not be loaded.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);

    API.get(`/products?${params.toString()}`)
      .then(({ data }) => {
        if (active) {
          setProducts(data.products || []);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setProducts([]);
          setError("Products could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (active) setLoadedQuery(queryKey);
      });

    return () => {
      active = false;
    };
  }, [search, category, queryKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const newestProducts = useMemo(
    () =>
      [...products]
        .sort(
          (left, right) =>
            new Date(right.createdAt || 0).getTime() -
            new Date(left.createdAt || 0).getTime()
        )
        .slice(0, 4),
    [products]
  );

  const bestSellers = useMemo(
    () =>
      [...products]
        .sort(
          (left, right) =>
            (right.soldCount || 0) - (left.soldCount || 0) ||
            (right.rating || 0) - (left.rating || 0)
        )
        .slice(0, 4),
    [products]
  );

  const handleCategoryClick = (selectedCategory) => {
    const params = new URLSearchParams(searchParams);
    if (category === selectedCategory) {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }
    setSearchParams(params);
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  };

  const loading = loadedQuery !== queryKey;
  const visibleSlides = heroSlides[activeSlide];
  const showCuratedSections = !search && !category;

  return (
    <main id="top" className="storefront">
      <section
        className="store-hero"
        aria-label="ShopSphere featured collection"
        aria-roledescription="carousel"
      >
        <div className="store-hero-glow" aria-hidden="true" />
        <div className="store-shell store-hero-inner">
          <div className="store-hero-copy" key={visibleSlides.title}>
            <p className="store-hero-eyebrow">
              <span className="store-hero-eyebrow-dot" />
              {visibleSlides.eyebrow}
            </p>
            <h1>{visibleSlides.title}</h1>
            <p className="store-hero-description">
              {visibleSlides.description}
            </p>
            <a className="store-primary-button" href="#featured">
              {visibleSlides.button}
              <span aria-hidden="true">→</span>
            </a>
            <p className="store-hero-note">
              A little inspiration for wherever life takes you.
            </p>
          </div>

          <div className="store-hero-art">
            <div className="store-hero-orbit" aria-hidden="true" />
            <div className="store-hero-image-wrap">
              <img
                key={visibleSlides.image}
                src={visibleSlides.image}
                alt={visibleSlides.imageAlt}
                className="store-hero-image"
              />
            </div>
            <div className="store-hero-caption">
              <span className="store-hero-caption-dot" />
              <span>Curated for everyday</span>
            </div>
            <div className="store-hero-index" aria-hidden="true">
              0{activeSlide + 1}
              <span> / 0{heroSlides.length}</span>
            </div>
          </div>

          <div className="store-hero-controls">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                className={`store-hero-dot ${
                  activeSlide === index ? "is-active" : ""
                }`}
                aria-label={`Show slide ${index + 1}: ${slide.title}`}
                aria-current={activeSlide === index ? "true" : undefined}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="store-category-section"
        aria-labelledby="category-title"
      >
        <div className="store-shell">
          <div className="store-section-heading">
            <div>
              <p className="store-eyebrow">A GOOD PLACE TO START</p>
              <h2 id="category-title" className="store-section-title">
                Find your kind of good.
              </h2>
            </div>
            {category && (
              <button
                type="button"
                className="store-clear-filter"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete("category");
                  setSearchParams(params);
                }}
              >
                Clear filter <span aria-hidden="true">×</span>
              </button>
            )}
          </div>

          {categoryError && (
            <p role="alert" className="store-message store-message-error">
              {categoryError}
            </p>
          )}

          <div className="store-category-grid">
            {categories.map((categoryName, index) => {
              const product = products.find(
                (item) => item.category === categoryName
              );
              const imageProduct = categoryImageProducts[categoryName]
                ? { name: categoryImageProducts[categoryName] }
                : product;
              const image = imageProduct && getCuratedProductImage(imageProduct);
              return (
                <button
                  key={categoryName}
                  type="button"
                  className={`store-category-card ${
                    category === categoryName ? "is-selected" : ""
                  } ${categoryAccents[index % categoryAccents.length]}`}
                  onClick={() => handleCategoryClick(categoryName)}
                  aria-pressed={category === categoryName}
                >
                  <span className="store-category-image">
                    {image ? (
                      <img src={image} alt="" loading="lazy" />
                    ) : product ? (
                      <ProductImage
                        product={product}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="store-category-placeholder">
                        {categoryName.slice(0, 1)}
                      </span>
                    )}
                  </span>
                  <span className="store-category-name">{categoryName}</span>
                  <span className="store-category-cta">
                    Explore <span aria-hidden="true">↗</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <ProductSection
        id="featured"
        eyebrow={search || category ? "YOUR SEARCH, YOUR PICKS" : "THE SHOPSPHERE EDIT"}
        title={search || category ? "Products for you." : "Featured finds."}
        products={
          search || category || showAllProducts
            ? products
            : products.slice(0, 4)
        }
        loading={loading}
        error={error}
      />
      {!search && !category && products.length > 4 && (
        <div className="store-more-products store-shell">
          <button
            type="button"
            className="store-more-products-button"
            onClick={() => setShowAllProducts((current) => !current)}
          >
            {showAllProducts
              ? "Show fewer products"
              : `Explore all ${products.length} products`}
            <span aria-hidden="true">{showAllProducts ? "↑" : "→"}</span>
          </button>
        </div>
      )}

      {showCuratedSections && (
        <>
          <section className="store-promo-section">
            <div className="store-shell store-promo-grid">
              {promoTiles.map((tile) => (
                <button
                  key={tile.title}
                  type="button"
                  className={`store-promo-tile ${tile.className}`}
                  onClick={() => handleCategoryClick(tile.category)}
                >
                  <span className="store-promo-copy">
                    <span className="store-eyebrow">{tile.eyebrow}</span>
                    <span className="store-promo-title">{tile.title}</span>
                    <span className="store-promo-link">
                      Shop the edit <span aria-hidden="true">→</span>
                    </span>
                  </span>
                  <img src={tile.image} alt={tile.imageAlt} loading="lazy" />
                </button>
              ))}
            </div>
          </section>

          <ProductSection
            id="new-arrivals"
            eyebrow="JUST LANDED"
            title="New to the shelf."
            products={newestProducts}
            loading={loading}
            error={error}
          />

          <section className="store-offer-section">
            <div className="store-shell">
              <div className="store-offer">
                <div className="store-offer-mark" aria-hidden="true">
                  %
                </div>
                <div className="store-offer-copy">
                  <p className="store-eyebrow">A LITTLE SOMETHING EXTRA</p>
                  <h2>A warm welcome, on us.</h2>
                  <p>
                    Use WELCOME10 at checkout for 10% off your first order.
                  </p>
                </div>
                <div className="store-offer-code">
                  <span>YOUR CODE</span>
                  <strong>WELCOME10</strong>
                </div>
                <Link to="/register" className="store-offer-button">
                  Join ShopSphere <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>

          <ProductSection
            id="best-sellers"
            eyebrow="COMMUNITY FAVORITES"
            title="Loved for a reason."
            products={bestSellers}
            loading={loading}
            error={error}
          />
        </>
      )}

      <section className="store-promise-section">
        <div className="store-shell store-promise-grid">
          <div>
            <span aria-hidden="true">✳</span>
            <div>
              <strong>Thoughtful finds</strong>
              <p>Everyday picks worth keeping.</p>
            </div>
          </div>
          <div>
            <span aria-hidden="true">♡</span>
            <div>
              <strong>Here for the details</strong>
              <p>Real support when you need it.</p>
            </div>
          </div>
          <div>
            <span aria-hidden="true">↻</span>
            <div>
              <strong>Shopping, made simple</strong>
              <p>A smoother way to find your favorite.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="store-footer">
        <div className="store-shell">
          <div className="store-footer-main">
            <div className="store-footer-brand">
              <Link to="/" className="store-brand store-brand-footer">
                <span className="store-brand-mark" aria-hidden="true">
                  S
                </span>
                <span className="store-brand-word">
                  shop<span>sphere</span>
                </span>
              </Link>
              <p>
                The little details make a big difference. Find things you&apos;ll
                love, all in one place.
              </p>
            </div>
            <div className="store-footer-links">
              <div>
                <h3>Discover</h3>
                <a href="/#categories">Shop all</a>
                <a href="/#new-arrivals">New arrivals</a>
                <a href="/#best-sellers">Best sellers</a>
              </div>
              <div>
                <h3>Your ShopSphere</h3>
                <Link to="/profile">My account</Link>
                <Link to="/dashboard">My orders</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/cart">Shopping cart</Link>
              </div>
              <div>
                <h3>Get started</h3>
                <Link to="/login">Sign in</Link>
                <Link to="/register">Create an account</Link>
                <a href="/#featured">Explore products</a>
              </div>
            </div>
          </div>
          <div className="store-footer-bottom">
            <span>© {new Date().getFullYear()} ShopSphere. Made for everyday.</span>
            <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
