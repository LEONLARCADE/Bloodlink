import { HeartHandshake } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardBody } from "../../components/ui";
import SectionQuote from "../../components/common/SectionQuote";
import { HOW_IT_WORKS_STEPS } from "../../constants";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function HowItWorks({ embedded = false }) {
  useDocumentTitle(embedded ? "Home" : "How It Works");

  return (
    <div
      className={
        embedded
          ? "max-w-2xl"
          : "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      }
    >
      <PageHeader
        title="How It Works"
        description="Five steps, start to donation."
        icon={HeartHandshake}
      />

      <ol className="space-y-3">
        {HOW_IT_WORKS_STEPS.map(({ step, title, body }) => (
          <li key={step}>
            <Card>
              <CardBody className="flex items-start gap-4 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-sm font-bold text-primary">
                  {step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{body}</p>
                </div>
              </CardBody>
            </Card>
          </li>
        ))}
      </ol>

      <SectionQuote>Give blood, give hope.</SectionQuote>
    </div>
  );
}