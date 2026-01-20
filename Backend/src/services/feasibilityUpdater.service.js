import { checkDestinationFeasibility } from "./feasibility.service.js";
import TripDestination from "../models/TripDestination.js";
import User from "../models/User.js";
import Trip, { FEASIBILITY_STATUSES } from "../models/Trip.js";

export async function recalculateTripFeasibility(tripId) {
  const trip = await Trip.findById(tripId);
  if (!trip) return;

  const user = await User.findById(trip.userId);
  if (!user) return;

  const destinations = await TripDestination.find({ tripId });

  let hasRisk = false;

  for (const dest of destinations) {
    const result = await checkDestinationFeasibility({
      passportCountryId: user.passportCountry,
      destinationCountryId: dest.countryId,
      travelPurpose: dest.travelPurpose,
      entryDate: dest.entryDate,
      tripStartDate: trip.startDate,
    });

    if (result.status) {
      dest.feasibilityStatus = result.status;
      dest.feasibilityReason = result.issue?.message;
      await dest.save();
    }

    if (result.status === FEASIBILITY_STATUSES.IMPOSSIBLE) {
      trip.feasibilityStatus = FEASIBILITY_STATUSES.IMPOSSIBLE;
      await trip.save();
      return;
    }

    if (result.status === FEASIBILITY_STATUSES.RISKY) {
      hasRisk = true;
    }
  }

  trip.feasibilityStatus = hasRisk
    ? FEASIBILITY_STATUSES.RISKY
    : FEASIBILITY_STATUSES.FEASIBLE;

  await trip.save();
}
