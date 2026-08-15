import { FightTreeSection } from "@/components/fight-tree-section";
import { LandingExperience } from "@/components/landing-experience";
import { TrashTalksSection } from "@/components/trash-talks-section";
import { WhoWillWinSection } from "@/components/who-will-win-section";
import { ANNOUNCEMENTS, EVENT, SITE_URL } from "@/lib/landing-content";
import { getTrashTalkVideosWithThumbnails } from "@/lib/trashtalk-content";

export default async function Home() {
  const trashTalkVideos = await getTrashTalkVideosWithThumbnails();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: EVENT.name,
    startDate: EVENT.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: EVENT.description,
    url: SITE_URL,
    location: {
      "@type": "Place",
      name: EVENT.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: EVENT.city,
        addressCountry: "ET",
      },
    },
    organizer: {
      "@type": "Organization",
      name: EVENT.name,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="sr-only">
        {EVENT.name} — {EVENT.tagline} {ANNOUNCEMENTS.map((a) => a.value).join(", ")} on{" "}
        {EVENT.readableDate} at {EVENT.venue}, {EVENT.city}.
      </p>
      <LandingExperience />
      <FightTreeSection />
      <TrashTalksSection videos={trashTalkVideos} />
      <WhoWillWinSection />
    </>
  );
}
