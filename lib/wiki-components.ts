import { EconomicMpcExplorer } from "@/components/wiki/economic-mpc-explorer";
import { MuAnalysisExplorer } from '@/components/wiki/mu-analysis-explorer';
import { NonlinearMpcExplorer } from "@/components/wiki/nonlinear-mpc-explorer";
import { LearningEvaluationExplorer } from '@/components/wiki/learning-evaluation-explorer';
import { IdentificationCaseExplorer } from "@/components/wiki/identification-case-explorer";
import { ImplementationCaseExplorer } from "@/components/wiki/implementation-case-explorer";
import { EstimationCaseExplorer } from "@/components/wiki/estimation-case-study-explorer";
import { MixedSensitivityExplorer } from '@/components/wiki/mixed-sensitivity-explorer';
import { HilRehearsalExplorer } from "@/components/wiki/hil-rehearsal-explorer";
import { GenerativeBasicsExplorer } from '@/components/wiki/generative-basics-explorer';
import { ExplicitMpcExplorer } from "@/components/wiki/explicit-mpc-explorer";
import { SensorFusionExplorer } from "@/components/wiki/sensor-fusion-explorer";
import { NonlinearIdentificationExplorer } from "@/components/wiki/nonlinear-identification-explorer";
import { IndustrialSerialExplorer } from "@/components/wiki/industrial-serial-explorer";
import { HInfinityExplorer } from '@/components/wiki/h-infinity-explorer';
import { ParticleFilterExplorer } from "@/components/wiki/particle-filter-explorer";
import { GpcExplorer } from "@/components/wiki/gpc-explorer";
import { SubspaceIdentificationExplorer } from "@/components/wiki/subspace-identification-explorer";
import { RepresentationBasicsExplorer } from '@/components/wiki/representation-basics-explorer';
import { NetworkFeedbackExplorer } from "@/components/wiki/network-feedback-explorer";
import { FrequencyIdentificationExplorer } from "@/components/wiki/frequency-identification-explorer";
import { RealtimeSchedulingExplorer } from "@/components/wiki/realtime-scheduling-explorer";
import { MpcStabilityExplorer } from "@/components/wiki/mpc-stability-explorer";
import { RobustPerformanceExplorer } from '@/components/wiki/robust-performance-explorer';
import { UnscentedKalmanExplorer } from "@/components/wiki/unscented-kalman-explorer";
import { AttentionBasicsExplorer } from '@/components/wiki/attention-basics-explorer';
import { ClosedLoopIdentificationExplorer } from "@/components/wiki/closed-loop-identification-explorer";
import { ConstraintHandlingExplorer } from "@/components/wiki/constraint-handling-explorer";
import { SequenceModelsExplorer } from '@/components/wiki/sequence-models-explorer';
import { EmbeddedControlExplorer } from "@/components/wiki/embedded-control-explorer";
import { ExtendedKalmanExplorer } from "@/components/wiki/extended-kalman-explorer";
import { RobustStabilityExplorer } from '@/components/wiki/robust-stability-explorer';
import { AutodiffTrainingExplorer } from '@/components/wiki/autodiff-training-explorer';
import { RecedingHorizonExplorer } from "@/components/wiki/receding-horizon-explorer";
import { ControllerDeploymentExplorer } from "@/components/wiki/controller-deployment-explorer";
import { KalmanNoiseExplorer } from "@/components/wiki/kalman-noise-explorer";
import { PersistentExcitationExplorer } from "@/components/wiki/persistent-excitation-explorer";
import { BellmanValuesExplorer } from "@/components/wiki/bellman-values-explorer";
import { ImitationLearningExplorer } from '@/components/wiki/imitation-learning-explorer';
import { PredictionModelExplorer } from "@/components/wiki/prediction-model-explorer";
import { MultimodalObservationExplorer } from "@/components/wiki/multimodal-observation-explorer";
import { UncertaintyModelExplorer } from '@/components/wiki/uncertainty-model-explorer';
import { PidTuningExplorer } from "@/components/wiki/pid-tuning-explorer";
import { NeuralNetworkBasicsExplorer } from '@/components/wiki/neural-network-basics-explorer';
import { VehicleDynamicsExplorer } from "@/components/wiki/vehicle-dynamics-explorer";
import { RlsIdentificationExplorer } from "@/components/wiki/rls-identification-explorer";
import { StatisticalEstimationExplorer } from "@/components/wiki/statistical-estimation-explorer";
import BuckConverterExplorer from "@/components/wiki/buck-converter-explorer";
import { DigitalPidExplorer } from "@/components/wiki/digital-pid-explorer";
import { SafetyStoppingExplorer } from "@/components/wiki/safety-stopping-explorer";
import { EmbodiedLoopExplorer } from "@/components/wiki/embodied-loop-explorer";
import { MpcPrincipleExplorer } from "@/components/wiki/mpc-principle-explorer";
import { RobotSystemExplorer } from "@/components/wiki/robot-system-explorer";
import { RlProblemExplorer } from "@/components/wiki/rl-problem-explorer";
import { SupervisedLearningExplorer } from "@/components/wiki/supervised-learning-explorer";
import { MultiAgentOverviewExplorer } from "@/components/wiki/multi-agent-overview-explorer";
import { DrivingSystemExplorer } from "@/components/wiki/driving-system-explorer";
import { ResonanceRobustnessExplorer } from '@/components/wiki/resonance-robustness-explorer';
import { EstimationFrameworkExplorer } from "@/components/wiki/estimation-framework-explorer";
import { ControlArchitectureExplorer } from "@/components/wiki/control-architecture-explorer";
import { LearningGeneralizationExplorer } from "@/components/wiki/learning-generalization-explorer";
import { EventTriggeredExplorer } from "@/components/wiki/event-triggered-explorer";
import { DiscreteOptimalExplorer } from "@/components/wiki/discrete-optimal-explorer";
import { SampledDataExplorer } from "@/components/wiki/sampled-data-explorer";
import { SamplingBudgetExplorer } from "@/components/wiki/sampling-budget-explorer";
import { DiscretizationModeExplorer } from "@/components/wiki/discretization-mode-explorer";
import { JuryStabilityExplorer } from "@/components/wiki/jury-stability-explorer";
import { SampledModeExplorer } from "@/components/wiki/sampled-mode-explorer";
import { CoolingNumericsExplorer } from "@/components/wiki/cooling-numerics-explorer";
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
import { PassivityExplorer } from "@/components/wiki/passivity-explorer";
import { IssSmallGainExplorer } from "@/components/wiki/iss-small-gain-explorer";
import { SamplingQuantizationExplorer } from "@/components/wiki/sampling-quantization-explorer";
import { BifurcationExplorer } from "@/components/wiki/bifurcation-explorer";
import { SwitchedHybridExplorer } from "@/components/wiki/switched-hybrid-explorer";
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

