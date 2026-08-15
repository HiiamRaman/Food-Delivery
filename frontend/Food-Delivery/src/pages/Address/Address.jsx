import React, { useEffect, useState } from "react";
import {
  Check,
  Home,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../utils/axios.client";
import "./Address.css";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Nepal",
    isDefault: false,
  });

  // ================= LOAD =================

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/addresses");

      const fetchedAddresses =
        response.data?.data?.addresses || [];

      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error("LOAD ADDRESSES ERROR:", error);

      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to load addresses",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // ================= CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= RESET =================

  const resetForm = () => {
    setFormData({
      label: "Home",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Nepal",
      isDefault: false,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        response = await api.patch(
          `/addresses/${editingId}`,
          {
            label: formData.label,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
        );

        toast.success("Address updated successfully");
      } else {
        response = await api.post("/addresses", formData);

        toast.success("Address added successfully");
      }

      const updatedAddresses =
        response.data?.data?.addresses || [];

      setAddresses(updatedAddresses);

      resetForm();
    } catch (error) {
      console.error("ADDRESS SAVE ERROR:", error);

      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to save address",
      );
    }
  };

  // ================= EDIT =================

  const handleEdit = (address) => {
    setFormData({
      label: address.label || "Home",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
      country: address.country || "Nepal",
      isDefault: address.isDefault || false,
    });

    setEditingId(address._id);
    setShowForm(true);
  };

  // ================= DEFAULT =================

  const handleSetDefault = async (addressId) => {
    try {
      const response = await api.patch(
        `/addresses/${addressId}/default`,
      );

      const updatedAddresses =
        response.data?.data?.addresses || [];

      setAddresses(updatedAddresses);

      toast.success("Default address updated");
    } catch (error) {
      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to update default address",
      );
    }
  };

  // ================= DELETE =================

  const handleDelete = async (addressId) => {
    try {
      const response = await api.delete(
        `/addresses/${addressId}`,
      );

      const updatedAddresses =
        response.data?.data?.addresses || [];

      setAddresses(updatedAddresses);

      toast.success("Address deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to delete address",
      );
    }
  };

  return (
    <div className="addresses-page">
      <div className="addresses-container">
        {/* ================= HEADER ================= */}

        <div className="addresses-header">
          <div>
            <span className="addresses-eyebrow">
              DELIVERY DETAILS
            </span>

            <h1>Saved Addresses</h1>

            <p>
              Manage the places where you want your orders delivered.
            </p>
          </div>

          <button
            type="button"
            className="add-address-btn"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <Plus size={17} />
            Add address
          </button>
        </div>

        {/* ================= FORM ================= */}

        {showForm && (
          <div className="address-form-card">
            <div className="address-form-header">
              <div>
                <h2>
                  {editingId ? "Edit address" : "Add new address"}
                </h2>

                <p>
                  Enter the delivery details below.
                </p>
              </div>

              <button
                type="button"
                className="close-address-form"
                onClick={resetForm}
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="address-form"
              onSubmit={handleSubmit}
            >
              <div className="address-field">
                <label>Label</label>

                <select
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="address-field">
                <label>Street</label>

                <input
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street and house number"
                />
              </div>

              <div className="address-grid">
                <div className="address-field">
                  <label>City</label>

                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kathmandu"
                  />
                </div>

                <div className="address-field">
                  <label>State</label>

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Bagmati"
                  />
                </div>
              </div>

              <div className="address-grid">
                <div className="address-field">
                  <label>ZIP Code</label>

                  <input
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="44600"
                  />
                </div>

                <div className="address-field">
                  <label>Country</label>

                  <input
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Nepal"
                  />
                </div>
              </div>

              {!editingId && (
                <label className="default-checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                  />

                  <span>Make this my default address</span>
                </label>
              )}

              <button
                type="submit"
                className="save-address-btn"
              >
                {editingId
                  ? "Update address"
                  : "Save address"}
              </button>
            </form>
          </div>
        )}

        {/* ================= CONTENT ================= */}

        {loading ? (
          <div className="addresses-loading">
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="addresses-empty">
            <div>
              <MapPin size={34} />
            </div>

            <h2>No saved addresses</h2>

            <p>
              Add a delivery address so checkout becomes faster.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} />
              Add your first address
            </button>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((address) => (
              <article
                key={address._id}
                className={`address-card ${
                  address.isDefault ? "default" : ""
                }`}
              >
                <div className="address-card-top">
                  <div className="address-type-icon">
                    {address.label === "Home" ? (
                      <Home size={20} />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </div>

                  <div>
                    <div className="address-label-row">
                      <h3>{address.label}</h3>

                      {address.isDefault && (
                        <span className="default-badge">
                          <Check size={13} />
                          Default
                        </span>
                      )}
                    </div>

                    <p>{address.street}</p>

                    <p>
                      {address.city}
                      {address.state ? `, ${address.state}` : ""}
                    </p>

                    <p>
                      {address.zip}, {address.country}
                    </p>
                  </div>
                </div>

                <div className="address-actions">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSetDefault(address._id)
                      }
                    >
                      Set default
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-address-btn"
                    onClick={() =>
                      handleDelete(address._id)
                    }
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Addresses;
