const cityCards = [
  { name: "Lucknow", activeOrders: "42", partners: "18 online", zones: "5 active" },
  { name: "Gopalganj, Bihar", activeOrders: "16", partners: "7 online", zones: "3 active" },
];

const alerts = [
  { tone: "border-[#C97F1A] bg-[#FFF4D6]", title: "3 orders need partner assignment", detail: "Lucknow · review dispatch queue" },
  { tone: "border-[#8E2F23] bg-[#F4EAE6]", title: "2 prescription reviews pending", detail: "Gopalganj · pharmacy queue" },
  { tone: "border-[#2F8144] bg-[#E8F3E9]", title: "Weekly settlements ready", detail: "14 vendors · approve before payout" },
];

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-[#F4F1E8] px-5 py-8 text-[#1E2620] md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#236837]">QuickBasket Control Tower</p>
            <h1 className="mt-2 text-3xl font-bold">Operations / संचालन</h1>
            <p className="mt-1 text-[#5E6A60]">Lucknow + Gopalganj · All services monitored in one place</p>
          </div>
          <div className="rounded-xl bg-[#FFFDF7] px-4 py-3 text-sm shadow-sm">Online payments only · COD disabled</div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Live orders / लाइव ऑर्डर", "58", "Across both cities"],
            ["Unassigned jobs / बिना पार्टनर", "3", "Needs action now"],
            ["Pending refunds / रिफंड", "₹7,860", "Review queue"],
          ].map(([label, value, hint]) => (
            <article key={label} className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm">
              <p className="text-sm font-semibold text-[#5E6A60]">{label}</p>
              <p className="mt-3 text-3xl font-bold text-[#236837]">{value}</p>
              <p className="mt-1 text-sm text-[#5E6A60]">{hint}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">City operations / शहर संचालन</h2>
              <button className="text-sm font-semibold text-[#236837]">Manage zones</button>
            </div>
            <div className="space-y-3">
              {cityCards.map((city) => (
                <div key={city.name} className="rounded-xl border border-[#ECE7DD] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{city.name}</p>
                    <span className="rounded-full bg-[#E8F3E9] px-3 py-1 text-xs font-semibold text-[#236837]">Live</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-[#5E6A60]">Orders</p><p className="mt-1 font-bold">{city.activeOrders}</p></div>
                    <div><p className="text-[#5E6A60]">Partners</p><p className="mt-1 font-bold">{city.partners}</p></div>
                    <div><p className="text-[#5E6A60]">Zones</p><p className="mt-1 font-bold">{city.zones}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2DCCE] bg-[#FFFDF7] p-5 shadow-sm">
            <h2 className="text-xl font-bold">Action queue / काम की सूची</h2>
            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <button key={alert.title} className={`w-full rounded-xl border-l-4 p-4 text-left ${alert.tone}`}>
                  <p className="font-bold">{alert.title}</p>
                  <p className="mt-1 text-sm text-[#5E6A60]">{alert.detail}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
