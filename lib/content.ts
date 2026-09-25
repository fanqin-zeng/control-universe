import { compileMDX } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

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
import { SlidingModeExplorer } from "@/components/wiki/sliding-mode-explorer";
import { BacksteppingExplorer } from "@/components/wiki/backstepping-explorer";
import { MracExplorer } from "@/components/wiki/mrac-explorer";
import { FuzzyExplorer } from "@/components/wiki/fuzzy-explorer";
import FuzzyTuningExplorer from "@/components/wiki/fuzzy-tuning-explorer";
import NeuralNetworkExplorer from "@/components/wiki/neural-network-explorer";
import { TraceDetExplorer } from "@/components/wiki/trace-det-explorer";
import { PhasePlaneExplorer } from "@/components/wiki/phase-plane-explorer";
import { NonlinearityExplorer } from "@/components/wiki/nonlinearity-explorer";
import { logger } from "@/lib/logger";

const contentDir = path.join(process.cwd(), "content");

export interface LessonMeta {
  title: string;
  description: string;
}

export async function getLesson(chapter: string, lesson: string) {
  const filePath = path.join(contentDir, chapter, `${lesson}.mdx`);
  logger.debug("加载课程", { chapter, lesson });

  let source: string;
  try {
    source = await readFile(filePath, "utf8");
  } catch (err) {
    logger.error("MDX 文件读取失败", {
      file: `${chapter}/${lesson}.mdx`,
      err: err instanceof Error ? err : new Error(String(err)),
    });
    throw err;
  }

  const result = await compileLessonSource(source, lesson);
  logger.info("课程加载完成", { chapter, lesson, title: result.meta.title });
  return result;
}

async function compileLessonSource(source: string, fallbackTitle: string) {
  try {
    const { content, frontmatter } = await compileMDX<LessonMeta>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          remarkPlugins: [remarkGfm, remarkMath] as any,
          rehypePlugins: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rehypeKatex as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [rehypePrettyCode, { theme: "github-light" }] as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rehypeSlug as any,
          ],
        },
      },
      components: {
        Callout, JupyterNotebook, SuspensionExplorer,
        FirstOrderComparisonExplorer, PoleZeroExplorer, StepBodeExplorer,
        ImpulseExplorer, FirstOrderStepExplorer, PerformanceMetricsExplorer,
        SecondOrderStepExplorer, SuspensionTimeExplorer,
        BodeZetaExplorer, NyquistZetaExplorer, BandwidthCorrespondenceExplorer,
        RCFilterBodeExplorer, RootLocusKExplorer,
        PidDerivativeFilterExplorer, PidKiKdExplorer,
        StabilityThirdOrderExplorer, StabilityDelayExplorer,
        LeadCompensatorExplorer, LagCompensatorExplorer,
        LeadLagCompensatorExplorer, AntiWindupExplorer,
        DescribingFunctionExplorer, NyquistLimitCycleExplorer,
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
      },
    });

    return {
      content,
      meta: {
        title: frontmatter.title ?? fallbackTitle,
        description: frontmatter.description ?? "",
      },
    };
  } catch (err) {
    logger.error("MDX 编译失败", {
      lesson: fallbackTitle,
      err: err instanceof Error ? err : new Error(String(err)),
    });
    throw err;
  }
}
