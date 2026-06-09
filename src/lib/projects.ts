export interface Project {
  id: number;
  title: string;
  slug: string;
  year: number;
  shortDescription: string;
  sticker: string;       // thumbnail / poster (carousel texture)
  styleframes: string[]; // gallery images on the detail page
  pdf?: string;          // full source document (served from /public/works)
}

// Personal portfolio works. Each entry's images are rendered page-previews of
// the source document (see public/images/works); `pdf` points at the full file.
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Mybusiness",
    slug: "mybusiness-brandbook",
    year: 2024,
    shortDescription: "Brand identity and guidelines system.",
    sticker: "/images/works/mybusiness-brandbook-0.jpg",
    styleframes: [
      "/images/works/mybusiness-brandbook-0.jpg",
      "/images/works/mybusiness-brandbook-1.jpg",
      "/images/works/mybusiness-brandbook-2.jpg",
      "/images/works/mybusiness-brandbook-3.jpg",
      "/images/works/mybusiness-brandbook-4.jpg",
    ],
    pdf: "/works/mybusiness-brandbook.pdf",
  },
  {
    id: 2,
    title: "Flavour",
    slug: "nolo",
    year: 2024,
    shortDescription: "Final brand presentation.",
    sticker: "/images/works/nolo-0.jpg",
    styleframes: [
      "/images/works/nolo-0.jpg",
      "/images/works/nolo-1.jpg",
      "/images/works/nolo-2.jpg",
      "/images/works/nolo-3.jpg",
      "/images/works/nolo-4.jpg",
    ],
    pdf: "/works/nolo.pdf",
  },
  {
    id: 3,
    title: "Avla",
    slug: "sabakalavro",
    year: 2024,
    shortDescription: "Bachelor's thesis project.",
    sticker: "/images/works/sabakalavro-0.jpg",
    styleframes: [
      "/images/works/sabakalavro-0.jpg",
      "/images/works/sabakalavro-1.jpg",
      "/images/works/sabakalavro-2.jpg",
      "/images/works/sabakalavro-3.jpg",
      "/images/works/sabakalavro-4.jpg",
    ],
    pdf: "/works/sabakalavro.pdf",
  },
  {
    id: 4,
    title: "Vape shop",
    slug: "veipi",
    year: 2024,
    shortDescription: "Product branding and packaging.",
    sticker: "/images/works/veipi-0.jpg",
    styleframes: [
      "/images/works/veipi-0.jpg",
      "/images/works/veipi-1.jpg",
      "/images/works/veipi-2.jpg",
      "/images/works/veipi-3.jpg",
      "/images/works/veipi-4.jpg",
    ],
    pdf: "/works/veipi.pdf",
  },
  {
    id: 5,
    title: "Kutaisi",
    slug: "masho",
    year: 2024,
    shortDescription: "Final design presentation.",
    sticker: "/images/works/masho-0.jpg",
    styleframes: [
      "/images/works/masho-0.jpg",
      "/images/works/masho-1.jpg",
      "/images/works/masho-2.jpg",
      "/images/works/masho-3.jpg",
      "/images/works/masho-4.jpg",
    ],
    pdf: "/works/masho.pdf",
  },
  {
    id: 6,
    title: "Composition",
    slug: "kompozicia",
    year: 2023,
    shortDescription: "Composition study.",
    sticker: "/images/works/kompozicia-0.jpg",
    styleframes: [
      "/images/works/kompozicia-0.jpg",
      "/images/works/kompozicia-1.jpg",
      "/images/works/kompozicia-2.jpg",
      "/images/works/kompozicia-3.jpg",
      "/images/works/kompozicia-4.jpg",
    ],
    pdf: "/works/kompozicia.pdf",
  },
  {
    id: 7,
    title: "Amore",
    slug: "amore",
    year: 2023,
    shortDescription: "Brand presentation.",
    sticker: "/images/works/amore-0.jpg",
    styleframes: [
      "/images/works/amore-0.jpg",
      "/images/works/amore-1.jpg",
      "/images/works/amore-2.jpg",
      "/images/works/amore-3.jpg",
      "/images/works/amore-4.jpg",
    ],
    pdf: "/works/amore.pdf",
  },
  {
    id: 8,
    title: "Bookshop",
    slug: "vebi-beh",
    year: 2023,
    shortDescription: "Web design case study.",
    sticker: "/images/works/vebi-beh-0.jpg",
    styleframes: [
      "/images/works/vebi-beh-0.jpg",
      "/images/works/vebi-beh-1.jpg",
      "/images/works/vebi-beh-2.jpg",
      "/images/works/vebi-beh-3.jpg",
      "/images/works/vebi-beh-4.jpg",
    ],
    pdf: "/works/vebi-beh.pdf",
  },
  {
    id: 9,
    title: "Case way",
    slug: "way-fixy",
    year: 2023,
    shortDescription: "Brandbook case study.",
    sticker: "/images/works/way-fixy-0.jpg",
    styleframes: [
      "/images/works/way-fixy-0.jpg",
      "/images/works/way-fixy-1.jpg",
      "/images/works/way-fixy-2.jpg",
      "/images/works/way-fixy-3.jpg",
      "/images/works/way-fixy-4.jpg",
    ],
    pdf: "/works/way-fixy.pdf",
  },
  {
    id: 10,
    title: "Clair",
    slug: "clair-brandbook",
    year: 2023,
    shortDescription: "Brand identity and guidelines.",
    sticker: "/images/works/clair-brandbook-0.jpg",
    styleframes: [
      "/images/works/clair-brandbook-0.jpg",
      "/images/works/clair-brandbook-1.jpg",
      "/images/works/clair-brandbook-2.jpg",
      "/images/works/clair-brandbook-3.jpg",
      "/images/works/clair-brandbook-4.jpg",
    ],
    pdf: "/works/clair-brandbook.pdf",
  },
  {
    id: 11,
    title: "Caseway",
    slug: "caseway-brandbook",
    year: 2026,
    shortDescription: "Complete brand identity & guidelines.",
    sticker: "/images/works/case-study-0.jpg",
    styleframes: [
      "/images/works/case-study-0.jpg",
      "/images/works/case-study-1.jpg",
      "/images/works/case-study-2.jpg",
      "/images/works/case-study-3.jpg",
      "/images/works/case-study-4.jpg",
    ],
    pdf: "/works/case-study.pdf",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return PROJECTS[(i + 1) % PROJECTS.length];
}
