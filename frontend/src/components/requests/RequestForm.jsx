import { useState } from "react";
import { Send } from "lucide-react";
import { Input, Button, Alert } from "../ui";
import { BLOOD_GROUP_OPTIONS, URGENCY_OPTIONS } from "../../constants";

/**
 * @param {object} initialData - existing BloodRequest row, or null for create
 * @param {(payload: object) => Promise<any>} onSubmit - create or update call
 * @param {() => void} onSuccess
 * @param {string} submitLabel
 */
export default function RequestForm({ initialData, onSubmit, onSuccess, submitLabel = "Submit" }) {
  const [form, setForm] = useState(() => ({
    bloodGroup: initialData?.bloodGroup || "",
    unitsRequired: initialData?.unitsRequired ?? 1,
    district: initialData?.district || "",
    hospitalName: initialData?.hospitalName || "",
    patientName: initialData?.patientName || "",
    urgency: initialData?.urgency || "NORMAL",
    neededBy: initialData?.neededBy ? initialData.neededBy.slice(0, 10) : "",
    notes: initialData?.notes || "",
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
    if (!form.bloodGroup) next.bloodGroup = "Select the blood group needed";
    if (!form.district.trim()) next.district = "District is required";
    if (!form.unitsRequired || Number(form.unitsRequired) < 1) {
      next.unitsRequired = "At least 1 unit is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ ...form, unitsRequired: Number(form.unitsRequired) });
      onSuccess?.();
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5" id="request-form">
      {formError && <Alert variant="error">{formError}</Alert>}

      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Blood Group Needed<span className="text-primary ml-0.5">*</span>
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Units required"
          name="unitsRequired"
          type="number"
          min={1}
          max={20}
          value={form.unitsRequired}
          onChange={handleChange}
          error={errors.unitsRequired}
          disabled={isSubmitting}
          required
        />

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">Urgency</label>
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50"
          >
            {URGENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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
        label="Hospital"
        name="hospitalName"
        value={form.hospitalName}
        onChange={handleChange}
        error={errors.hospitalName}
        disabled={isSubmitting}
        hint="Optional"
      />

      <Input
        label="Patient name"
        name="patientName"
        value={form.patientName}
        onChange={handleChange}
        error={errors.patientName}
        disabled={isSubmitting}
        hint="Optional"
      />

      <Input
        label="Needed by"
        name="neededBy"
        type="date"
        value={form.neededBy}
        onChange={handleChange}
        error={errors.neededBy}
        disabled={isSubmitting}
        hint="Optional"
        min={new Date().toISOString().slice(0, 10)}
      />

      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50"
        />
        {errors.notes && <p className="mt-1.5 text-xs text-red-600">{errors.notes}</p>}
      </div>

      <Button type="submit" isLoading={isSubmitting} fullWidth leftIcon={Send}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}