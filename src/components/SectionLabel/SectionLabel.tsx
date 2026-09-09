import { Reveal } from '../Reveal/Reveal';

interface SectionLabelProps {
  title: string;
}

export function SectionLabel({ title }: SectionLabelProps) {
  return (
    <Reveal y={16}>
      <span className="label">{title}</span>
    </Reveal>
  );
}
