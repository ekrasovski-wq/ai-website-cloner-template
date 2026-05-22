import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { CloseIcon } from "@/components/icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex items-center justify-center p-[30px]">
      <Link
        href="/"
        aria-label="Close project"
        className="fixed top-[30px] right-[30px] z-50 w-[48px] h-[48px] rounded-full bg-[#FAFAFA] text-[#0A0A0A] flex items-center justify-center hover:scale-[1.05] active:scale-[0.95] transition-transform"
      >
        <CloseIcon className="w-[14px] h-[14px]" />
      </Link>
      <div
        className="relative w-full max-w-[1100px] aspect-[16/9] rounded-[12px] overflow-hidden"
        style={{ backgroundColor: project.dominantBg }}
      >
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="object-cover"
          priority
        />
      </div>
      <div className="fixed bottom-[40px] left-1/2 -translate-x-1/2 flex items-center gap-[12px] text-[14px] text-[#FAFAFA]/80">
        <span className="text-[#FAFAFA] font-medium">{project.title}</span>
        <span>•</span>
        <span>{project.year}</span>
      </div>
    </div>
  );
}
