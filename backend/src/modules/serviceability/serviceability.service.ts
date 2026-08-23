import { and, eq } from "drizzle-orm";
import { db } from "../../shared/db/index";
import { addresses, businesses, serviceZones } from "../../shared/schema/index";
import { ApiError } from "../../shared/utils/apiError";

const DEFAULT_RADIUS_KM = 5;

function distanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface ServiceabilityQuote {
  serviceable: boolean;
  city: string;
  distanceKm: number;
  radiusKm: number;
  deliveryFee: number;
  estimatedMinutes: number;
  reason?: "outside_zone" | "address_invalid" | "business_closed";
}

export async function quoteServiceability(addressId: string, businessId: string): Promise<ServiceabilityQuote> {
  const [address] = await db.select().from(addresses).where(eq(addresses.id, addressId)).limit(1);
  const [business] = await db.select().from(businesses).where(eq(businesses.id, businessId)).limit(1);

  if (!address || !business) {
    throw ApiError.notFound("Address or business not found");
  }

  const addressLat = Number(address.latitude);
  const addressLng = Number(address.longitude);
  const businessLat = Number(business.latitude);
  const businessLng = Number(business.longitude);

  if (![addressLat, addressLng, businessLat, businessLng].every(Number.isFinite)) {
    return {
      serviceable: false,
      city: business.city,
      distanceKm: 0,
      radiusKm: DEFAULT_RADIUS_KM,
      deliveryFee: 0,
      estimatedMinutes: 0,
      reason: "address_invalid",
    };
  }

  const [zone] = await db
    .select()
    .from(serviceZones)
    .where(
      and(
        eq(serviceZones.cityName, business.city),
        eq(serviceZones.isActive, true),
      ),
    )
    .limit(1);

  const radiusKm = Number(zone?.radiusKm ?? DEFAULT_RADIUS_KM);
  const distanceKm = Number(distanceInKm(addressLat, addressLng, businessLat, businessLng).toFixed(2));
  const serviceable = distanceKm <= radiusKm && business.isActive;
  const deliveryFee = serviceable ? Math.max(20, Math.ceil(distanceKm * 8)) : 0;

  return {
    serviceable,
    city: business.city,
    distanceKm,
    radiusKm,
    deliveryFee,
    estimatedMinutes: serviceable ? Math.max(20, Math.round(distanceKm * 7 + 15)) : 0,
    ...(serviceable ? {} : { reason: "outside_zone" as const }),
  };
}
