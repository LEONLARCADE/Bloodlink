// Standard minimum interval between whole-blood donations.
const DONATION_INTERVAL_DAYS = 56;

/**
 * Computes a donor's eligibility from the most recent donation date, which
 * may come from DonorProfile.lastDonationDate or the completedAt of their
 * most recent COMPLETED RequestResponse (whichever is more recent).
 *
 * @param {Date|string|null} lastDonationDate
 * @returns {{ isEligible: boolean, lastDonationDate: string|null, nextEligibleDate: string|null, daysRemaining: number }}
 */
const getDonorEligibility = (lastDonationDate) => {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      lastDonationDate: null,
      nextEligibleDate: null,
      daysRemaining: 0,
    };
  }

  const last = new Date(lastDonationDate);
  const next = new Date(last);
  next.setDate(next.getDate() + DONATION_INTERVAL_DAYS);

  const now = new Date();
  const isEligible = now.getTime() >= next.getTime();
  const daysRemaining = isEligible
    ? 0
    : Math.ceil((next.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

  return {
    isEligible,
    lastDonationDate: last.toISOString().slice(0, 10),
    nextEligibleDate: next.toISOString().slice(0, 10),
    daysRemaining,
  };
};

/** Returns whichever of two dates (Date|string|null) is more recent, or null. */
const mostRecentDate = (a, b) => {
  if (!a) return b || null;
  if (!b) return a || null;
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
};

module.exports = { getDonorEligibility, mostRecentDate, DONATION_INTERVAL_DAYS };