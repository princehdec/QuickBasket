"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, ChevronDown, Loader2, MapPin, Plus, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCheckout } from "../../contexts/CheckoutContext";
import type { CustomerAddress } from "../../../lib/api";
import { useLocation } from "../../context/LocationContext";
import { useLang } from "../../i18n/LanguageContext";

const inputClassName =
  "w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function AddressCard() {
  const { t } = useLang();
  const { selectedLocation } = useLocation();
  const {
    addresses,
    selectedAddress,
    addressesLoading,
    addressesError,
    setAddress,
    addAddress,
  } = useCheckout();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [label, setLabel] = useState("Home");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (!city && selectedLocation?.city) setCity(selectedLocation.city);
  }, [city, selectedLocation?.city]);

  const handleSelect = (address: CustomerAddress) => {
    setAddress(address);
    setIsOpen(false);
    setShowForm(false);
  };

  const openForm = () => {
    setFormError("");
    setShowForm(true);
    setIsOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormError("");
    setShowForm(false);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (addressLine1.trim().length < 3 || city.trim().length < 2) {
      setFormError(t("Please enter a complete address and city"));
      return;
    }

    setSaving(true);
    try {
      await addAddress({
        label: label.trim() || "Home",
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state: state.trim() || undefined,
        pincode: pincode.trim() || undefined,
        isDefault: addresses.length === 0,
      });
      setAddressLine1("");
      setAddressLine2("");
      setPincode("");
      setShowForm(false);
      setIsOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : t("Unable to save address"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">{t("Delivery Address")}</h2>

      <div className="mt-2">
        {addressesLoading ? (
          <div className="flex items-center gap-2 rounded-card border border-paper-200/70 bg-surface p-4 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            {t("Loading saved addresses...")}
          </div>
        ) : selectedAddress ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
            className="flex cursor-pointer items-start gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all hover:shadow-lift"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <MapPin size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-gray-900">{selectedAddress.label}</span>
                {selectedAddress.pincode && (
                  <span className="text-xs tabular-nums text-gray-500">{selectedAddress.pincode}</span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-600">
                {selectedAddress.addressLine1}, {selectedAddress.city}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={cn("mt-1 shrink-0 text-paper-400 transition-transform", isOpen && "rotate-180")}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={openForm}
            className="flex w-full items-center gap-3 rounded-card border border-dashed border-brand-300 bg-brand-50/50 p-4 text-left transition hover:bg-brand-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Plus size={16} />
            </span>
            <span>
              <span className="block text-sm font-bold text-gray-900">{t("Add a delivery address")}</span>
              <span className="mt-0.5 block text-xs text-gray-600">{addressesError || t("A saved address is required to place your order")}</span>
            </span>
          </button>
        )}

        {isOpen && (
          <div className="mt-2 space-y-1.5 rounded-card border border-paper-200/70 bg-surface p-2 shadow-soft">
            {!showForm && (
              <>
                {addresses.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-500">{t("No saved addresses yet")}</p>
                ) : (
                  addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => handleSelect(address)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        selectedAddress?.id === address.id ? "bg-brand-100" : "hover:bg-paper-100/70"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          selectedAddress?.id === address.id ? "bg-brand-600 text-paper-50" : "bg-paper-100 text-gray-600"
                        )}
                      >
                        <MapPin size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-gray-900">{address.label}</span>
                        <p className="truncate text-xs text-gray-600">{address.addressLine1}, {address.city}</p>
                      </div>
                      {selectedAddress?.id === address.id && <Check size={16} className="shrink-0 text-brand-700" />}
                    </button>
                  ))
                )}
                <button
                  type="button"
                  onClick={openForm}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Plus size={14} />
                  </span>
                  {t("Add New Address")}
                </button>
              </>
            )}

            {showForm && (
              <form onSubmit={handleCreate} className="space-y-3 p-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{t("New delivery address")}</h3>
                  <button type="button" onClick={closeForm} aria-label={t("Close")} className="rounded-full p-1 text-gray-500 hover:bg-paper-100">
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-semibold text-gray-700">
                    {t("Label")}
                    <input className={inputClassName + " mt-1"} value={label} onChange={(event) => setLabel(event.target.value)} placeholder={t("Home")} />
                  </label>
                  <label className="text-xs font-semibold text-gray-700">
                    {t("Pincode")}
                    <input className={inputClassName + " mt-1"} value={pincode} onChange={(event) => setPincode(event.target.value)} inputMode="numeric" maxLength={10} placeholder="226001" />
                  </label>
                </div>
                <label className="block text-xs font-semibold text-gray-700">
                  {t("Address line 1")} *
                  <textarea className={inputClassName + " mt-1 min-h-20 resize-y"} value={addressLine1} onChange={(event) => setAddressLine1(event.target.value)} required placeholder={t("House, street, area")} />
                </label>
                <label className="block text-xs font-semibold text-gray-700">
                  {t("Address line 2")}
                  <input className={inputClassName + " mt-1"} value={addressLine2} onChange={(event) => setAddressLine2(event.target.value)} placeholder={t("Apartment or landmark (optional)")} />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-semibold text-gray-700">
                    {t("City")} *
                    <input className={inputClassName + " mt-1"} value={city} onChange={(event) => setCity(event.target.value)} required placeholder={t("Lucknow or Gopalganj")} />
                  </label>
                  <label className="text-xs font-semibold text-gray-700">
                    {t("State")}
                    <input className={inputClassName + " mt-1"} value={state} onChange={(event) => setState(event.target.value)} placeholder={t("Uttar Pradesh or Bihar")} />
                  </label>
                </div>
                {(formError || addressesError) && <p className="text-xs font-medium text-red-600">{formError || addressesError}</p>}
                <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? t("Saving...") : t("Save address")}
                </button>
              </form>
            )}
          </div>
        )}
        {!isOpen && addressesError && selectedAddress && <p className="mt-2 text-xs font-medium text-red-600">{addressesError}</p>}
      </div>
    </section>
  );
}
