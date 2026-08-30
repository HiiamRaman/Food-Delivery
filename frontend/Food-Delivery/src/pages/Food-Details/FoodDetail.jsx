import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Check,
  Clock,
  Flame,
  Heart,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { StoreContext } from "../../Context/StoreContext";
import api from "../../utils/axios.client";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    food_list = [],
    cartItems = {},
    addToCart,
    removeFromCart,
    token, // Token from StoreContext
  } = useContext(StoreContext);

  // Component States
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false); // Initial load check
  const [copied, setCopied] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const food = food_list.find((item) => item._id === id);

  // 1. FETCH INITIAL FAVORITE STATUS WHEN COMPONENT MOUNTS
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Don't fetch if no user token or food ID
      if (!token || !id) return;

      try {
        setIsCheckingFavorite(true);
        // Call your backend endpoint to check if item is favorited
        const response = await api.get(`/favorites/check/${id}`);

        // Assuming your backend returns { isFavorite: true/false } or { data: { isFavorite: true } }
        setFavorite(
          response.data?.isFavorite || response.data?.data?.isFavorite || false,
        );
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      } finally {
        setIsCheckingFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [id, token]);

  // Fallback View if item doesn't exist
  if (!food) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Food item not found
        </h2>
        <p className="mt-2 text-gray-500">
          This item is currently unavailable or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-orange-500 px-6 py-2.5 font-semibold text-white transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const quantity = cartItems[food._id] || 0;
  const itemSubtotal = food.price * quantity;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 2. TOGGLE FAVORITE WITH VALIDATION
 const handleFavorite = async () => {
  if (!token) {
    toast.info("Please login to save favorites");
    return;
  }

  if (favoriteLoading || isCheckingFavorite) return;

  try {
    setFavoriteLoading(true);

    if (favorite) {
      // If already a favorite, remove it (or show a toast if you don't want to remove)
      await api.delete(`/favorites/remove/${id}`);
      setFavorite(false);
      toast.info("Removed from favorites");
    } else {
      const response = await api.post(`/favorites/${id}`);

      // If your backend responds with a status indicating it was already added
      if (response.data?.alreadyExists) {
        toast.info("Item is already in your favorites");
      } else {
        toast.success("Added to favorites");
      }

      setFavorite(true);
    }
  } catch (error) {
    console.error("FAVORITE ERROR:", error);

    // Check if the backend error message states it's already added (e.g., status 400 or 409)
    const errorMessage =
      error.response?.data?.data ||
      error.response?.data?.message ||
      "";

    if (errorMessage.toLowerCase().includes("already")) {
      toast.info("Item is already in your favorites");
      setFavorite(true); // Sync state
    } else {
      toast.error(errorMessage || "Unable to update favorites");
    }
  } finally {
    setFavoriteLoading(false);
  }
};
  return (
    <section className="flex min-h-[85vh] items-center justify-center bg-gray-50/50 py-10 px-4">
      <div className="w-full max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 md:p-10">
        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:gap-12">
          {/* COLUMN 1: IMAGE & BADGES */}
          <div className="group relative flex h-72 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:h-80 md:h-full min-h-[320px]">
            <img
              src={food.image}
              alt={food.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Category Tag */}
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm backdrop-blur-md">
              {food.category}
            </span>

            {/* Expand Image Trigger */}
            <button
              onClick={() => setIsImageModalOpen(true)}
              aria-label="Enlarge image"
              className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/80"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* COLUMN 2: INFO & ACTIONS */}
          <div className="flex flex-col justify-between">
            <div>
              {/* TOP ACTION BAR (Back, Wishlist, Share) */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1 text-xs font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <ArrowLeft size={14} />
                  Back to menu
                </button>

                <div className="flex items-center gap-2">
                  {/* FAVORITE HEART BUTTON */}
                  <button
                    type="button"
                    onClick={handleFavorite}
                    disabled={favoriteLoading || isCheckingFavorite}
                    aria-label={
                      favorite
                        ? `Remove ${food.name} from favorites`
                        : `Add ${food.name} to favorites`
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
                      favorite
                        ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                        : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                  >
                    {isCheckingFavorite || favoriteLoading ? (
                      <Loader2
                        size={15}
                        className="animate-spin text-gray-400"
                      />
                    ) : (
                      <Heart
                        size={16}
                        className={favorite ? "fill-red-500 text-red-500" : ""}
                      />
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="Share item"
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-700"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Share2 size={16} />
                    )}
                    {copied && (
                      <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded bg-gray-900 px-2 py-0.5 text-[10px] font-medium text-white shadow">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* RATING & DIETARY TAG */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-100">
                  <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  <span>4.8</span>
                  <span className="text-gray-400 font-normal">
                    (120+ reviews)
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                  <ShieldCheck size={13} />
                  Freshly Prepared
                </span>
              </div>

              {/* TITLE */}
              <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
                {food.name}
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
                {food.description}
              </p>

              {/* ESSENTIAL METRICS */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={15} className="text-orange-500" />
                  <span>20–30 min delivery</span>
                </div>
                <div className="h-3.5 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <Flame size={15} className="text-orange-500" />
                  <span>~350 kcal</span>
                </div>
                <div className="h-3.5 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed size={14} className="text-orange-500" />
                  <span>Made to order</span>
                </div>
              </div>

              {/* PRICE & SUBTOTAL */}
              <div className="mt-6 border-t border-gray-100 pt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Unit Price
                  </span>
                  <p className="text-3xl font-black text-gray-950">
                    Rs. {food.price}
                  </p>
                </div>

                {quantity > 0 && (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Subtotal ({quantity})
                    </span>
                    <p className="text-lg font-extrabold text-orange-600">
                      Rs. {itemSubtotal}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CART CONTROLS */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {quantity > 0 && (
                <div className="flex h-12 items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-3 shadow-inner sm:w-36">
                  <button
                    onClick={() => removeFromCart(food._id)}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="text-base font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => addToCart(food._id)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              )}

              <button
                onClick={() => addToCart(food._id)}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <ShoppingBag size={18} />
                <span>{quantity > 0 ? "Add Another" : "Add to Cart"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX IMAGE MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              aria-label="Close modal"
              className="absolute -top-12 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition"
            >
              <X size={20} />
            </button>
            <img
              src={food.image}
              alt={food.name}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FoodDetails;
