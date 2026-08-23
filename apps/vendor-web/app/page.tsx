const metrics = [
  { label: "Today’s orders / आज के ऑर्डर", value: "24", tone: "bg-[#E8F3E9] text-[#236837]" },
  { label: "Pending action / लंबित काम", value: "7", tone: "bg-[#FFF4D6] text-[#8A5A00]" },
  { label: "This week / इस सप्ताह", value: "₹18,420", tone: "bg-[#F4EAE6] text-[#8E2F23]" },
];

const orders = [
  { id: "QB-10482", customer: "Rahul Sharma", items: "6 items", amount: "₹684", status: "Accept order" },
  { id: "QB-10481", customer: "Neha Verma", items: "3 items", amount: "₹312", status: "Preparing" },
  { id: "QB-10479", customer: "Amit Kumar", items: "9 items", amount: "₹1,092", status: "Ready for pickup" },
];

export default function VendorHome() {
  return (
    <main className="min-h-screen bg-[#FBF9F3] px-5 py-8 text-[#1E2620] md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2F8144]">QuickBasket Vendor</p>
            <h1 className="mt-2 text-3xl font-bold">Sharma General Store</h1>
            <p className="mt-1 text-[#5E6A60]">Lucknow · Store is online / दुकान ऑनलाइन है</p>
          </div>
          <button className="rounded-xl bg-[#236837] px-5 py-3 font-semibold text-white shadow-sm">Manage store / दुकान प्रबंधित करें</button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article key={metric.label} className={`rounded-2xl border border-[#E7E2D7] p-5 shadow-sm ${metric.tone}`}>
              <p className="text-sm font-semibold">{metric.label}</p>
              <p className="mt-3 text-3xl font-bold">{metric.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Live orders / लाइव ऑर्डर</h2>
                <p className="text-sm text-[#5E6A60]">Respond quickly so riders can be assigned.</p>
              </div>
              <button className="text-sm font-semibold text-[#236837]">View all</button>
            </div>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[#ECE7DD] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold">{order.id} · {order.customer}</p>
                    <p className="mt-1 text-sm text-[#5E6A60]">{order.items} · {order.amount}</p>
                  </div>
                  <button className="rounded-lg border border-[#236837] px-4 py-2 text-sm font-semibold text-[#236837]">{order.status}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E2D7] bg-[#FFFDF7] p-5 shadow-sm">
            <h2 className="text-xl font-bold">Quick actions / त्वरित काम</h2>
            <div className="mt-4 grid gap-3">
              {["Add product / उत्पाद जोड़ें", "Update inventory / स्टॉक अपडेट", "View settlement / भुगतान देखें", "Contact support / सहायता"].map((action) => (
                <button key={action} className="rounded-xl bg-[#F4F0E7] px-4 py-3 text-left font-semibold transition hover:bg-[#E8F3E9]">{action}</button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
