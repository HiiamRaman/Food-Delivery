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

import "./FoodDetails.css";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    food_list = [],
    cartItems = {},
    addToCart,
    removeFromCart,
    token,
  } = useContext(StoreContext);

  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);

  const [copied, setCopied] = useState(false);

  const [isImageModalOpen, setIsImageModalOpen] =
    useState(false);

  const food = food_list.find(
    (item) => item._id === id
  );

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!token || !id) return;

      try {
        setIsCheckingFavorite(true);

        const response = await api.get(
          `/favorites/check/${id}`
        );

        setFavorite(
          response.data?.isFavorite ||
            response.data?.data?.isFavorite ||
            false
        );
      } catch (error) {
        console.error(
          "Error fetching favorite status:",
          error
        );
      } finally {
        setIsCheckingFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [id, token]);

  if (!food) {
    return (
      <div className="food-not-found">
        <h2>Food item not found</h2>

        <p>
          This item is currently unavailable or has
          been removed.
        </p>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const quantity = cartItems[food._id] || 0;

  const itemSubtotal =
    food.price * quantity;

  const handleShare = () => {
    if (!navigator.clipboard) return;

    navigator.clipboard.writeText(
      window.location.href
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleFavorite = async () => {
    if (!token) {
      toast.info(
        "Please login to save favorites"
      );

      return;
    }

    if (
      favoriteLoading ||
      isCheckingFavorite
    ) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (favorite) {
        await api.delete(
          `/favorites/remove/${id}`
        );

        setFavorite(false);

        toast.info(
          "Removed from favorites"
        );
      } else {
        const response = await api.post(
          `/favorites/${id}`
        );

        if (
          response.data?.alreadyExists
        ) {
          toast.info(
            "Item is already in your favorites"
          );
        } else {
          toast.success(
            "Added to favorites"
          );
        }

        setFavorite(true);
      }
    } catch (error) {
      console.error(
        "FAVORITE ERROR:",
        error
      );

      const errorMessage =
        error.response?.data?.data ||
        error.response?.data?.message ||
        "";

      if (
        errorMessage
          .toLowerCase()
          .includes("already")
      ) {
        toast.info(
          "Item is already in your favorites"
        );

        setFavorite(true);
      } else {
        toast.error(
          errorMessage ||
            "Unable to update favorites"
        );
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <section className="food-details-page">
      <div className="food-details-card">
        <div className="food-details-grid">
          {/* IMAGE */}

          <div className="food-image-section">
            <img
              src={food.image}
              alt={food.name}
              className="food-details-image"
            />

            <span className="food-category">
              {food.category}
            </span>

            <button
              className="expand-image-btn"
              onClick={() =>
                setIsImageModalOpen(true)
              }
              aria-label="Enlarge image"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* CONTENT */}

          <div className="food-info-section">
            <div>
              {/* TOP ACTIONS */}

              <div className="food-top-actions">
                <button
                  className="back-menu-btn"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={14} />

                  Back to menu
                </button>

                <div className="food-icon-actions">
                  {/* FAVORITE */}

                  <button
                    type="button"
                    onClick={
                      handleFavorite
                    }
                    disabled={
                      favoriteLoading ||
                      isCheckingFavorite
                    }
                    aria-label={
                      favorite
                        ? `Remove ${food.name} from favorites`
                        : `Add ${food.name} to favorites`
                    }
                    className={`food-icon-btn ${
                      favorite
                        ? "favorite-active"
                        : ""
                    }`}
                  >
                    {isCheckingFavorite ||
                    favoriteLoading ? (
                      <Loader2
                        size={15}
                        className="spinner"
                      />
                    ) : (
                      <Heart
                        size={16}
                        className={
                          favorite
                            ? "heart-filled"
                            : ""
                        }
                      />
                    )}
                  </button>

                  {/* SHARE */}

                  <div className="share-wrapper">
                    <button
                      className="food-icon-btn"
                      onClick={
                        handleShare
                      }
                      aria-label="Share item"
                    >
                      {copied ? (
                        <Check
                          size={16}
                          className="share-success"
                        />
                      ) : (
                        <Share2
                          size={16}
                        />
                      )}
                    </button>

                    {copied && (
                      <span className="copied-message">
                        Link copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* TAGS */}

              <div className="food-tags">
                <div className="rating-badge">
                  <Star
                    size={14}
                    className="rating-star"
                  />

                  <span>4.8</span>

                  <span className="review-count">
                    (120+ reviews)
                  </span>
                </div>

                <div className="fresh-badge">
                  <ShieldCheck
                    size={13}
                  />

                  Freshly Prepared
                </div>
              </div>

              {/* NAME */}

              <h1 className="food-details-title">
                {food.name}
              </h1>

              {/* DESCRIPTION */}

              <p className="food-details-description">
                {food.description}
              </p>

              {/* METRICS */}

              <div className="food-metrics">
                <div className="food-metric">
                  <Clock size={15} />

                  <span>
                    20–30 min delivery
                  </span>
                </div>

                <div className="metric-divider" />

                <div className="food-metric">
                  <Flame size={15} />

                  <span>
                    ~350 kcal
                  </span>
                </div>

                <div className="metric-divider" />

                <div className="food-metric">
                  <UtensilsCrossed
                    size={14}
                  />

                  <span>
                    Made to order
                  </span>
                </div>
              </div>

              {/* PRICE */}

              <div className="food-price-section">
                <div>
                  <span className="price-label">
                    Unit Price
                  </span>

                  <p className="food-price">
                    Rs. {food.price}
                  </p>
                </div>

                {quantity > 0 && (
                  <div className="subtotal-section">
                    <span className="price-label">
                      Subtotal (
                      {quantity})
                    </span>

                    <p className="food-subtotal">
                      Rs.{" "}
                      {itemSubtotal}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CART */}

            <div className="food-cart-actions">
              {quantity > 0 && (
                <div className="quantity-control">
                  <button
                    onClick={() =>
                      removeFromCart(
                        food._id
                      )
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    className="quantity-add-btn"
                    onClick={() =>
                      addToCart(
                        food._id
                      )
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              )}

              <button
                onClick={() =>
                  addToCart(food._id)
                }
                className="main-cart-btn"
              >
                <ShoppingBag
                  size={18}
                />

                <span>
                  {quantity > 0
                    ? "Add Another"
                    : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}

      {isImageModalOpen && (
        <div className="image-modal">
          <div className="image-modal-content">
            <button
              className="close-modal-btn"
              onClick={() =>
                setIsImageModalOpen(
                  false
                )
              }
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <img
              src={food.image}
              alt={food.name}
              className="modal-food-image"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FoodDetails;
