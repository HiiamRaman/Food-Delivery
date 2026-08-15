import React, { useEffect, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/axios.client";
import "./Favorites.css";

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/favorites");

      const data =
        response.data?.data ||
        response.data?.favorites ||
        [];

      setFavorites(data);
    } catch (error) {
      console.error(
        "LOAD FAVORITES ERROR:",
        error,
      );

      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to load favorites",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (foodId) => {
    try {
      await api.delete(
        `/favorites/remove/${foodId}`,
      );

      setFavorites((prev) =>
        prev.filter(
          (food) => food._id !== foodId,
        ),
      );

      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to remove favorite",
      );
    }
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <p className="favorites-loading">
          Loading favorites...
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        {/* Header */}

        <div className="favorites-header">
          <div>
            <span className="favorites-eyebrow">
              SAVED FOR LATER
            </span>

            <h1>Favorites</h1>

            <p>
              Keep your favorite meals close and
              order them anytime.
            </p>
          </div>

          <div className="favorites-count">
            <Heart size={18} />

            {favorites.length}
          </div>
        </div>

        {/* Empty */}

        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">
              <Heart size={34} />
            </div>

            <h2>No favorites yet</h2>

            <p>
              Save meals you love and they’ll
              appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/food-display")
              }
            >
              <ShoppingBag size={17} />
              Explore meals
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((food) => (
              <article
                key={food._id}
                className="favorite-card"
              >
                <div className="favorite-image">
                  <img
                    src={
                      food.image ||
                      food.imageUrl
                    }
                    alt={food.name}
                  />

                  <button
                    type="button"
                    className="favorite-remove"
                    onClick={() =>
                      removeFavorite(food._id)
                    }
                    aria-label="Remove favorite"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="favorite-content">
                  <span className="favorite-category">
                    {food.category ||
                      "Popular"}
                  </span>

                  <h3>{food.name}</h3>

                  <p>
                    {food.description ||
                      "A delicious meal waiting for you."}
                  </p>

                  <div className="favorite-bottom">
                    <strong>
                      Rs. {food.price || 0}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/food-display?search=${encodeURIComponent(
                            food.name,
                          )}`,
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
