import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardBody } from "../../components/ui";
import Button from "../../components/ui/Button";
import SectionQuote from "../../components/common/SectionQuote";
import { ROUTES } from "../../constants";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function Contact({ embedded = false }) {
  useDocumentTitle(embedded ? "Home" : "Contact");

  return (
    <div
      className={
        embedded
          ? "max-w-2xl"
          : "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      }
    >
      <PageHeader
        title="Contact Us"
        description="Reach the BloodLink team for support, partnerships or blood bank onboarding."
        icon={Mail}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Mail, label: "Email", value: "hello@bloodlink.app" },
          { icon: Phone, label: "Phone", value: "+91 00000 00000" },
          { icon: MapPin, label: "Based in", value: "Kerala, India" },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardBody className="p-4">
              <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </p>
              <p className="mt-0.5 text-sm text-gray-700">{value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <SectionQuote>
        Not all heroes wear capes; some wear jeans and shirts too.
      </SectionQuote>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button as={Link} to={ROUTES.REGISTER} size="lg" rightIcon={ArrowRight}>
          Register as a donor
        </Button>
        <Button as={Link} to={ROUTES.LOGIN} variant="outline" size="lg">
          Log in
        </Button>
      </div>
    </div>
  );
}