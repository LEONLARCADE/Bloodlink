import { Construction } from "lucide-react";
import PageHeader from "../layout/PageHeader";
import { Card, CardBody, Badge } from "../ui";
import { PLACEHOLDER_NOTICE } from "../../constants";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export function PlaceholderPage({ title, description, icon }) {
  useDocumentTitle(title);

  return (
    <section>
      <PageHeader title={title} description={description} icon={icon} />

      <Card>
        <CardBody className="flex items-start gap-4">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-50 shrink-0">
            <Construction className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
          <div>
            <Badge variant="warning">Placeholder</Badge>
            <p className="mt-2 text-sm text-gray-600">{PLACEHOLDER_NOTICE}</p>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

export default PlaceholderPage;