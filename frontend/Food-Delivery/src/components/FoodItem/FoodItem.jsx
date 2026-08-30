import React, { useContext, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext.jsx";
import api from "../../utils/axios.client";

import "./FoodItem.css";

function FoodItem({ id, name, price, description, image, isFavorite = false }) {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, token } =
    useContext(StoreContext);

  const [favorite, setFavorite] = useState(isFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // ================= FAVORITE =================

  const handleFavorite = async (e) => {
    // Stop event from bubbling up to the card navigation
    e.stopPropagation();

    if (!token) {
      toast.info("Please login to save favorites");
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      if (favorite) {
        await api.delete(`/favorites/remove/${id}`);
        setFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api.post(`/favorites/${id}`);
        setFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("FAVORITE ERROR:", error);

      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to update favorites",
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="food-item" onClick={() => navigate(`/food/${id}`)}>
      {/* ================= IMAGE ================= */}

      <div className="food-item-image-container">
        <img className="food-item-image" src={image} alt={name} />

        {/* ================= FAVORITE BUTTON ================= */}

        <button
          type="button"
          className={`food-favorite-btn ${favorite ? "active" : ""}`}
          onClick={handleFavorite}
          disabled={favoriteLoading}
          aria-label={
            favorite
              ? `Remove ${name} from favorites`
              : `Add ${name} to favorites`
          }
        >
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </button>

        {/* ================= CART ================= */}

        {!cartItems[id] ? (
          <img
            className="add"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id);
            }}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div
            className="food-item-counter"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(id);
              }}
              src={assets.remove_icon_red}
              alt="Decrease quantity"
            />

            <p>{cartItems[id]}</p>

            <img
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id);
              }}
              src={assets.add_icon_green}
              alt="Increase quantity"
            />
          </div>
        )}
      </div>

      {/* ================= INFO ================= */}

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>

        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">Rs. {price}</p>
      </div>
    </div>
  );
}

export default FoodItem;
