import { ChargingGameExplorer } from "@/components/wiki/charging-game-explorer";
import { GraphConsensusExplorer } from "@/components/wiki/graph-consensus-explorer";
import { BracketMotionExplorer } from "@/components/wiki/bracket-motion-explorer";
import { FiniteHorizonExplorer } from "@/components/wiki/finite-horizon-explorer";
import { PowerAllocationExplorer } from "@/components/wiki/power-allocation-explorer";
import { ARProcessExplorer } from "@/components/wiki/ar-process-explorer";
import { BayesWindowExplorer } from "@/components/wiki/bayes-window-explorer";
import { ZSequenceExplorer } from "@/components/wiki/z-sequence-explorer";
import { FourierSynthesisExplorer } from "@/components/wiki/fourier-synthesis-explorer";
import { LaplaceWeightExplorer } from "@/components/wiki/laplace-weight-explorer";
import { CascadeExponentialExplorer } from "@/components/wiki/cascade-exponential-explorer";
import { MotionIntroExplorer } from "@/components/wiki/motion-intro-explorer";
import { LinearMapExplorer } from "@/components/wiki/linear-map-explorer";
import { EigenIterationExplorer } from "@/components/wiki/eigen-iteration-explorer";
import { SvdSensitivityExplorer } from "@/components/wiki/svd-sensitivity-explorer";
import { HillGradientExplorer } from "@/components/wiki/hill-gradient-explorer";
/**
 * 组件注册的唯一来源（E2 · fix-015 根治）。
 *
 * 此前 mdx-components.tsx 与 lib/content.ts 各存一份内联映射，新增组件必须两处同改，
 * 漏一处就 500「Expected component X to be defined」。现在两处都从这里导入。
 *
 * 本文件禁止加 "use client"：加了以后这个对象本身会变成一个 client reference，
 * 服务端 lib/content.ts 里的 {...wikiComponents} 展开就拿不到各个组件了。
 * 各个 explorer 自己带 "use client"，服务端模块导入它们得到的是 client reference，
 * 这正是 compileMDX({components}) 需要的形态，所以本文件保持中立即可。
 *
 * 校验：node scripts/verify-lesson.mjs 第 4 项 + 末尾「组件注册结构」附录 / npm run check 第 5 节。
 */
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { createElement } from "react";
import { withBasePath } from "@/lib/deployment";
import { CalculusExplorer } from "@/components/wiki/calculus-explorer";
import { Callout } from "@/components/wiki/callout";
import { JupyterNotebook } from "@/components/wiki/jupyter-notebook";
import { SuspensionExplorer } from "@/components/wiki/suspension-explorer";
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
import { SlidingModeExplorer } from "@/components/wiki/sliding-mode-explorer";
import { BacksteppingExplorer } from "@/components/wiki/backstepping-explorer";
import { MracExplorer } from "@/components/wiki/mrac-explorer";
import { FuzzyExplorer } from "@/components/wiki/fuzzy-explorer";
import FuzzyTuningExplorer from "@/components/wiki/fuzzy-tuning-explorer";
import NeuralNetworkExplorer from "@/components/wiki/neural-network-explorer";
import { TraceDetExplorer } from "@/components/wiki/trace-det-explorer";
import { PhasePlaneExplorer } from "@/components/wiki/phase-plane-explorer";
import { NonlinearityExplorer } from "@/components/wiki/nonlinearity-explorer";
import { ClosedLoopFreqExplorer } from "@/components/wiki/closed-loop-freq-explorer";
import { DelayMarginExplorer } from "@/components/wiki/delay-margin-explorer";
import { SensitivityExplorer } from "@/components/wiki/sensitivity-explorer";
import { PControlTradeoffExplorer } from "@/components/wiki/p-control-tradeoff-explorer";
import { StateSpaceExplorer } from "@/components/wiki/state-space-explorer";
import { StateFeedbackPoleExplorer } from "@/components/wiki/state-feedback-pole-explorer";
import { ObserverSpeedExplorer } from "@/components/wiki/observer-speed-explorer";
import { OptimalTimeExplorer } from "@/components/wiki/optimal-time-explorer";
import { ComplexPolarExplorer } from "@/components/wiki/complex-polar-explorer";

import { LqrExplorer } from "@/components/wiki/lqr-explorer";

import { MimoProportionalExplorer } from "@/components/wiki/mimo-proportional-explorer";

export const wikiComponents: MDXComponents = {
  ChargingGameExplorer,
  GraphConsensusExplorer,
  BracketMotionExplorer,
  FiniteHorizonExplorer,
  PowerAllocationExplorer,
  ARProcessExplorer,
  BayesWindowExplorer,
  ZSequenceExplorer,
  FourierSynthesisExplorer,
  LaplaceWeightExplorer,
  CascadeExponentialExplorer,
  a: ({ href = "", ...props }: ComponentProps<"a">) => createElement("a", { ...props, href: withBasePath(href) }),
  img: ({ src = "", ...props }: ComponentProps<"img">) => createElement("img", { ...props, src: withBasePath(src) }),
  MotionIntroExplorer,
  CalculusExplorer,
  Callout,
  JupyterNotebook,
  SuspensionExplorer,
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
  SlidingModeExplorer,
  BacksteppingExplorer,
  MracExplorer,
  FuzzyExplorer,
  FuzzyTuningExplorer,
  NeuralNetworkExplorer,
  TraceDetExplorer,
  PhasePlaneExplorer,
  NonlinearityExplorer,
  ClosedLoopFreqExplorer,
  DelayMarginExplorer,
  SensitivityExplorer,
  PControlTradeoffExplorer,
  StateSpaceExplorer,
  StateFeedbackPoleExplorer,
  ObserverSpeedExplorer,
  OptimalTimeExplorer,
  LqrExplorer,
  MimoProportionalExplorer,
  ComplexPolarExplorer,
  LinearMapExplorer,
  EigenIterationExplorer,
  SvdSensitivityExplorer,
  HillGradientExplorer,
};
