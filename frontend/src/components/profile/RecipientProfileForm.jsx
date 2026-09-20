import { useState } from "react";
import { Save } from "lucide-react";
import { Input, Button, Alert } from "../ui";
import { BLOOD_GROUP_OPTIONS } from "../../constants";
import { saveRecipientProfile } from "../../api/profile";

/**
 * @param {object} initialData - existing RecipientProfile row, or null for onboarding
 * @param {(profile: object) => void} onSaved - called with the saved profile
 * @param {string} submitLabel
 */
export default function RecipientProfileForm({ initialData, onSaved, submitLabel = "Save" }) {
  const [form, setForm] = useState(() => ({
    bloodGroup: initialData?.bloodGroup || "",
    district: initialData?.district || "",
    state: initialData?.state || "",
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
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
      const profile = await saveRecipientProfile(form);
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
          Blood Group <span className="text-gray-400 font-normal">(if known)</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  bloodGroup: prev.bloodGroup === opt.value ? "" : opt.value,
                }))
              }
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
        <p className="mt-1.5 text-xs text-gray-500">
          Tap your group again to clear it. You'll specify the required group separately for
          each blood request.
        </p>
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

      <Button type="submit" isLoading={isSubmitting} fullWidth leftIcon={Save}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}