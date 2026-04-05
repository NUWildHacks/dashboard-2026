import type { ReactNode } from "react";

type StepsProps = {
  readonly children: ReactNode;
};

const Steps = ({ children }: StepsProps) => {
  return <div className="guide-steps">{children}</div>;
};

export { Steps };
