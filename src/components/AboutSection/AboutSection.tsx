import { HistoryTimeline } from '../HistoryTimeline/HistoryTimeline';
import { PillarsSwitcher } from '../PillarsSwitcher/PillarsSwitcher';

/** "Sobre": the church's story (Somos) followed by its three pillars. */
export function AboutSection() {
  return (
    <>
      <HistoryTimeline />
      <PillarsSwitcher />
    </>
  );
}
