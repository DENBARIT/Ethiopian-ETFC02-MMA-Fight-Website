export type TrashTalkPlatform = "youtube" | "tiktok";
export type TrashTalkSide = "left" | "right";

export interface TrashTalkVideo {
  id: string;
  platform: TrashTalkPlatform;
  side: TrashTalkSide;
  title: string;
  handle?: string;
  watchUrl: string;
  embedUrl: string;
  thumbnail?: string;
}

function youtubeVideo(
  ytId: string,
  side: TrashTalkSide,
  title: string,
  watchUrl: string,
): TrashTalkVideo {
  return {
    id: ytId,
    platform: "youtube",
    side,
    title,
    watchUrl,
    embedUrl: `https://www.youtube.com/embed/${ytId}`,
    thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
  };
}

function tiktokVideo(
  ttId: string,
  side: TrashTalkSide,
  title: string,
  handle: string,
): TrashTalkVideo {
  return {
    id: ttId,
    platform: "tiktok",
    side,
    title,
    handle,
    watchUrl: `https://www.tiktok.com/@${handle}/video/${ttId}`,
    embedUrl: `https://www.tiktok.com/embed/v2/${ttId}`,
  };
}

// Left rail, top to bottom. First entry is the default video shown on load.
export const TRASH_TALK_VIDEOS: TrashTalkVideo[] = [
  youtubeVideo(
    "6jCEPD5g11k",
    "left",
    "Callout 01",
    "https://youtu.be/6jCEPD5g11k?si=fYWnoKxBP6rBfFje",
  ),
  youtubeVideo(
    "wnau2_EGGOg",
    "left",
    "Callout 02",
    "https://youtu.be/wnau2_EGGOg?si=ky6wWf6o6Evg-ejK",
  ),
  youtubeVideo(
    "DlkNcylrGRc",
    "left",
    "Callout 03",
    "https://www.youtube.com/live/DlkNcylrGRc?si=2LGvuIu2kWijRTdp",
  ),
  youtubeVideo(
    "vGXz6CIgOHQ",
    "left",
    "Callout 04",
    "https://youtu.be/vGXz6CIgOHQ?si=XPOFjWDmvLM74RT8",
  ),
  youtubeVideo(
    "MGcE7PNTAr4",
    "right",
    "Callout 05",
    "https://youtu.be/MGcE7PNTAr4?si=66Ytgc65_Kiwnq-e",
  ),
  youtubeVideo(
    "QOsqwf3kXjg",
    "right",
    "Callout 06",
    "https://youtu.be/QOsqwf3kXjg?si=-0TWAn-kiPr8U7d0",
  ),
  tiktokVideo("7639265809868655888", "right", "Callout 07", "dj.sami.asefa"),
  tiktokVideo(
    "7671981480947502357",
    "right",
    "Callout 08",
    "qormaatabiyyoolessaa",
  ),
];

export const DEFAULT_TRASH_TALK_VIDEO_ID = TRASH_TALK_VIDEOS[0].id;

interface TiktokOembedResponse {
  thumbnail_url?: string;
}

// TikTok's oEmbed thumbnail_url is a signed link that expires in ~2 days,
// so it has to be fetched at request time (with caching) rather than stored.
async function fetchTiktokThumbnail(watchUrl: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(watchUrl)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return undefined;
    const data = (await res.json()) as TiktokOembedResponse;
    return data.thumbnail_url;
  } catch {
    return undefined;
  }
}

export async function getTrashTalkVideosWithThumbnails(): Promise<TrashTalkVideo[]> {
  return Promise.all(
    TRASH_TALK_VIDEOS.map(async (video) => {
      if (video.platform !== "tiktok" || video.thumbnail) return video;
      const thumbnail = await fetchTiktokThumbnail(video.watchUrl);
      return thumbnail ? { ...video, thumbnail } : video;
    }),
  );
}
