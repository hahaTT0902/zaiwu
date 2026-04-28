// ═══════════════════════════════════════════════════════════════════════════
// 新闻 / 博客数据文件
// ───────────────────────────────────────────────────────────────────────────
// 添加新文章：在数组 **开头** 插入一个新对象（最新的排最前）
//
// 每条文章的字段说明：
//   id       — 唯一标识，建议用 "YYYY-NNN" 格式
//   date     — 显示日期，格式 "YYYY-MM-DD"
//   category — 分类标签 { zh, en }
//   title    — 标题 { zh, en }
//   summary  — 卡片摘要（一两句话）{ zh, en }
//   body     — 正文 Markdown（支持 ## 标题、- 列表、**加粗**、普通段落）{ zh, en }
//   image    — 封面图 URL
//   tags     — 标签数组 [{ zh, en }, ...]
// ═══════════════════════════════════════════════════════════════════════════

export const NEWS = [
  // ── 在这里插入最新文章 ────────────────────────────────────────────────
  {
    id: "2025-003",
    date: "2025-04-20",
    category: { zh: "项目动态", en: "Project Update" },
    title: {
      zh: "载物 2025 春季招新正式启动",
      en: "Spring 2025 Recruitment Now Open",
    },
    summary: {
      zh: "载物 2025 春季招新正式开始，诚邀对中文写作、文化传播与公益实践有热情的同学加入我们，共同建设这个学生文化公益项目。",
      en: "Ink & Heritage opens its Spring 2025 recruitment, inviting students passionate about Chinese writing, cultural communication, and public welfare to join and help build this student-led project.",
    },
    body: {
      zh: `## 关于此次招新

载物 2025 春季招新于 4 月 20 日正式开始。本次招新面向所有在校学生，不设经验门槛——只要你愿意认真做事，我们都欢迎你。

## 招新方向

本次招新涵盖七个方向：

- **写作与投稿**：撰写诗歌、散文、小说、书评和文化随想
- **编辑与版式**：审稿、语言润色、主题策划与排版设计
- **视频与新媒体**：文学视频、活动纪录、海报和社交媒体内容
- **网站与技术**：论坛维护、UI 优化和内容发布系统
- **文化活动策划**：节日活动、书法工作坊、阅读沙龙
- **文创义卖**：书签、明信片、帆布袋、贴纸等创意产品设计
- **公益项目**：暖餐行动、社区文化课、节日外展、非遗记录

## 我们在寻找什么样的人

不一定要已经很有经验，但要愿意认真做事。不一定要中文特别强，但要愿意阅读、表达和学习。不一定要会设计或技术，但要愿意尝试、愿意把作品做出来。

我们是一个学生社群，也是一个真实运作的文化项目。你将不只是参与者，更是建设者。

## 如何报名

填写报名表，选择你感兴趣的方向（可多选），简述你的经历和想法。我们会在收到表单后一周内与你联系。

我们期待与你一起，用文字承载思想，用行动回应现实。`,
      en: `## About This Recruitment

Ink & Heritage's Spring 2025 recruitment opens on April 20. This round welcomes all enrolled students. No prior experience is required — we only ask that you bring genuine commitment.

## Open Roles

This recruitment covers seven directions:

- **Writers & Contributors**: Poetry, essays, fiction, literary reviews, and cultural reflections
- **Editors & Layout Designers**: Manuscript review, language editing, theme planning, and magazine layout
- **Video & New Media**: Literary videos, event recaps, posters, and social media content
- **Web & Technology**: Forum maintenance, UI improvement, and publishing systems
- **Cultural Event Planners**: Festival events, calligraphy workshops, reading salons
- **Creative Charity Sales**: Design of bookmarks, postcards, tote bags, and stickers
- **Public Welfare Projects**: Warm Meals Initiative, community cultural courses, heritage documentation

## Who We Are Looking For

You do not need prior experience — just genuine commitment. You do not need to be an expert in Chinese — just the willingness to read, express, and learn. You do not need design or technical skills — just the willingness to try and create real things.

We are a student community and a real, operating cultural project. You will not just be a participant — you will be a builder.

## How to Apply

Complete the application form, select the direction(s) you are interested in, and briefly describe your background and interests. We will contact you within one week of receiving your application.

We look forward to building something meaningful together — culture carried through words, action responding to reality.`,
    },
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
    tags: [{ zh: "招新", en: "Recruitment" }, { zh: "2025", en: "2025" }],
  },

  {
    id: "2025-002",
    date: "2025-03-15",
    category: { zh: "杂志", en: "Magazine" },
    title: {
      zh: "《不合时宜》创刊号正式发布",
      en: "Buheshiyi Magazine Issue 1 Released",
    },
    summary: {
      zh: "《不合时宜》创刊号已正式发布，收录诗歌、散文、小说节选与文化评论，完整体现载物的编辑理念与文化主张。",
      en: "The inaugural issue of Buheshiyi Magazine has been released, featuring poetry, essays, fiction excerpts, and cultural criticism that fully embody the editorial vision of Ink & Heritage.",
    },
    body: {
      zh: `## 关于创刊号

《不合时宜》创刊号于 2025 年 3 月正式发布。刊名"不合时宜"取自一种与主流保持距离的态度——因为我们相信，真正有价值的想法往往走在时代前面，或者拒绝被时代吸收。

本期由载物编辑部策划与制作，历时三个月完成从征稿到出版的全流程。

## 本期内容

- **诗歌专题**：「余光」—— 关于记忆与消失的六首诗
- **散文**：「某个冬天的下午」「在异乡说中文」
- **小说节选**：未完成的旅途
- **文化评论**：「汉字作为一种思维方式」
- **视觉特辑**：传统纹样与现代排版的对话

## 编辑理念

每一期《不合时宜》都会围绕一个核心主题展开。创刊号的主题是"余光"——那些正在消失却依然发光的事物。从记忆到语言，从传统到身份认同，我们试图在文字里留住那些正在被遗忘的东西。

## 获取方式

《不合时宜》可通过我们的网站在线阅读，纸质版将于下一次文化活动现场派发。感谢所有投稿者和参与编辑的同学。`,
      en: `## About Issue 1

Buheshiyi Magazine's inaugural issue was released in March 2025. The name "Buheshiyi" (不合时宜) means "untimely" or "out of step" — because we believe truly valuable ideas often run ahead of their time, or refuse to be absorbed by it.

This issue was planned and produced by the Ink & Heritage editorial team over three months, covering the full pipeline from open submissions to publication.

## Contents

- **Poetry Feature**: "Afterglow" — Six poems on memory and disappearance
- **Essays**: "One Winter Afternoon" and "Speaking Chinese Abroad"
- **Fiction Excerpt**: An Unfinished Journey
- **Cultural Criticism**: "Hanzi as a Way of Thinking"
- **Visual Feature**: A dialogue between traditional patterns and modern typography

## Editorial Vision

Each issue of Buheshiyi is built around a central editorial theme. Issue 1's theme is "Afterglow" — things that are disappearing but still glowing. From memory to language, from tradition to identity, we attempt to preserve in words the things at risk of being forgotten.

## How to Read

Buheshiyi is available to read online through our website. Print copies will be distributed at our next cultural event. Our thanks to every contributor and editor involved.`,
    },
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80",
    tags: [{ zh: "杂志", en: "Magazine" }, { zh: "不合时宜", en: "Buheshiyi" }],
  },

  {
    id: "2025-001",
    date: "2025-02-08",
    category: { zh: "公益", en: "Public Welfare" },
    title: {
      zh: "春节暖餐行动圆满完成",
      en: "Spring Festival Warm Meals Initiative Completed",
    },
    summary: {
      zh: "春节期间，载物暖餐行动为社区困难家庭提供餐食支持，共筹善款超过 2000 元，惠及 32 个家庭，18 名志愿者参与其中。",
      en: "During Spring Festival, the Warm Meals Initiative provided food support to families in need, raising over ¥2,000 and benefiting 32 households, with 18 student volunteers involved.",
    },
    body: {
      zh: `## 行动回顾

2025 年春节期间，载物暖餐行动正式落地。本次行动历时 12 天，通过文创义卖和线上捐赠两个渠道筹集善款，最终为社区 32 个困难家庭提供了春节餐食支持。

## 数据概览

- **参与志愿者**：18 人
- **筹集善款**：¥2,347
- **受益家庭**：32 户
- **配送餐食**：96 份

## 义卖与筹款

本次暖餐行动的资金来源主要是两部分：春节文创义卖摊位（书签、明信片、手写春联）和线上捐赠。义卖摊位由载物文创团队独立设计和运营，三天内完成筹款目标的 75%。

## 我们学到了什么

这是载物第一次系统性地将文化活动收益直接转化为社区服务。从义卖摊位的设计到配送路线的规划，每一个环节都由学生团队独立完成。

我们相信，文化的价值不只在于它能被欣赏，更在于它能被转化为真实的帮助。暖餐行动是这种信念最直接的实践。

## 感谢

感谢所有购买文创产品的支持者，感谢参与配送的志愿者，感谢接受我们帮助的家庭给我们这个机会去做一些真实的事情。`,
      en: `## Action Summary

During Spring Festival 2025, the Ink & Heritage Warm Meals Initiative was fully executed. Over 12 days, the initiative raised funds through creative charity sales and online donations, ultimately delivering Spring Festival meal support to 32 families in need within the community.

## Key Figures

- **Volunteers involved**: 18
- **Funds raised**: ¥2,347
- **Households benefited**: 32
- **Meals delivered**: 96

## Charity Sales & Fundraising

The funding came from two sources: a Spring Festival creative charity stall (bookmarks, postcards, handwritten spring couplets) and online donations. The stall was independently designed and operated by the Ink & Heritage creative team, reaching 75% of the fundraising target within three days.

## What We Learned

This was Ink & Heritage's first systematic effort to directly convert cultural activity proceeds into community service. From the design of the charity stall to the logistics of delivery, every step was handled independently by the student team.

We believe the value of culture lies not only in being appreciated, but in being converted into real help. The Warm Meals Initiative is the most direct embodiment of that belief.

## Thank You

Thank you to everyone who purchased creative products. Thank you to the volunteers who delivered meals. And thank you to the families who received our support — you gave us the opportunity to do something real.`,
    },
    image: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=1200&q=80",
    tags: [{ zh: "公益", en: "Public Welfare" }, { zh: "暖餐行动", en: "Warm Meals" }],
  },
];
