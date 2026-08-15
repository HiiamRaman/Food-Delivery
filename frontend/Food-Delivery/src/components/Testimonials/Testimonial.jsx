import React from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Daily Foodie",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    tag: "Verified Order",
    dish: "Paneer Butter Masala & Naan",
    comment: "The food arrived piping hot in under 20 minutes! Live rider tracking is accurate to the second. Hands down the smoothest food delivery app I've used.",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    tag: "Frequent Buyer",
    dish: "Spicy Ramen Bowl",
    comment: "I order lunch through this app almost every workday. Two-click checkout, zero bugs, and the food always tastes fresh out of the kitchen.",
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Bistro Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    tag: "Restaurant Partner",
    dish: "Artisan Woodfired Pizza",
    comment: "As a restaurant partner, the order dispatch system is completely seamless. It helps us reach thousands of local foodies while maintaining meal quality.",
  },
];

export default function Testimonial() {
  return (
    <section className="w-full bg-slate-50 py-20 text-slate-900 border-t border-slate-200/60">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mx-auto max-w-xl text-center space-y-3">
          <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
            Customer Stories
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-900">
            Loved by food lovers & local chefs.
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Over 10,000+ meals delivered red-hot with a 4.9-star average rating.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
            >
              <div>
                {/* Header: Stars & Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(review.rating)}
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {review.tag}
                  </span>
                </div>

                {/* Comment */}
                <p className="mt-4 text-sm leading-relaxed text-slate-700 font-medium">
                  "{review.comment}"
                </p>
              </div>

              {/* Footer: User & Favorite Dish */}
              <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{review.name}</h3>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-orange-50/60 px-3 py-1.5 rounded-lg border border-orange-100">
                  <span className="text-slate-500">Ordered:</span>
                  <span className="font-bold text-orange-600">{review.dish}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
