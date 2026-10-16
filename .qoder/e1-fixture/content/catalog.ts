export const catalog: Chapter[] = [
  {
    slug: "fx",
    title: "缺陷注入 fixture 章",
    order: 0,
    lessons: [
      {
        slug: "good-lesson",
        title: "对照组：九项全绿",
        level: "undergrad",
        type: "theory",
        status: "v1.3",
        subsections: [
          { slug: "第一节", title: "第一节" },
          { slug: "第二节", title: "第二节" },
          { slug: "习题", title: "习题" },
          { slug: "答案", title: "答案" },
        ],
      },
      {
        slug: "bad-lesson",
        title: "注入组：逐项缺陷",
        level: "undergrad",
        type: "theory",
        status: "v1.3",
        prereq: ["fx/good-lesson"],
        subsections: [
          { slug: "第一节", title: "第一节" },
          { slug: "第二节", title: "第二节" },
          { slug: "习题", title: "习题" },
          { slug: "答案", title: "答案" },
        ],
      },
      { slug: "skeleton-lesson", title: "骨架课", level: "undergrad", type: "theory", status: "empty" },
    ],
  },
];
