import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/wiki/callout";
import { StepResponseSlider } from "@/components/wiki/step-response-slider";
import { JupyterNotebook } from "@/components/wiki/jupyter-notebook";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    StepResponseSlider,
    JupyterNotebook,
    ...components,
  };
}
