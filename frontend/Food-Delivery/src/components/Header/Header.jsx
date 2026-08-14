// import React from "react";
// import { Link } from "react-router-dom";
// function Header() {
//   return (
//     /*
//       1. mx-auto w-full: Forces the header block to perfectly center itself inside your page container.
//       2. bg-cover bg-center: Ensures your image looks crisp and centered at all times.
//     */
//     <div className="header relative mx-auto w-full h-[38vw] min-h-[420px] max-w-7xl flex items-center rounded-3xl bg-[url('/header_img.png')] bg-cover bg-center px-6 sm:px-12 md:px-16 overflow-hidden shadow-sm">
//       {/*
//         Optional Dark Overlay:
//         If your header image makes the white text hard to read, uncomment the line below
//         to add a subtle dark layer behind the text.
//       */}
//       {/* <div className="absolute inset-0 bg-black/20 rounded-3xl pointer-events-none" /> */}

//       {/* Content wrapper - handles the text width and layout spacing */}
//       <div className="relative z-10 flex max-w-full flex-col items-start gap-4 sm:max-w-[60%] sm:gap-5 md:gap-6 animate-fade-in">
//         {/* Main Heading with dynamic text size scaling */}
//         <h2 className="text-3xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
//           Order your food here
//         </h2>

//         {/* Paragraph description */}
//         <p className="text-sm font-medium text-slate-100 sm:text-base md:text-lg leading-relaxed drop-shadow-sm">
//           Discover fresh, delicious meals from your favorite local restaurants
//           and have them delivered straight to your door — fast, simple, and
//           convenient.
//         </p>

//         {/* Premium View Menu Button */}
//         <a href="#explore-menu">
//           <button
//             type="button"
//             className="rounded-xl  w-20 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg active:scale-95"
//           >
//             View Menu
//           </button>
//         </a>
//       </div>
//     </div>
//   );
// }

// export default Header;
















import React from "react";

export default function Hero() {
  const stats = [
    { value: "4.9/5", label: "Customer rating ⭐" },
    { value: "30 min", label: "Average delivery" },
    { value: "100+", label: "Top Foods" },
  ];

  return (
    <section className="relative mx-auto flex min-h-[700px] max-w-7xl items-center overflow-hidden px-6 py-16 lg:py-24">
      {/* Background Lighting & Decorations */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 animate-pulse rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-12 h-3 w-3 animate-bounce rounded-full bg-orange-400" />

      <div className="relative grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}
        <div className="flex flex-col gap-6 text-left">

          {/* Eyebrow Pill */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600">
              <span className="h-2 w-2 animate-ping rounded-full bg-orange-500" />
              Fresh • Fast • Tasty
            </span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Good food. <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Good mood.
              </span>
            </h1>

            <p className="max-w-lg text-base text-slate-600 sm:text-lg sm:leading-relaxed">
              Discover delicious meals from your favorite local restaurants
              and get them delivered fresh and fast, right to your doorstep.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/35 active:scale-95">
              Order Now
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>

            <button className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-600 hover:shadow-md active:scale-95">
              Explore Menu
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                ↗
              </span>
            </button>
          </div>

          {/* Live Delivery Info Card */}
          <div className="mt-2 flex max-w-md items-center gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm backdrop-blur-md transition duration-200 hover:border-orange-100 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl">
              🚴
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900">Express Delivery</p>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Available
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Fresh meals delivered to your door in ~30 minutes.
              </p>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="h-8 w-px bg-slate-200" />}
                <div>
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>

        {/* =====================================================
            RIGHT IMAGE & FLOATING CARDS
        ===================================================== */}
        <div className="relative flex justify-center">

          {/* Outer Decorative Ring & Glow */}
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-100/80 bg-orange-100/30 blur-2xl" />

          {/* Main Hero Card Container */}
          <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl shadow-slate-900/10">
            <img
              src="https://thumbs.dreamstime.com/b/food-delivery-app-concept-various-cuisines-flying-phone-advertisement-showing-variety-international-foods-386732587.jpg"
              alt="Food delivery options"
              className="w-full max-w-md object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* Floating UI: Rating Badge */}
          <div className="absolute -left-2 top-8 flex animate-bounce items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-base">
              ⭐
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">4.9 Rating</p>
              <p className="text-[11px] text-slate-500">10k+ happy buyers</p>
            </div>
          </div>

          {/* Floating UI: Order Status */}
          <div className="absolute -bottom-4 -right-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md sm:-right-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-base text-white">
              🚴
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">On the way!</p>
              <p className="text-[11px] text-slate-500">Live order status</p>
            </div>
          </div>

          {/* Floating Food Badge */}
          <div className="absolute -right-3 top-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-orange-500 text-xl shadow-lg">
            🍔
          </div>

        </div>

      </div>
    </section>
  );
}
