interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <header>
      <p className="section-eyebrow code-text">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm sm:text-base text-muted">{description}</p>
    </header>
  );
}
