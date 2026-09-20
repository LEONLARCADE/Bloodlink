import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Droplet, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import Button from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui";
import SectionQuote from "../../components/common/SectionQuote";
import JourneySection from "../../components/common/JourneySection";
import BloodFlowAnimation from "../../components/common/BloodFlowAnimation";
import BloodJourney from "../../components/common/BloodJourney";
import About from "./About";
import HowItWorks from "./HowItWorks";
import Contact from "./Contact";
import { BLOOD_GROUPS, JOURNEY_POOL_ID, JOURNEY_SECTION_IDS, ROUTES, APP_TAGLINE } from "../../constants";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const WHY_BLOODLINK = [
  {
    icon: ShieldCheck,
    title: "Verified profiles",
    body: "Donor and recipient records are reviewed before matching.",
  },
  {
    icon: Droplet,
    title: "Group-aware matching",
    body: "Compatibility rules are applied automatically to every request.",
  },
  {
    icon: Users,
    title: "Direct coordination",
    body: "Requests reach nearby donors without long phone chains.",
  },
];

export function Home() {
  useDocumentTitle("Home");

  return (
    <>
      <BloodJourney sectionIds={JOURNEY_SECTION_IDS} poolZoneId={JOURNEY_POOL_ID} />

      {/* ── 1. HOME ───────────────────────────────────────────────────────── */}
      <JourneySection id="home">
        {/* ── HERO ──────────────────────────────────────────────────────────
            Three-column composition: copy left, the bleeding hand's lane dead
            centre, supporting copy right. The hand is rendered by the fixed
            <BloodFlowAnimation /> stage so it stays centred in the viewport
            while the droplet travels down the page.
            NOTE: mount <BloodFlowAnimation /> exactly once. If your build
            already mounts it in PublicLayout, delete the line below. */}
        <BloodFlowAnimation />

        <section className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-4 pt-[54svh] pb-14 sm:px-6 lg:items-center lg:px-8 lg:pt-0 lg:pb-0">
          <div className="grid w-full items-center gap-10 lg:grid-cols-12">
            <div className="text-center lg:col-span-4 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                <Droplet className="w-3.5 h-3.5" aria-hidden="true" />
                Every donation counts
              </span>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl xl:text-5xl">
                Find the right blood donor,{" "}
                <span className="text-primary">right when it matters.</span>
              </h1>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button as={Link} to={ROUTES.REGISTER} size="lg" rightIcon={ArrowRight}>
                  Become a donor
                </Button>
                <Button as={Link} to={ROUTES.HOW_IT_WORKS} variant="outline" size="lg">
                  How it works
                </Button>
              </div>
            </div>

            {/* central lane — deliberately empty, reserved for the hand and
                the droplet's flight path */}
            <div className="hidden lg:col-span-4 lg:block" aria-hidden="true" />

            <div className="text-center lg:col-span-4 lg:text-left">
              <p className="text-lg text-gray-600">{APP_TAGLINE}</p>
              <SectionQuote className="mt-8">
                Be the reason for someone&apos;s heartbeat.
              </SectionQuote>
            </div>
          </div>
        </section>

        <div className="mt-14">
          <h2 className="text-lg font-semibold text-gray-900">Supported blood groups</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BLOOD_GROUPS.map((group) => (
              <div
                key={group}
                className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary-light py-5 shadow-sm"
              >
                <HeartHandshake className="mb-1 h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-semibold text-primary">{group}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {WHY_BLOODLINK.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <CardBody className="p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </JourneySection>

      {/* ── 2. ABOUT US ───────────────────────────────────────────────────── */}
      <JourneySection id="about">
        <About embedded />
      </JourneySection>

      {/* ── 3. HOW IT WORKS ───────────────────────────────────────────────── */}
      <JourneySection id="how-it-works">
        <HowItWorks embedded />
      </JourneySection>

      {/* ── 4. CONTACT US ─────────────────────────────────────────────────── */}
      <JourneySection id="contact">
        <Contact embedded />
      </JourneySection>

      {/* ── 5. POOL ZONE ──────────────────────────────────────────────────────
          Not a nav stop. Scroll progress through this block drives the
          splash, the concentric ripples, the rebound droplet and the second
          ripple. Overscrolling past its end loops the journey back to HOME. */}
      <section
        id={JOURNEY_POOL_ID}
        className="bl-content relative flex min-h-[70vh] items-center"
      >
        <div className="mx-auto w-full max-w-7xl px-4 pr-20 py-20 sm:px-6 sm:pr-[36vw] lg:px-8 lg:pr-[34vw]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
            The drop lands
          </p>
          <p className="mt-3 max-w-md text-2xl font-semibold leading-snug text-gray-800">
            One donation ripples further than you will ever see.
          </p>
          <p className="mt-6 max-w-md text-sm text-gray-500">
            Keep scrolling to start the journey again — or jump straight in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} to={ROUTES.REGISTER} rightIcon={ArrowRight}>
              Become a donor
            </Button>
            <Button as={Link} to={ROUTES.LOGIN} variant="outline">
              Log in
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;