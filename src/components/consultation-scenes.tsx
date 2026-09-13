import type { ReactNode } from "react";

/**
 * Six illustrated scenes for the consultation-block backdrop, generated to
 * match the site's navy/gold/cream palette. Swap the source files in
 * /public/illustrations to update a scene without touching this file.
 */

function Scene({ src, alt }: { src: string; alt: string }): ReactNode {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img src={src} alt={alt} className="h-full w-full object-contain" loading="eager" />
    </div>
  );
}

const AdvisorDesk = () => <Scene src="/illustrations/advisor-desk.png" alt="" />;
const PathToGoal = () => <Scene src="/illustrations/path-to-goal.png" alt="" />;
const NewHome = () => <Scene src="/illustrations/new-home.png" alt="" />;
const GrowthClimb = () => <Scene src="/illustrations/growth-climb.png" alt="" />;
const LenderHandshake = () => <Scene src="/illustrations/lender-handshake.png" alt="" />;
const FamilyFuture = () => <Scene src="/illustrations/family-future.png" alt="" />;

export const CONSULTATION_SCENES: (() => ReactNode)[] = [
  AdvisorDesk,
  PathToGoal,
  NewHome,
  GrowthClimb,
  LenderHandshake,
  FamilyFuture,
];
