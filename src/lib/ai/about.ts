import type { Page_AboutFragment } from "$graphql/graphql";
import { SITE_URL, frontmatter, htmlBlock, join, linkMd } from "./helpers";

type Award = {
  __typename?: string;
  award?: string | null;
  date?: string | null;
  company?: { title?: string | null }[] | null;
  hyperLink?: Parameters<typeof linkMd>[0];
};

type CvEntry = {
  __typename?: string;
  position?: string | null;
  location?: string | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  currentPosition?: boolean | null;
  company?: { title?: string | null }[] | null;
};

export const renderAbout = (entry: Page_AboutFragment): string => {
  const title = entry.customTitle?.trim() || entry.title?.trim() || "About";
  const description = entry.descriptionPlain?.trim();

  const fm = frontmatter({
    title,
    description,
    canonical: `${SITE_URL}/about`,
    section: "about"
  });

  const aboutMe = htmlBlock(entry.aboutMeRichText as string | null);
  const sliderI = renderSection(entry.sliderHeadingI, entry.sliderRichTextI as string | null);
  const sliderII = renderSection(entry.sliderHeadingII, entry.sliderRichTextII as string | null);
  const sliderIII = renderSection(entry.sliderHeadingIII, entry.sliderRichTextIII as string | null);

  const awardsIntro = htmlBlock(entry.awardsRichText as string | null);
  const awards = renderAwards((entry.awards ?? []) as Award[]);
  const cv = renderCv((entry.curriculumVitae ?? []) as CvEntry[]);

  return join([
    fm,
    `# ${title}`,
    description,
    aboutMe,
    sliderI,
    sliderII,
    sliderIII,
    awards || awardsIntro ? "## Awards" : null,
    awardsIntro,
    awards,
    cv ? "## Curriculum Vitae" : null,
    cv
  ]);
};

const renderSection = (heading: string | null | undefined, richText: string | null): string => {
  const h = heading?.trim();
  if (!h && !richText?.trim()) return "";
  return join([h ? `## ${h}` : null, htmlBlock(richText)]);
};

const renderAwards = (awards: Award[]): string => {
  const lines = awards
    .map((a) => {
      const parts = [a.award, a.company?.[0]?.title, a.date].filter(Boolean);
      if (!parts.length) return "";
      const link = linkMd(a.hyperLink);
      return link ? `- ${parts.join(" — ")} (${link})` : `- ${parts.join(" — ")}`;
    })
    .filter(Boolean);
  return lines.join("\n");
};

const renderCv = (cv: CvEntry[]): string => {
  const lines = cv
    .map((c) => {
      const head = [c.position, c.company?.[0]?.title, c.location].filter(Boolean).join(" · ");
      const end = c.currentPosition ? "present" : c.dateEnd;
      const dates = [c.dateStart, end].filter(Boolean).join(" – ");
      if (!head && !dates) return "";
      return dates ? `- **${head}** _(${dates})_` : `- **${head}**`;
    })
    .filter(Boolean);
  return lines.join("\n");
};
