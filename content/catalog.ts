export interface LessonMeta {
  slug: string;
  title: string;
}

export interface Chapter {
  slug: string;
  title: string;
  lessons: LessonMeta[];
}

export const catalog: Chapter[] = [
  {
    slug: "classic",
    title: "经典控制",
    lessons: [{ slug: "transfer-function", title: "传递函数入门" }],
  },
  {
    slug: "modern",
    title: "现代控制",
    lessons: [],
  },
  {
    slug: "robust",
    title: "鲁棒控制",
    lessons: [],
  },
  {
    slug: "computer-control",
    title: "计算机控制",
    lessons: [],
  },
  {
    slug: "mpc",
    title: "预测控制",
    lessons: [],
  },
  {
    slug: "nonlinear",
    title: "非线性控制",
    lessons: [],
  },
  {
    slug: "intelligent",
    title: "智能控制",
    lessons: [],
  },
  {
    slug: "rl-control",
    title: "强化学习控制",
    lessons: [],
  },
  {
    slug: "discrete",
    title: "离散控制",
    lessons: [],
  },
  {
    slug: "multi-agent",
    title: "多智能体控制",
    lessons: [],
  },
];