import { CartPoleNoiseExplorer } from "@/components/wiki/cart-pole-noise-explorer";
import { MimoProportionalExplorer } from "@/components/wiki/mimo-proportional-explorer";

export const wikiComponents: MDXComponents = {
  EconomicMpcExplorer,
  NonlinearMpcExplorer,
  LearningEvaluationExplorer,
  IdentificationCaseExplorer,
  ImplementationCaseExplorer,
  EstimationCaseExplorer,
  HilRehearsalExplorer,
  GenerativeBasicsExplorer,
  ExplicitMpcExplorer,
  SensorFusionExplorer,
  NonlinearIdentificationExplorer,
  IndustrialSerialExplorer,
  ParticleFilterExplorer,
  GpcExplorer,
  SubspaceIdentificationExplorer,
  RepresentationBasicsExplorer,
  NetworkFeedbackExplorer,
  FrequencyIdentificationExplorer,
  RealtimeSchedulingExplorer,
  MpcStabilityExplorer,
  UnscentedKalmanExplorer,
  AttentionBasicsExplorer,
  ClosedLoopIdentificationExplorer,
  ConstraintHandlingExplorer,
  SequenceModelsExplorer,
  EmbeddedControlExplorer,
  ExtendedKalmanExplorer,
  RobustStabilityExplorer,
  MuAnalysisExplorer,
  MixedSensitivityExplorer,
  HInfinityExplorer,
  RobustPerformanceExplorer,
  AutodiffTrainingExplorer,
  RecedingHorizonExplorer,
  ControllerDeploymentExplorer,
  KalmanNoiseExplorer,
  PersistentExcitationExplorer,
  BellmanValuesExplorer,
  ImitationLearningExplorer,
  PredictionModelExplorer,
  MultimodalObservationExplorer,
  UncertaintyModelExplorer,
  PidTuningExplorer,
  NeuralNetworkBasicsExplorer,
  VehicleDynamicsExplorer,
  RlsIdentificationExplorer,
  StatisticalEstimationExplorer,
  BuckConverterExplorer,
  SafetyStoppingExplorer,
  EmbodiedLoopExplorer,
  MpcPrincipleExplorer,
  RobotSystemExplorer,
  RlProblemExplorer,
  SupervisedLearningExplorer,
  MultiAgentOverviewExplorer,
  DrivingSystemExplorer,
  ResonanceRobustnessExplorer,
  EstimationFrameworkExplorer,
  ControlArchitectureExplorer,
  DigitalPidExplorer,
  LearningGeneralizationExplorer,
  EventTriggeredExplorer,
  DiscreteOptimalExplorer,
  SampledDataExplorer,
  SamplingBudgetExplorer,
  DiscretizationModeExplorer,
  JuryStabilityExplorer,
  SampledModeExplorer,
  CoolingNumericsExplorer,
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
  PassivityExplorer,
  IssSmallGainExplorer,
  SwitchedHybridExplorer,
  BifurcationExplorer,
  SamplingQuantizationExplorer,
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
  CartPoleNoiseExplorer,
  ComplexPolarExplorer,
  LinearMapExplorer,
  EigenIterationExplorer,
  SvdSensitivityExplorer,
  HillGradientExplorer,
};
