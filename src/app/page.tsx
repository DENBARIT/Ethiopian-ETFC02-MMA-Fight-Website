import { FightTreeSection } from "@/components/fight-tree-section";
import { LandingExperience } from "@/components/landing-experience";
import { SiteFooter } from "@/components/site-footer";
import { SponsorsSection } from "@/components/sponsors-section";
import { TrashTalksSection } from "@/components/trash-talks-section";
import { WhoWillWinSection } from "@/components/who-will-win-section";
import { ALL_MATCHUPS } from "@/lib/fight-ids";
import { ANNOUNCEMENTS, EVENT, SITE_URL } from "@/lib/landing-content";
import { getTrashTalkVideosWithThumbnails } from "@/lib/trashtalk-content";

export default async function Home() {
  const trashTalkVideos = await getTrashTalkVideosWithThumbnails();

  const place = {
    "@type": "Place",
    name: EVENT.venue,
    address: {
      "@type": "PostalAddress",
      addressLocality: EVENT.city,
      addressCountry: "ET",
    },
  };

  // Each bout as its own SportsEvent with named competitors — lets search
  // engines index individual fighter matchups (e.g. "Sedo Martial Art vs
  // Johnny Jitsu"), not just the event as a whole.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: EVENT.name,
    startDate: EVENT.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: EVENT.description,
    url: SITE_URL,
    location: place,
    organizer: {
      "@type": "Organization",
      name: EVENT.name,
      url: SITE_URL,
    },
    subEvent: ALL_MATCHUPS.map((matchup) => ({
      "@type": "SportsEvent",
      name: `${matchup.left} vs ${matchup.right}`,
      startDate: EVENT.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: place,
      competitor: [
        { "@type": "Person", name: matchup.left },
        { "@type": "Person", name: matchup.right },
      ],
    })),
  };

  const fighterList = ALL_MATCHUPS.map((m) => `${m.left} vs ${m.right}`).join(", ");

  return (
    <>
      <script
        type="application/ld+json"
        // Escaping "<" blocks a "</script>" substring anywhere in the data
        // (fighter names, venue, etc.) from ever breaking out of this tag —
        // harmless today since it's all developer-authored, but cheap
        // insurance against that assumption changing later.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <p className="sr-only">
        {EVENT.name} — {EVENT.tagline} {ANNOUNCEMENTS.map((a) => a.value).join(", ")} on{" "}
        {EVENT.readableDate} at {EVENT.venue}, {EVENT.city}. Full fight card: {fighterList}.
      </p>
      <LandingExperience />
      <FightTreeSection />
      <TrashTalksSection videos={trashTalkVideos} />
      <WhoWillWinSection />
      <SponsorsSection />
      <SiteFooter />
    </>
  );
}
