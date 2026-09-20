import { useState } from "react";
import { Droplet } from "lucide-react";
import { Input, Button, Alert } from "../ui";
import { BLOOD_GROUP_OPTIONS } from "../../constants";
import { saveDonorProfile } from "../../api/profile";

/**
 * @param {object} initialData - existing DonorProfile row, or null for onboarding
 * @param {(profile: object) => void} onSaved - called with the saved profile
 * @param {string} submitLabel
 */
export default function DonorProfileForm({ initialData, onSaved, submitLabel = "Save" }) {
  const [form, setForm] = useState(() => ({
    bloodGroup: initialData?.bloodGroup || "",
    district: initialData?.district || "",
    state: initialData?.state || "",
    isAvailable: initialData?.isAvailable ?? true,
    lastDonationDate: initialData?.lastDonationDate
      ? initialData.lastDonationDate.slice(0, 10)
      : "",
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.bloodGroup) next.bloodGroup = "Select your blood group";
    if (!form.district.trim()) next.district = "District is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const profile = await saveDonorProfile(form);
      onSaved?.(profile);
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        setFormError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <Alert variant="error">{formError}</Alert>}

      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Blood Group<span className="text-primary ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, bloodGroup: opt.value }));
                setErrors((prev) => ({ ...prev, bloodGroup: undefined }));
              }}
              disabled={isSubmitting}
              className={`h-11 rounded-xl border text-sm font-semibold transition ${
                form.bloodGroup === opt.value
                  ? "border-primary bg-primary-light text-primary"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.bloodGroup && (
          <p className="mt-1.5 text-xs text-red-600">{errors.bloodGroup}</p>
        )}
      </div>

      <Input
        label="District"
        name="district"
        value={form.district}
        onChange={handleChange}
        error={errors.district}
        disabled={isSubmitting}
        required
      />

      <Input
        label="State"
        name="state"
        value={form.state}
        onChange={handleChange}
        error={errors.state}
        disabled={isSubmitting}
        hint="Optional"
      />

      <Input
        label="Last donation date"
        name="lastDonationDate"
        type="date"
        value={form.lastDonationDate}
        onChange={handleChange}
        error={errors.lastDonationDate}
        disabled={isSubmitting}
        hint="Optional — leave blank if you haven't donated before"
        max={new Date().toISOString().slice(0, 10)}
      />

      <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 cursor-pointer">
        <input
          type="checkbox"
          name="isAvailable"
          checked={form.isAvailable}
          onChange={handleChange}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
        />
        <span className="text-sm">
          <span className="font-medium text-gray-900">Available to donate</span>
          <span className="block text-gray-500">
            You can toggle this off any time from your dashboard.
          </span>
        </span>
      </label>

      <Button type="submit" isLoading={isSubmitting} fullWidth leftIcon={Droplet}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}