import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/wiki/callout";
import { JupyterNotebook } from "@/components/wiki/jupyter-notebook";
import { SuspensionExplorer } from "@/components/wiki/suspension-explorer";
import { FirstOrderComparisonExplorer } from "@/components/wiki/first-order-comparison-explorer";
import { PoleZeroExplorer } from "@/components/wiki/pole-zero-explorer";
import { StepBodeExplorer } from "@/components/wiki/step-bode-explorer";
import { ImpulseExplorer } from "@/components/wiki/impulse-explorer";
import { FirstOrderStepExplorer } from "@/components/wiki/first-order-step-explorer";
import { PerformanceMetricsExplorer } from "@/components/wiki/performance-metrics-explorer";
import { SecondOrderStepExplorer } from "@/components/wiki/second-order-step-explorer";
import { SuspensionTimeExplorer } from "@/components/wiki/suspension-time-explorer";
import { BodeZetaExplorer } from "@/components/wiki/bode-zeta-explorer";
import { NyquistZetaExplorer } from "@/components/wiki/nyquist-zeta-explorer";
import { BandwidthCorrespondenceExplorer } from "@/components/wiki/bandwidth-correspondence-explorer";
import { RCFilterBodeExplorer } from "@/components/wiki/rc-filter-bode-explorer";
import { RootLocusKExplorer } from "@/components/wiki/root-locus-k-explorer";
import { PidDerivativeFilterExplorer } from "@/components/wiki/pid-derivative-filter-explorer";
import { PidKiKdExplorer } from "@/components/wiki/pid-ki-kd-explorer";
import { StabilityThirdOrderExplorer } from "@/components/wiki/stability-third-order-explorer";
import { StabilityDelayExplorer } from "@/components/wiki/stability-delay-explorer";
import { LeadCompensatorExplorer } from "@/components/wiki/lead-compensator-explorer";
import { LagCompensatorExplorer } from "@/components/wiki/lag-compensator-explorer";
import { LeadLagCompensatorExplorer } from "@/components/wiki/lead-lag-compensator-explorer";
import { AntiWindupExplorer } from "@/components/wiki/antiwindup-explorer";
import { DescribingFunctionExplorer } from "@/components/wiki/describing-function-explorer";
import { NyquistLimitCycleExplorer } from "@/components/wiki/nyquist-limit-cycle-explorer";
import { LyapunovExplorer } from "@/components/wiki/lyapunov-explorer";
import { ZeroDynamicsExplorer } from "@/components/wiki/zero-dynamics-explorer";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    JupyterNotebook,
    SuspensionExplorer,
    FirstOrderComparisonExplorer,
    PoleZeroExplorer,
    StepBodeExplorer,
    ImpulseExplorer,
    FirstOrderStepExplorer,
    PerformanceMetricsExplorer,
    SecondOrderStepExplorer,
    SuspensionTimeExplorer,
    BodeZetaExplorer,
    NyquistZetaExplorer,
    BandwidthCorrespondenceExplorer,
    RCFilterBodeExplorer,
    RootLocusKExplorer,
    PidDerivativeFilterExplorer,
    PidKiKdExplorer,
    StabilityThirdOrderExplorer,
    StabilityDelayExplorer,
    LeadCompensatorExplorer,
    LagCompensatorExplorer,
    LeadLagCompensatorExplorer,
    AntiWindupExplorer,
    DescribingFunctionExplorer,
    NyquistLimitCycleExplorer,
    LyapunovExplorer,
    ZeroDynamicsExplorer,
    ...components,
  };
}
