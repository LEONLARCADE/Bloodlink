import { HeartHandshake, ShieldCheck, Users, Droplet } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardBody } from "../../components/ui";
import SectionQuote from "../../components/common/SectionQuote";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function About({ embedded = false }) {
  // When embedded in the home journey the parent owns the title and the
  // section wrapper owns the padding.
  useDocumentTitle(embedded ? "Home" : "About");

  return (
    <div
      className={
        embedded
          ? "max-w-3xl"
          : "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      }
    >      <PageHeader
        title="About BloodLink"
        description="A shorter path between a request and a donor."
        icon={HeartHandshake}
      />

      <p className="max-w-2xl text-gray-600">
        Finding blood in an emergency usually means a chain of phone calls
        through people who may or may not be eligible. BloodLink replaces
        that chain with a single searchable network of willing donors,
        connecting donors and recipients directly and making donor
        discovery easier for everyone involved.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          {
            icon: Users,
            title: "Easier donor discovery",
            body: "One place to look, instead of a dozen group chats.",
          },
          {
            icon: Droplet,
            title: "Compatible matches",
            body: "Group compatibility is applied before anyone is contacted.",
          },
          {
            icon: ShieldCheck,
            title: "Respectful of privacy",
            body: "Contact details are shared only where a match is made.",
          },
          {
            icon: HeartHandshake,
            title: "Voluntary donation first",
            body: "Built to encourage repeat, unpaid, voluntary donors.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardBody className="p-4">
              <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <SectionQuote>The gift of blood is a gift to someone's life.</SectionQuote>
    </div>
  );
}