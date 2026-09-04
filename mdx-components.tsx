import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/wiki/callout";
import { StepResponseSlider } from "@/components/wiki/step-response-slider";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    StepResponseSlider,
    ...components,
  };
}
