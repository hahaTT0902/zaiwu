import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import NewsRoot from "./NewsPage";
import { loadStats } from "./data/stats";
import {
  BookOpen, PenTool, HeartHandshake, Globe2, Sparkles, Users,
  Newspaper, Video, Code2, CalendarDays, Gift, HandHeart,
  Languages, ArrowRight, Mail, ExternalLink, Menu, X,
  ChevronDown, ChevronUp, Quote, Sun, Moon
} from "lucide-react";

// ── Feature flags ──────────────────────────────────────────────────────────
const SHOW_DONATE = false;

// ── Detect browser language ────────────────────────────────────────────────
function detectLang() {
  const nav = (navigator.language || navigator.userLanguage || "zh").toLowerCase();
  return nav.startsWith("zh") ? "zh" : "en";
}

// ── Translations ───────────────────────────────────────────────────────────
const T = {
  zh: {
    langBtn: "EN",
    nav: { about:"项目介绍", whatWeDo:"项目内容", recruitment:"招新", impact:"公益影响", joinUs:"加入我们", news:"新闻", donate:"捐款" },
    hero: {
      title: "载物",
      subtitle: "Ink & Heritage",
      tagline: "中文文学 × 文化传播 × 公益实践",
      body: "载物是一个学生主导的中文文化公益项目。我们连接写作、出版、线上社区、文化传播、文创义卖与公益行动，让中文不只停留在课堂里，而能被书写、被发表、被传播，并真正转化为文化影响力与社会行动。我们相信：语言是一种力量，文化是一种连接，而行动才是最好的答案。",
      cta1: "加入载物", cta2: "了解项目",
      tags: ["学生出版","文化传承","社区影响","中文文学"],
      quote: "厚德载物，自强不息",
    },
    about: {
      title: "关于载物",
      body: `载物取意于厚德载物"。我们希望用文字承载思想，用文化连接社区，用行动回应现实。项目从中文文学出发，延伸到杂志出版、线上论坛、新媒体传播、文创义卖和公益服务，形成一个由学生主导的文化公益生态。\n\n载物不只是一本杂志，也不只是一个论坛。它是一种态度：文字可以有重量，文化可以有温度，而学生完全有能力把想法变成真实的社会影响力。`,
      extra: `我们的名字来自《易经》中的地势坤，君子以厚德载物，意指以宽广的品德包容万物、承载一切。在载物，每一篇文章、每一次活动、每一份义卖收入，都是这种承载精神的具体实践。`,
      cards: [
        { title:"写作与发行", body:"让学生作品被真正阅读、编辑与发布。我们为每位投稿者提供专业编辑支持，确保作品以最好的状态呈现给读者。" },
        { title:"文化传播", body:"用网站、杂志、视频与活动传播中文文化。我们通过多媒体渠道，让文化走出教室，进入更广阔的公共空间。" },
        { title:"公益实践", body:"把文化影响力转化为社区服务与公益行动。我们相信，文化的价值在于它能改变真实的生活与真实的人。" },
      ],
    },
    whatWeDo: {
      title: "我们做什么",
      cards: [
        {
          title: "ZWWX.CLUB 文学论坛",
          body: "发布文章、诗歌、小说、读书笔记、文学评论与文化思考，建设属于学生自己的中文创作平台。",
          extra: "ZWWX.CLUB 是载物的核心数字阵地。在这里，每一位学生作者都能找到自己的读者群体。我们维护着完整的文章审核、编辑与发布流程，每篇文章都经过认真对待。论坛同时也是讨论区、灵感库和协作空间，鼓励跨校、跨地区的中文写作交流。",
          img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
        },
        {
          title: "《不合时宜》杂志",
          body: "由学生参与投稿、审稿、编辑、排版与发布，记录文学作品、文化评论、社会观察与创意写作。",
          extra: `《不合时宜》是载物的旗舰出版物。刊名取自\u201c不合时宜\u201d——我们认为，真正有价值的思想往往走在时代前面，或者拒绝被时代同化。杂志涵盖诗歌、散文、小说节选、文化批评、社会观察和视觉创意，每期均有特定主题，由编委会共同策划与审定。`,
          img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        },
        {
          title: "新媒体内容创作",
          body: "制作文学介绍视频、文化科普、活动记录、海报与社交媒体内容，让文化以更现代的方式被看见。",
          extra: "我们的新媒体团队负责将文字内容转化为视频、图文、Reels 和播客形式。从古典文学导读到当代华人写作介绍，从活动现场记录到幕后花絮，我们希望让每一位关注者都能通过自己习惯的方式接触中文文化。",
          img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
        },
        {
          title: "文化活动与文创义卖",
          body: "策划传统节日活动、书法体验、阅读分享会、文创产品设计与义卖，把文化带到现实生活中。",
          extra: "活动是载物最直接触达社区的方式。我们在春节、中秋、端午等节日策划线下活动，提供书法体验、茶艺、汉服体验等互动项目。文创团队设计并生产书签、明信片、帆布袋、贴纸等产品，用于义卖筹款，所得收益全部用于公益项目。",
          img: "https://images.unsplash.com/photo-1546502011-7b58bc1a1e47?w=800&q=80",
        },
        {
          title: "公益筹款与社区项目",
          body: "通过线上捐赠、义卖和社区活动筹集资源，支持暖餐行动、传统节日outreach、非遗整理和文化教育项目。",
          extra: "载物的公益部门负责资金筹集与项目落地。我们的暖餐行动为有需要的社区成员提供食物支持；我们的文化教育项目为偏远地区学生提供中文写作指导；我们的非遗整理项目收集并数字化保存正在消失的传统技艺与民俗故事。",
          img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
        },
        {
          title: "培养学生综合能力",
          body: "通过真实项目锻炼写作、设计、视频制作、技术开发、活动策划与团队协作能力，积累真实的项目经验。",
          extra: "载物不只是展示作品的平台，更是真实的能力锻炼场。你在这里做的每一件事——每一篇文章、每一次策划、每一行代码——都在帮你成为更有能力的人。我们相信，学生在校期间完全可以积累婲美职场经验的真实项目经历。",
          img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        },
      ],
    },
    recruitment: {
      title: "我们在招什么人？",
      subtitle: "不需要已经很厉害，但需要认真、好奇和愿意把想法付诸行动。",
      cards: [
        { title:"文学创作者 / 投稿作者", body:"参与诗歌、散文、小说、评论、读书笔记、文学分析与论坛投稿。我们欢迎各种风格和主题，只要是认真写的文字，都值得被发表。", fit:"适合喜欢中文写作、阅读和表达观点的人。", img:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80" },
        { title:"杂志编辑 / 审稿 / 排版成员", body:"负责审稿、语言修改、栏目设计、主题策划、封面与内页排版。你将参与一本真实杂志的完整制作流程，积累出版与传媒经验。", fit:"适合认真细致、有审美、对出版和传媒感兴趣的人。", img:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80" },
        { title:"视频与新媒体成员", body:"制作文学介绍视频、活动记录、宣传海报、短视频栏目和社群内容。你的作品将出现在载物所有对外平台，被真实的观众看到和分享。", fit:"适合会Canva、剪映、CapCut、PR、Figma，喜欢视觉表达的人。", img:"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80" },
        { title:"网站与技术成员", body:"维护 ZWWX.CLUB 文学论坛，优化网站UI，管理文章发布系统，搭建投稿与审核流程。这是真实的生产环境，你会接触真实的用户需求。", fit:"适合会HTML / CSS / JS、WordPress、服务器、Nginx、Cloudflare 或愿意学习技术的人。", img:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80" },
        { title:"文化活动策划成员", body:"策划传统节日活动、书法体验课、阅读分享会、文化知识竞赛和校园文学沙龙。你将负责从创意到落地的完整活动流程，锻炼项目管理与沟通协调能力。", fit:"适合愿意沟通、喜欢组织活动、想提升 leadership 和public speaking 的人。", img:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80" },
        { title:"文创与义卖成员", body:"设计书签、明信片、贴纸、帆布袋、书法作品和公益产品，参与义卖、成本计算与定价。你设计的产品将被真实销售，所得用于真实的公益行动。", fit:"适合喜欢设计、手工、艺术、小型创业和公益商业的人。", img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
        { title:"公益项目成员", body:"参与暖餐行动、社区文化课程、传统节日outreach、乡村文化振兴宣传、非遗资料整理和虚拟文化遗产重建。你的工作将直接影响到真实的人和真实的社区。", fit:"适合想做 CAS / Service / Leadership，关心公益、社区和文化传承的人。", img:"https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80" },
      ],
    },
    impact: {
      title: "从文字到行动",
      body: "载物不是一个只停留在纸面上的文学项目。我们希望通过内容创作、文化传播、文创义卖和公益项目，让学生的文字、创意和组织能力真正进入社区，支持具体的人和具体的文化行动。每一次活动、每一次义卖、每一篇发布的文章，都是这个承诺的一部分。",
      cards: [
        { title:"暖餐行动", body:"用义卖与筹款支持食物援助和社区关怀。我们相信，文化项目的温度，最终要体现在对真实需求的回应上。", img:"https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=700&q=80" },
        { title:"传统节日 Outreach", body:"把春节、中秋、端午等节日文化带进社区。我们通过活动、展览、体验和内容，让传统节日不只是一个假期，而是一次文化连接的机会。", img:"https://images.unsplash.com/photo-1546502011-7b58bc1a1e47?w=700&q=80" },
        { title:"非遗与文化资料整理", body:"整理传统手工艺、民俗故事与文化资料，建立数字档案。我们与传承人合作，用文字和影像记录正在消失的技艺与记忆。", img:"https://images.unsplash.com/photo-1604238376818-e37db9c5f6e4?w=700&q=80" },
        { title:"虚拟文化遗产重建", body:"用Minecraft、网页或 3D 工具重建历史文化场景。让更多年轻人以数字化的方式接触、体验和保护文化遗产。", img:"https://images.unsplash.com/photo-1614729939124-032d1e6c9945?w=700&q=80" },
      ],
    },
    ecosystem: {
      title: "项目生态",
      center: "载物",
      nodes: ["ZWWX.CLUB 文学论坛","《不合时宜》杂志","新媒体内容","文创义卖","线上捐赠","Ellan.TOP Minecraft","社区文化项目","非遗虚拟重建","暖餐行动"],
      desc: "文学创作进入论坛和杂志；论坛和杂志推动文化传播；新媒体扩大影响力；文创义卖、线上捐赠和服务器收入汇入公益基金；公益基金支持社区文化项目、暖餐行动、节日outreach 和虚拟文化遗产重建。",
    },
    joinUs: {
      title: "加入载物",
      body: "不一定要已经很有经验，但要愿意认真做事。不一定要中文特别强，但要愿意阅读、表达和学习。不一定要已经会设计或技术，但要愿意尝试、愿意把作品做出来。载物欢迎愿意写作、创造、传播和行动的人。\n\n我们是一个学生社群，也是一个真实运作的文化项目。你将不只是参与者，更是建设者。你会和一群认真的人一起做一些值得做的事情。",
      form: "报名表链接", email: "联系邮箱", site: "网站", cta: "报名加入",
    },
    footer: {
      slogan: "让中文从纸面走向社区，让文化从兴趣变成行动。",
      rights: "© 2025 载物 · Ink & Heritage",
      links: [["ZWWX.CLUB","https://zwwx.club"],["ellan.site","https://ellan.site"],["关于我们","#about"],["招新","#recruitment"],["联系","#join-us"]],
    },
  },
  en: {
    langBtn: "中文",
    nav: { about:"About", whatWeDo:"What We Do", recruitment:"Recruitment", impact:"Impact", joinUs:"Join Us", news:"News", donate:"Donate" },
    hero: {
      title: "Ink & Heritage",
      subtitle: "载物",
      tagline: "Chinese Literature × Cultural Communication × Public Welfare",
      body: "Ink & Heritage is a student-led cultural and public-welfare initiative connecting Chinese writing, student publishing, online literary communities, cultural communication, creative charity sales, and community service. We believe Chinese should be more than an exam subject —it should be a living force for expression, heritage, and real-world impact.",
      cta1: "Join Ink & Heritage", cta2: "Explore the Project",
      tags: ["Student Publishing","Cultural Heritage","Community Impact","Chinese Literature"],
      quote: "Carry the weight of culture with virtue",
    },
    about: {
      title: "About Ink & Heritage",
      body: "Inspired by the classical idea of carrying responsibility through culture, Ink & Heritage turns Chinese literature into a platform for expression, collaboration, and public action. Starting from writing and reading, the project expands into student publishing, digital communities, media creation, cultural workshops, creative charity sales, and community service.\n\nInk & Heritage is not just a magazine or a forum. It is an attitude: words can have weight, culture can have warmth, and students are fully capable of turning ideas into real social impact.",
      extra: "Our name draws from the I Ching: 'The earth's posture is receptive —the noble person carries all things with great virtue.' At Ink & Heritage, every article, every event, every cent raised through charity sales is a concrete expression of that spirit.",
      cards: [
        { title:"Writing & Publication", body:"Helping student voices become edited, published, and seen. We provide editorial support to every contributor, ensuring each work is presented at its best." },
        { title:"Cultural Communication", body:"Sharing Chinese culture through websites, magazines, videos, and events. We use multimedia channels to bring culture beyond the classroom and into public spaces." },
        { title:"Public Welfare", body:"Turning cultural creativity into service and community impact. We believe the value of culture lies in its power to change real lives and real communities." },
      ],
    },
    whatWeDo: {
      title: "What We Do",
      cards: [
        {
          title: "ZWWX.CLUB Literary Forum",
          body: "A digital space for student essays, poems, fiction, reading notes, literary reviews, and cultural reflections.",
          extra: "ZWWX.CLUB is Ink & Heritage's core digital platform. Every student author can find their readership here. We maintain a full editorial pipeline —from submission to review to publication. The forum also serves as a discussion space, inspiration library, and collaboration hub, connecting Chinese-language writers across schools and regions.",
          img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
        },
        {
          title: "Buheshiyi Magazine",
          body: "A student-edited magazine featuring creative writing, cultural criticism, social observations, and literary works.",
          extra: "Buheshiyi (不合时宜) means 'untimely' or 'out of step' —because we believe truly valuable ideas often run ahead of their time, or refuse to be absorbed by it. The magazine covers poetry, prose, fiction excerpts, cultural criticism, social observation, and visual art, with each issue built around a specific editorial theme.",
          img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        },
        {
          title: "New Media Creation",
          body: "Creating videos, posters, cultural explainers, event stories, and social media content to make culture visible and engaging.",
          extra: "Our new media team converts written content into video, graphics, Reels, and podcast formats. From classical literature introductions to contemporary Chinese writing features, from event coverage to behind-the-scenes stories —we want every follower to access Chinese culture through the format they know best.",
          img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
        },
        {
          title: "Cultural Events & Creative Charity Sales",
          body: "Organising festival events, calligraphy workshops, reading salons, creative products, and charity sales.",
          extra: "Events are how Ink & Heritage reaches communities most directly. We organise activities around Spring Festival, Mid-Autumn, Dragon Boat, and other cultural occasions —including calligraphy, tea ceremony, and hanfu experiences. Our creative team designs and produces bookmarks, postcards, tote bags, and stickers, all sold to raise funds for our public welfare projects.",
          img: "https://images.unsplash.com/photo-1546502011-7b58bc1a1e47?w=800&q=80",
        },
        {
          title: "Fundraising & Community Projects",
          body: "Raising funds through donations, charity sales, and outreach to support food initiatives, heritage documentation, and cultural education.",
          extra: "Our public welfare arm manages fundraising and project implementation. The Warm Meals Initiative provides food support to community members in need. Our cultural education programme offers Chinese writing mentorship to students in under-resourced areas. Our heritage documentation project collects and digitally preserves disappearing traditional crafts and folk stories.",
          img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
        },
        {
          title: "Developing Student Skills",
          body: "Build real-world competencies in writing, design, video production, web development, event planning, and teamwork through hands-on project work.",
          extra: "Ink & Heritage is not just a platform to showcase work — it is a real training ground. Every article you write, every event you plan, every line of code you ship helps you grow into a more capable person. We believe students can build genuinely valuable experience before graduation.",
          img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        },
      ],
    },
    recruitment: {
      title: "Who We Are Looking For",
      subtitle: "You don't need to be an expert. You need curiosity, commitment, and the willingness to make things real.",
      cards: [
        { title:"Writers & Contributors", body:"Write poems, essays, fiction, reviews, reading notes, and cultural reflections. We welcome all styles and subjects —any piece of writing that is genuinely crafted deserves to be published.", fit:"Best for: Students who love writing, reading, and expressing ideas in Chinese.", img:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80" },
        { title:"Editors, Reviewers & Layout Designers", body:"Review submissions, edit language, plan columns, design themes, and create magazine layouts. You'll go through the complete production pipeline of a real publication.", fit:"Best for: Detail-oriented students interested in publishing, editing, design, or media.", img:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80" },
        { title:"Video & New Media Creators", body:"Create literary videos, event recaps, posters, short-form content, and social media stories. Your work will appear on all of Ink & Heritage's public channels.", fit:"Best for: Students who enjoy visual storytelling, editing, design, and digital communication.", img:"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80" },
        { title:"Web & Technology Members", body:"Maintain the literary forum, improve UI, manage publishing systems, and build submission workflows. This is a real production environment serving real users.", fit:"Best for: Students interested in web development, servers, UI design, and real-world technical projects.", img:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80" },
        { title:"Cultural Event Planners", body:"Plan festival events, calligraphy workshops, reading salons, cultural quizzes, and literary gatherings. You'll manage the full lifecycle from concept to execution.", fit:"Best for: Students who enjoy organising events, communicating with others, and leading projects.", img:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80" },
        { title:"Creative Products & Charity Sales Members", body:"Design bookmarks, postcards, stickers, tote bags, calligraphy works, and charity products. Your designs will be sold and proceeds will fund real community work.", fit:"Best for: Students interested in design, crafts, art, creative entrepreneurship, and charity sales.", img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
        { title:"Public Welfare Project Members", body:"Join food support initiatives, community cultural courses, festival outreach, rural cultural promotion, heritage documentation, and virtual heritage rebuilding. Your work will directly affect real people.", fit:"Best for: Students who care about service, community, heritage, and real-world impact.", img:"https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80" },
      ],
    },
    impact: {
      title: "From Words to Action",
      body: "Ink & Heritage is not only about writing. Through publishing, media, creative charity sales, and public-welfare projects, we turn student creativity into tangible cultural and community impact. Every event, every charity sale, every published article is part of that commitment.",
      cards: [
        { title:"Warm Meals Initiative", body:"Supporting food aid and community care through fundraising and charity sales. We believe the warmth of a cultural project must ultimately show up in how it responds to real human needs.", img:"https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=700&q=80" },
        { title:"Traditional Festival Outreach", body:"Bringing Chinese festival traditions into communities. Through events, exhibitions, and interactive experiences, we make festivals more than holidays —they become cultural connections.", img:"https://images.unsplash.com/photo-1546502011-7b58bc1a1e47?w=700&q=80" },
        { title:"Heritage Documentation", body:"Documenting traditional crafts, folk stories, and cultural memory through text, image, and video. We work with tradition-bearers to preserve what is at risk of being lost.", img:"https://images.unsplash.com/photo-1604238376818-e37db9c5f6e4?w=700&q=80" },
        { title:"Virtual Heritage Rebuild", body:"Rebuilding historical and cultural sites through Minecraft, web experiences, and 3D modelling. We help younger generations engage with cultural heritage in formats they already live in.", img:"https://images.unsplash.com/photo-1614729939124-032d1e6c9945?w=700&q=80" },
      ],
    },
    ecosystem: {
      title: "Project Ecosystem",
      center: "Ink & Heritage",
      nodes: ["ZWWX.CLUB Literary Forum","Buheshiyi Magazine","New Media","Creative Charity Sales","Online Donation","Ellan.TOP Minecraft","Community Culture Projects","Virtual Heritage Rebuild","Warm Meals Initiative"],
      desc: "Creative writing flows into the forum and magazine. The forum and magazine strengthen cultural communication. New media expands reach. Creative charity sales, online donations, and server income contribute to a public-welfare fund. The fund supports community culture projects, warm meals initiatives, festival outreach, and virtual heritage rebuilding.",
    },
    joinUs: {
      title: "Join Ink & Heritage",
      body: "You do not need to be an expert to join. You only need curiosity, responsibility, and the willingness to create something real. Ink & Heritage welcomes students who want to write, design, build, organise, serve, and make culture matter.\n\nWe are a student community and a real operating cultural project. You will not just be a participant —you will be a builder. You will work alongside a group of committed people on things worth doing.",
      form: "Application Form", email: "Contact Email", site: "Website", cta: "Apply to Join",
    },
    footer: {
      slogan: "From words to communities, from heritage to action.",
      rights: "© 2025 Ink & Heritage · 载物",
      links: [["ZWWX.CLUB","https://zwwx.club"],["ellan.site","https://ellan.site"],["About","#about"],["Recruitment","#recruitment"],["Contact","#join-us"]],
    },
  },
};

// ── ZaiwuLogo SVG —使用 ChatGPT 生成的真实Logo 路径 ──────────────────────
const ZaiwuLogo = ({ size = 40, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1254 1254"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "block", ...style }}
  >
    {/* 主体：书页/ 翅膀 */}
    <path d="M0 0 C0.8034082 0.22010742 1.60681641 0.44021484 2.43457031 0.66699219 C6.32791159 1.75656629 10.16305065 2.96119138 13.98095703 4.29589844 C15.44469856 4.80634953 16.91237604 5.30555902 18.38232422 5.79785156 C57.34464685 18.86632582 92.25968708 39.6746447 122 68 C122.898396 68.85537354 122.898396 68.85537354 123.81494141 69.72802734 C156.48191546 101.06303187 178.28622507 142.94831986 189.4375 186.625 C189.68459717 187.58374023 189.93169434 188.54248047 190.1862793 189.53027344 C191.84245346 196.35335671 192.54980617 202.99353516 193 210 C200.26 210 207.52 210 215 210 C215.33 206.7 215.66 203.4 216 200 C225.03609832 143.42164633 257.90764076 88.17578231 303 53 C303.98355469 52.21109375 304.96710937 51.4221875 305.98046875 50.609375 C329.76081968 31.70253732 357.31608204 16.90844884 386 7 C386.63099609 6.78005371 387.26199219 6.56010742 387.91210938 6.33349609 C399.48241794 2.31455354 411.11909113 -1.49553201 423.22265625 -3.50390625 C426.34545981 -4.0617066 429.41321931 -4.7692074 432.5 -5.5 C442.10618587 -7.73844378 451.58497912 -9.25990929 461.39697266 -10.21508789 C465.0974373 -10.57749633 468.78070831 -10.96941832 472.46411133 -11.48309326 C481.95509617 -12.79302357 491.24094167 -13.29792374 500.83203125 -13.265625 C502.28496871 -13.26697854 503.73790573 -13.26892474 505.19084167 -13.27142334 C508.2033631 -13.27433761 511.21576427 -13.27019522 514.22827148 -13.26074219 C518.05841189 -13.24929795 521.88827336 -13.25596199 525.71840382 -13.26788712 C528.70668081 -13.27516285 531.69489314 -13.27279264 534.68317223 -13.26763153 C536.09474408 -13.26631345 537.50632213 -13.26787677 538.91788673 -13.27259064 C561.58279335 -13.33176177 561.58279335 -13.33176177 569 -7 C573.42953164 -1.97188301 574.31106556 0.88621543 574.20703125 7.46875 C573.76805014 12.83591522 571.37640195 15.84586569 567.5 19.3125 C563.67201137 22.51088524 560.68452952 23.1248885 555.74780273 23.08178711 C554.6707457 23.0752562 553.59368866 23.06872528 552.48399353 23.06199646 C550.72654564 23.04484337 550.72654564 23.04484337 548.93359375 23.02734375 C546.41862134 23.01466391 543.90364728 23.00230559 541.38867188 22.99023438 C537.45136304 22.96576098 533.51414182 22.93816401 529.5769043 22.90405273 C511.93503597 22.76089784 494.56636228 23.36192477 477 25 C474.58582915 25.20990053 472.17142928 25.41684594 469.75688171 25.62236023 C448.19614892 27.60341223 426.74753758 31.86057714 406 38 C405.13536133 38.25475098 404.27072266 38.50950195 403.37988281 38.77197266 C376.75870192 46.77438191 350.63204958 58.75971082 328 75 C327.04351563 75.68320312 326.08703125 76.36640625 325.1015625 77.0703125 C308.72732017 89.0608994 293.18700476 102.68929575 281 119 C284.34477588 117.51765614 286.75408784 115.59017314 289.5 113.1875 C356.13729723 57.99655609 447.86269246 44.0523964 531.56298828 43.52722168 C534.21620822 43.5091632 536.86938835 43.48360347 539.52246094 43.45031738 C543.26673855 43.40869071 547.0094314 43.40212209 550.75390625 43.40625 C551.87305923 43.38999573 552.99221222 43.37374146 554.14527893 43.35699463 C560.97553629 43.41662207 565.78951675 44.38581484 571 49 C574.4181567 53.69996547 574.72825971 58.37621669 574 64 C572.17573094 69.27011062 569.42748314 71.83751204 565 75 C562.08980333 75.95945477 559.41204918 76.13303197 556.35961914 76.15771484 C555.43689713 76.16811295 554.51417511 76.17851105 553.56349182 76.18922424 C552.06446571 76.19997231 552.06446571 76.19997231 550.53515625 76.2109375 C548.36913167 76.23664264 546.2031162 76.2631234 544.03710938 76.2902832 C542.89910889 76.30354645 541.7611084 76.31680969 540.58862305 76.33047485 C489.53939441 76.97508491 440.07579091 82.15193811 391 97 C390.10265137 97.26893066 389.20530273 97.53786133 388.28076172 97.81494141 C353.41880122 108.40370333 318.91037809 125.40304398 291 149 C289.81277344 149.91458984 289.81277344 149.91458984 288.6015625 150.84765625 C282.15464704 155.87160388 276.35695712 161.43125573 270.5625 167.1875 C269.78068359 167.96013184 268.99886719 168.73276367 268.19335938 169.52880859 C264.28151936 173.46185329 260.85086562 177.23335268 258 182 C259.12921875 181.09121094 259.12921875 181.09121094 260.28125 180.1640625 C268.79667263 173.40838492 277.69098415 167.59553518 287 162 C287.6595166 161.59813477 288.3190332 161.19626953 288.99853516 160.78222656 C297.83013989 155.40307492 306.83728488 150.41848119 316 145.625 C317.43291382 144.87500732 317.43291382 144.87500732 318.89477539 144.10986328 C324.51722609 141.19910596 330.19318004 138.51922481 336 136 C337.25700317 135.42816527 338.51352264 134.85526595 339.76953125 134.28125 C362.59286342 124.09707652 386.73844559 116.72123551 411 110.875 C411.7716449 110.68882111 412.54328979 110.50264221 413.33831787 110.31082153 C421.34658862 108.3953712 429.35159677 106.66767271 437.49121094 105.39404297 C440.71908118 104.88705751 443.9173437 104.2460724 447.125 103.625 C455.04005839 102.1912759 463.00816874 101.16460154 470.9911499 100.19671631 C473.01050112 99.95140912 475.02896424 99.69882304 477.04736328 99.44580078 C481.69111783 98.88501852 486.34218602 98.42701861 491 98 C491.98916412 97.90859741 492.97832825 97.81719482 493.99746704 97.72302246 C519.15487494 95.51235143 544.32575477 95.76058252 569.55767822 95.8626709 C575.26434816 95.88348801 580.97103706 95.8923396 586.67773438 95.90234375 C597.78520443 95.92350612 608.89259272 95.95743382 620 96 C620.12044678 95.26467041 620.24089355 94.52934082 620.36499023 93.77172852 C620.53200439 92.79647217 620.69901855 91.82121582 620.87109375 90.81640625 C621.11363892 89.37309937 621.11363892 89.37309937 621.36108398 87.90063477 C623.92028422 76.28204173 632.49936394 66.92668349 642.03515625 60.2421875 C650.35540449 54.98207033 658.5429984 52.60880801 668.375 52.6875 C669.11959473 52.69313965 669.86418945 52.6987793 670.63134766 52.70458984 C676.50506537 52.83369659 681.58802096 53.60378706 687 56 C687.88945313 56.39058594 688.77890625 56.78117188 689.6953125 57.18359375 C699.35889871 61.93463265 708.60352768 69.94203267 713 80 C713.60303163 82.39842127 713.8448115 84.51698393 714 87 C714.66 87 715.32 87 716 87 C719.49721313 101.65361204 717.09438531 115.91524335 709.359375 128.71484375 C707.69946425 130.983647 705.95631015 132.9830604 704 135 C703.35546875 135.69480469 702.7109375 136.38960937 702.046875 137.10546875 C692.8419297 146.19109068 680.87544733 150.17719298 668.1875 150.1875 C667.40568359 150.19974609 666.62386719 150.21199219 665.81835938 150.22460938 C652.43006977 150.25816399 642.4214128 143.75084094 632.80078125 134.953125 C631 133 631 133 631 131 C618.07901282 131.08559451 605.15813343 131.18089532 592.23730183 131.28752708 C586.23317429 131.336795 580.22905878 131.38311003 574.22485352 131.421875 C546.09766692 131.60583394 518.06600614 132.0447691 490 134 C488.99618286 134.06988632 487.99236572 134.13977264 486.95812988 134.21177673 C481.27190341 134.621676 475.64749131 135.21658276 470 136 C468.80375 136.16419434 467.6075 136.32838867 466.375 136.49755859 C447.77573132 139.10772667 429.56688902 142.83342042 411.375 147.5 C410.48537567 147.72702606 409.59575134 147.95405212 408.6791687 148.18795776 C387.08051822 153.72413864 387.08051822 153.72413864 366.40234375 161.9375 C362.32838059 163.73931785 358.1251423 165.21553972 353.93310547 166.71875 C349.09659554 168.48489801 344.57367313 170.64357029 340 173 C338.22882813 173.86818359 338.22882813 173.86818359 336.421875 174.75390625 C318.40333913 183.59785528 301.29272495 193.24327749 285 205 C284.28295898 205.51739746 283.56591797 206.03479492 282.82714844 206.56787109 C270.58631504 215.46182226 259.10196646 225.03847221 248 235.3125 C247.37665771 235.88726074 246.75331543 236.46202148 246.11108398 237.05419922 C243.33382358 239.6546529 240.76822513 242.21963951 238.4375 245.23046875 C235.22338775 248.88240078 232.43786765 250.72197089 227.50271606 251.2848053 C224.42630563 251.41369688 221.36427397 251.44192856 218.28515625 251.43359375 C217.15605331 251.4388356 216.02695038 251.44407745 214.8636322 251.44947815 C212.48079245 251.45588864 210.097921 251.45457401 207.71508789 251.44604492 C204.07836301 251.43753711 200.44321042 251.466309 196.80664062 251.49804688 C194.48697964 251.49965913 192.16731588 251.49908088 189.84765625 251.49609375 C188.76517105 251.50732773 187.68268585 251.51856171 186.56739807 251.53013611 C178.50951493 251.45611361 174.11540268 250.07096042 168.26171875 244.30078125 C167.41222656 243.31464844 166.56273437 242.32851562 165.6875 241.3125 C160.79368937 235.77520963 155.61069514 230.81987016 150 226 C149.04867188 225.16082031 148.09734375 224.32164062 147.1171875 223.45703125 C126.36992474 205.32469152 102.93582287 191.27855143 78.66479492 178.42993164 C76.1338687 177.07183408 73.63432352 175.66819092 71.13671875 174.25 C67.97473572 172.48348758 64.88913944 171.07048089 61.4375 169.9375 C58.22545017 168.82989661 55.23554252 167.68155777 52.25 166.0625 C47.90281875 163.78157157 43.286752 162.35663335 38.62988281 160.85791016 C35.0139586 159.68942595 31.49483969 158.42777445 28 156.9375 C23.43995841 155.05939391 18.79389205 153.79259614 14.01953125 152.57226562 C9.86171465 151.50796397 5.75169929 150.34099335 1.64599609 149.09082031 C-5.76212883 146.83551402 -13.10809366 145.04562374 -20.73046875 143.67578125 C-24 143 -24 143 -26.77416992 142.03393555 C-30.14811919 140.95252518 -33.38416401 140.33263891 -36.8828125 139.78125 C-37.52954926 139.67843216 -38.17628601 139.57561432 -38.84262085 139.46968079 C-40.93575729 139.13966545 -43.03010667 138.81866243 -45.125 138.5 C-45.84872803 138.38917084 -46.57245605 138.27834167 -47.31811523 138.16415405 C-88.46430895 131.88853041 -130.02155167 131.67754223 -171.56634521 131.39910889 C-177.39454176 131.35818709 -183.22265412 131.30751144 -189.05078125 131.2578125 C-200.36712722 131.16267262 -211.6835223 131.0777848 -223 131 C-223.29712891 131.62398682 -223.59425781 132.24797363 -223.90039062 132.89086914 C-227.65212792 140.08697449 -235.90182665 143.87380601 -243 147 C-244.04800781 147.53109375 -245.09601563 148.0621875 -246.17578125 148.609375 C-250.7341838 150.54074513 -255.23262642 150.53492027 -260.125 150.5 C-261.5167041 150.49141968 -261.5167041 150.49141968 -262.93652344 150.48266602 C-276.10928566 150.14222829 -285.89632699 145.15524233 -295.15234375 135.83203125 C-306.2551471 123.81950099 -309.77967318 112.46879511 -309.27734375 96.2421875 C-308.61243477 83.65581915 -302.18710031 73.30314569 -293.0859375 64.77734375 C-281.65412375 55.03675338 -269.8213954 51.92752765 -255.03369141 52.78222656 C-240.17438112 54.37340361 -228.5718274 62.6146732 -219.41796875 73.9609375 C-215.14915204 80.07398621 -212 88.53826741 -212 96 C-210.28802933 95.99666908 -210.28802933 95.99666908 -208.54147339 95.99327087 C-197.6878133 95.9728354 -186.8341572 95.95793087 -175.9804821 95.94818783 C-170.40299542 95.94301018 -164.82552449 95.93600777 -159.24804688 95.92456055 C-153.84689305 95.91354693 -148.4457542 95.90768484 -143.04459 95.90512276 C-141.00294891 95.90330128 -138.96130847 95.89974625 -136.91967392 95.89426994 C-116.10593639 95.84075597 -95.45973952 96.71938544 -74.75 98.8125 C-73.86015411 98.90225098 -72.97030823 98.99200195 -72.05349731 99.08447266 C-66.78210421 99.62071565 -61.51325661 100.17761195 -56.24615479 100.75445557 C-54.2900139 100.96829635 -52.3332862 101.17675566 -50.37646484 101.38427734 C-15.05352139 105.31027937 28.36747147 114.28174319 60.0625 131 C63.6439114 132.83947978 67.28777378 134.43695738 71 136 C98.69524882 147.99438512 126.6268628 162.72983955 150 182 C145.67141619 175.8501166 140.83205104 170.48080149 135.5 165.1875 C134.70682373 164.39851318 133.91364746 163.60952637 133.09643555 162.79663086 C126.9676089 156.78364008 120.62477032 151.32722818 113.70214844 146.2578125 C111.95886801 144.96960528 110.24832302 143.64543593 108.5390625 142.3125 C94.64839968 131.61859246 79.19285596 123.33603659 63.4453125 115.71875 C61.06127832 114.52943589 58.82278308 113.32412449 56.54296875 111.96875 C52.90332981 109.85816608 49.1431954 108.40750061 45.1875 107 C43.86802934 106.52210217 42.54902525 106.04291432 41.23046875 105.5625 C40.54903809 105.31516113 39.86760742 105.06782227 39.16552734 104.81298828 C36.83644212 103.93859665 34.5396127 102.99958982 32.23828125 102.0546875 C13.84297825 94.65793177 -5.65121721 90.0973893 -25 86 C-25.75394043 85.83661133 -26.50788086 85.67322266 -27.28466797 85.50488281 C-40.05334583 82.76323666 -53.02229132 81.33899698 -66 80 C-67.28938477 79.86561523 -68.57876953 79.73123047 -69.90722656 79.59277344 C-74.20614278 79.15403116 -78.50791756 78.75392083 -82.8125 78.375 C-83.93552521 78.275858 -83.93552521 78.275858 -85.08123779 78.17471313 C-95.60819208 77.2776101 -106.09187008 76.89197133 -116.65625 76.80078125 C-117.82709641 76.78873657 -118.99794281 76.77669189 -120.20426941 76.76428223 C-126.03215709 76.70957933 -131.85679539 76.69219837 -137.68481445 76.72998047 C-139.83805741 76.72060962 -141.99129691 76.71039453 -144.14453125 76.69921875 C-145.6126123 76.72717278 -145.6126123 76.72717278 -147.11035156 76.75569153 C-154.00514048 76.68082836 -158.10276306 74.89379616 -163 70 C-166.3364862 65.30806628 -166.89658006 60.60110689 -166 55 C-163.72983576 50.45967152 -160.57782177 46.35788709 -156 44 C-151.69510885 43.28153537 -147.44482294 43.37124313 -143.08984375 43.44140625 C-141.81315323 43.44373764 -140.53646271 43.44606903 -139.22108459 43.44847107 C-136.50649446 43.45463551 -133.79272945 43.47726528 -131.07836914 43.51293945 C-127.03184212 43.56584844 -122.98632916 43.57436956 -118.93945312 43.58007812 C-94.7733183 43.68379187 -70.69952965 45.00082531 -46.75 48.3125 C-45.95735748 48.41949219 -45.16471497 48.52648437 -44.34805298 48.63671875 C-25.26620149 51.22032123 -6.4576917 54.51487994 11.91894531 60.36279297 C14.07781813 61.02382747 16.24719539 61.61340975 18.4296875 62.19140625 C57.40439111 72.74434405 96.33358953 93.83197466 127 120 C90.40321715 68.56668356 26.49613328 40.34561347 -33.85668945 29.57641602 C-36.55989626 29.08070563 -39.23703769 28.52222006 -41.921875 27.9375 C-47.95005151 26.72082071 -54.04362956 26.17740339 -60.1628418 25.62231445 C-62.13991505 25.44184364 -64.11588277 25.24938862 -66.09179688 25.05664062 C-82.50308272 23.49878686 -98.92804772 22.88588396 -115.41015625 23.04296875 C-117.09228462 23.05815804 -117.09228462 23.05815804 -118.80839539 23.07365417 C-123.40385299 23.11923451 -127.99894662 23.16963319 -132.59399414 23.24682617 C-136.01195097 23.30115477 -139.42937727 23.33030848 -142.84765625 23.35546875 C-143.88197281 23.37925095 -144.91628937 23.40303314 -145.98194885 23.42753601 C-152.01051148 23.44955583 -155.40975097 23.01606661 -160 19 C-164.53086095 13.83985281 -166.52277291 10.48478146 -166.3828125 3.63671875 C-165.57436882 -1.93164331 -162.41374512 -5.65521806 -158.4375 -9.4375 C-124.50968999 -31.18609616 -36.28318806 -10.03261695 0 0 Z" fill="currentColor" transform="translate(423,791)"/>
    {/* 中央火焰 / 羽笔 */}
    <path d="M0 0 C5.17168751 2.13210967 8.94336645 5.30517069 12 10 C12.42578125 13.3046875 12.42578125 13.3046875 12.3125 16.875 C12.27576172 18.63457031 12.27576172 18.63457031 12.23828125 20.4296875 C12 24 12 24 11.5 27.34375 C9.79713039 39.79598406 10.02628697 52.33803311 15 64 C15.43570313 65.02480469 15.87140625 66.04960937 16.3203125 67.10546875 C19.63169817 74.24394769 23.8732591 80.06703775 29 86 C29.7734375 86.95519531 29.7734375 86.95519531 30.5625 87.9296875 C34.28937462 92.48700701 38.51045913 96.20994244 43 100 C44.08038044 100.92988307 45.15972822 101.86096672 46.23828125 102.79296875 C51.66496749 107.47612899 57.11151042 112.1194726 62.6875 116.625 C67.34510798 120.40588177 71.79323458 124.37508762 76.19921875 128.4453125 C78.38607974 130.44002253 80.59666962 132.38589072 82.8359375 134.3203125 C93.47391702 143.60459504 103.43990412 153.76487416 112 165 C112.721875 165.928125 113.44375 166.85625 114.1875 167.8125 C128.16408261 186.05970508 140.02294492 205.81869535 149 227 C149.44859375 228.05316406 149.8971875 229.10632813 150.359375 230.19140625 C156.06690216 244.0273499 161.65416947 258.52796521 163.609375 273.42578125 C164.02565051 276.16903688 164.71679306 278.71439994 165.5 281.375 C169.45810917 295.57196339 169.34213065 309.77050128 169.31567383 324.40112305 C169.31252809 328.03009509 169.33598582 331.65823841 169.36132812 335.28710938 C169.41582637 354.61279779 167.49819489 372.80783398 162.5625 391.5 C162.27568359 392.63179687 161.98886719 393.76359375 161.69335938 394.9296875 C156.40188215 415.5299151 156.40188215 415.5299151 152.02734375 424.8046875 C151.21597669 426.53848327 150.46073429 428.29853859 149.7265625 430.06640625 C142.04719188 448.04643656 132.30325326 464.5874882 118.953125 478.89453125 C117.35939276 480.61257461 115.88541074 482.34865335 114.4375 484.1875 C111.92187447 487.09014484 109.25889897 489.48432106 106.34765625 491.9765625 C101.45240305 496.19576576 96.71465645 500.58166159 92 505 C91.43974121 505.51949219 90.87948242 506.03898437 90.30224609 506.57421875 C66.01401076 529.24964388 47.85889441 561.10474912 42 594 C41.34 594 40.68 594 40 594 C39.8040625 593.16082031 39.608125 592.32164062 39.40625 591.45703125 C32.04795836 561.86528084 18.37527847 533.99222199 -3 512 C-3.83144531 511.09507812 -4.66289063 510.19015625 -5.51953125 509.2578125 C-11.453335 502.9296266 -17.86613003 497.7316125 -24.875 492.625 C-42.17690074 479.96613688 -53.85527182 465.78642587 -64.2734375 447.09375 C-65.30649292 445.24266428 -66.38222676 443.41307821 -67.5390625 441.63671875 C-69.54572437 438.01506966 -70.739786 434.24598165 -72 430.3125 C-72.26200195 429.50594971 -72.52400391 428.69939941 -72.79394531 427.8684082 C-73.30774751 426.2807722 -73.8186006 424.69217807 -74.32617188 423.10253906 C-74.86669231 421.41595863 -75.42297459 419.73443316 -75.984375 418.0546875 C-79.80286268 406.24854701 -80.40675667 394.13232189 -80.375 381.8125 C-80.37512085 381.08766418 -80.3752417 380.36282837 -80.37536621 379.61602783 C-80.34844572 368.25526556 -79.26087282 357.9031933 -76 347 C-75.66497502 345.66218359 -75.33817516 344.32228116 -75.01953125 342.98046875 C-73.38698788 336.20562251 -71.32240611 329.92242789 -68.265625 323.65234375 C-66.96895732 320.9349445 -65.89489203 318.18388355 -64.8125 315.375 C-59.47933672 302.50184725 -51.64441082 290.86052341 -43 280 C-41.99839844 278.71029297 -41.99839844 278.71029297 -40.9765625 277.39453125 C-33.33125261 267.64902754 -24.88161302 258.68566232 -16.125 249.9375 C-15.25020996 249.06351563 -14.37541992 248.18953125 -13.47412109 247.2890625 C7.88934252 226.12785184 7.88934252 226.12785184 18.5625 225.5625 C25.44061262 225.64306354 30.73273114 228.69062716 35.515625 233.53515625 C39.11393777 238.69189321 38.66410572 244.98942295 38 251 C35.74017996 258.34441513 28.90961288 263.35575949 23.2578125 268.23828125 C12.24444941 277.84154487 1.85518677 288.36878245 -7 300 C-7.7321875 300.91523437 -8.464375 301.83046875 -9.21875 302.7734375 C-15.42787636 310.7049585 -20.27804556 319.12740631 -25 328 C-25.58007812 329.06605469 -26.16015625 330.13210938 -26.7578125 331.23046875 C-30.04165668 337.47637338 -32.32839035 343.68705933 -34.23828125 350.48046875 C-35 353 -35 353 -36 354 C-38.08856336 362.78049088 -38.30654747 371.51837608 -38.25 380.5 C-38.25773438 381.72847656 -38.26546875 382.95695312 -38.2734375 384.22265625 C-38.25018884 395.18440108 -36.90196395 405.48224463 -33.375 415.875 C-33.11702637 416.63748047 -32.85905273 417.39996094 -32.59326172 418.18554688 C-28.4964672 429.75808503 -22.14272129 439.81127696 -14 449 C-13.40960937 449.68449219 -12.81921875 450.36898438 -12.2109375 451.07421875 C-2.89010503 461.168482 8.96205262 467.21626003 22 471 C23.89105469 471.55107422 23.89105469 471.55107422 25.8203125 472.11328125 C30.38767361 473.22584357 34.81830768 473.29508853 39.5 473.25 C40.30308594 473.25773437 41.10617187 473.26546875 41.93359375 473.2734375 C56.63680643 473.22577717 69.7527743 467.15672753 81 458 C81.74636719 457.44054687 82.49273438 456.88109375 83.26171875 456.3046875 C99.78804197 443.07176083 108.82068593 421.3493764 116 402 C116.44214844 400.82179688 116.88429688 399.64359375 117.33984375 398.4296875 C120.71045981 388.94278638 122.79771207 379.39603643 124.54589844 369.49707031 C124.96291347 367.20393603 125.43137165 364.92844806 125.9140625 362.6484375 C128.22292267 350.87508307 128.31974695 339.07933253 128.375 327.125 C128.38285522 326.28560883 128.39071045 325.44621765 128.39880371 324.58139038 C128.47655444 313.90044933 127.62234364 304.39186379 125 294 C124.73627718 292.62696692 124.48670405 291.25100359 124.26171875 289.87109375 C117.27092178 248.06898124 97.42443104 209.71357304 68.61328125 178.859375 C66.80477005 176.88055557 65.08351719 174.91057078 63.390625 172.83984375 C61.48228664 170.5729124 59.69743155 168.69830418 57.4375 166.8125 C54.4688214 164.28465901 51.57271585 161.69802594 48.71582031 159.04418945 C43.61712252 154.309568 38.39843605 149.81174351 32.98046875 145.44140625 C26.86778728 140.43429496 20.93400677 135.21660223 15 130 C14.46246094 129.52852539 13.92492187 129.05705078 13.37109375 128.57128906 C-1.22650559 115.71905486 -14.1557776 100.51060887 -21.1875 82.1875 C-21.5446106 81.26469238 -21.5446106 81.26469238 -21.90893555 80.32324219 C-25.86051825 69.5142161 -27.56108668 58.86251062 -27.5 47.375 C-27.49645508 46.16166992 -27.49291016 44.94833984 -27.48925781 43.69824219 C-27.2494059 30.56200495 -24.92372622 17.38889691 -18 6 C-12.20493931 0.62896814 -7.81366927 -1.13442902 0 0 Z" fill="currentColor" transform="translate(586,346)"/>
    {/* 大墨滴*/}
    <path d="M0 0 C9.25795051 5.72962536 15.06108767 13.2943995 18.21875 23.6875 C20.26454599 33.9554475 18.21210614 44.94516184 12.62890625 53.74609375 C5.86505534 63.00551306 -2.07790256 67.78599381 -13.37109375 69.74609375 C-23.74870263 70.84695265 -31.59714447 68.66702795 -40.05859375 62.62109375 C-49.39364294 54.83913239 -53.36211799 45.85209996 -54.68359375 33.92578125 C-55.14284152 23.85103325 -51.72522391 15.40771879 -45.28125 7.74609375 C-33.08713489 -5.0215687 -15.84280014 -8.37815296 0 0 Z" fill="currentColor" transform="translate(656.37109375,197.25390625)"/>
    {/* 小墨滴*/}
    <path d="M0 0 C5.30121805 4.26402322 8.23437962 9.60851607 9.1484375 16.3203125 C9.49158252 23.47356635 7.20876055 29.56760544 2.41796875 34.94921875 C0.9375 36.25 0.9375 36.25 -2.125 38.3125 C-2.99125 38.910625 -3.8575 39.50875 -4.75 40.125 C-10.82390625 42.26211516 -16.95452407 42.61187538 -22.984375 40.140625 C-29.97606624 36.12764246 -33.87138381 32.13886585 -36.125 24.3125 C-36.96167989 17.21393168 -37.07541847 10.91214005 -32.68359375 5.02734375 C-22.56581538 -6.10474824 -13.20341522 -7.12984422 0 0 Z" fill="currentColor" transform="translate(684.125,311.6875)"/>
  </svg>
);

// ── Ancient SVG decorations ────────────────────────────────────────────────
const CloudPattern = () => (
  <svg className="absolute w-full pointer-events-none" style={{ opacity: 0.07 }} viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 40 Q60 10 120 40 Q150 20 180 40 Q240 10 300 40 Q330 20 360 40 Q420 10 480 40 Q510 20 540 40 Q600 10 660 40 Q690 20 720 40 Q780 10 840 40 Q870 20 900 40 Q960 10 1020 40 Q1050 20 1080 40 Q1140 10 1200 40 Q1230 20 1260 40 Q1320 10 1380 40 Q1410 20 1440 40" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
    <path d="M0 60 Q60 30 120 60 Q150 40 180 60 Q240 30 300 60 Q330 40 360 60 Q420 30 480 60 Q510 40 540 60 Q600 30 660 60 Q690 40 720 60 Q780 30 840 60 Q870 40 900 60 Q960 30 1020 60 Q1050 40 1080 60 Q1140 30 1200 60 Q1230 40 1260 60 Q1320 30 1380 60 Q1410 40 1440 60" stroke="var(--gold)" strokeWidth="0.8" fill="none"/>
  </svg>
);

const CornerDecor = ({ className = "" }) => (
  <svg className={`pointer-events-none ${className}`} width="80" height="80" viewBox="0 0 80 80" fill="none">
    <path d="M4 4 L4 28 M4 4 L28 4" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M76 76 L76 52 M76 76 L52 76" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="4" cy="4" r="2.5" fill="var(--gold)" opacity="0.7"/>
    <circle cx="76" cy="76" r="2.5" fill="var(--gold)" opacity="0.7"/>
    <path d="M14 4 Q20 10 14 20 Q8 10 14 4Z" fill="var(--gold)" opacity="0.18"/>
  </svg>
);

const DiamondDivider = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="ink-line flex-1" />
    <svg width="16" height="16" viewBox="0 0 16 16"><rect x="6" y="1" width="9" height="9" rx="1" transform="rotate(45 8 8)" fill="var(--gold)" opacity="0.7"/></svg>
    <div className="ink-line flex-1" />
  </div>
);

// ── useReveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Icon maps ──────────────────────────────────────────────────────────────
const recruitIcons = [PenTool, Newspaper, Video, Code2, CalendarDays, Gift, HandHeart];
const whatIcons = [Globe2, BookOpen, Video, CalendarDays, HeartHandshake];
const impactIcons = [HandHeart, Sparkles, BookOpen, Globe2];

// ── ExpandCard ─────────────────────────────────────────────────────────────
function ExpandCard({ children, className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card-clickable ${className}`} onClick={() => setOpen(o => !o)}>
      {children(open)}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, img, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed", inset: 0,
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
            background: "rgba(4,10,24,0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.90, y: 32, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.90, y: 32, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              borderRadius: "24px",
              overflow: "hidden",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
            }}
          >
            {img && (
              <div style={{ position: "relative", height: "220px", flexShrink: 0, overflow: "hidden" }}>
                <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg2))" }} />
                <CornerDecor className="absolute top-3 left-3 w-10 h-10 opacity-60" />
              </div>
            )}
            <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text)", lineHeight: 1.3 }}>{title}</h3>
                <button
                  onClick={onClose}
                  style={{
                    flexShrink: 0, cursor: "pointer", border: "1px solid var(--border2)",
                    background: "var(--surface)", borderRadius: "12px", padding: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text3)",
                  }}>
                  <X size={16} />
                </button>
              </div>
              <DiamondDivider />
              <div style={{ marginTop: "16px", fontSize: "14px", lineHeight: 1.85, color: "var(--text2)" }}>{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ lang, setLang, t, dark, setDark, page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { href:"#about", label:t.nav.about },
    { href:"#join-us", label:t.nav.joinUs },
  ];
  const isSubPage = page !== "home";
  const navStyle = scrolled
    ? { background: "var(--nav-bg)", borderBottom: "1px solid var(--border2)", boxShadow: "var(--shadow)" }
    : { background: "transparent" };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4"
      style={navStyle}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" onClick={(e) => { if (isSubPage) { e.preventDefault(); setPage("home"); } }} className="flex items-center gap-2.5">
          <ZaiwuLogo size={38} style={{ color: "var(--accent)" }} />
          <div>
            <span className="font-black text-base tracking-wide" style={{ color: "var(--text)" }}>
              {lang === "zh" ? "载物" : "Ink & Heritage"}
            </span>
            <span className="block text-[10px] tracking-[0.15em]" style={{ color: "var(--text3)" }}>
              {lang === "zh" ? "Ink & Heritage" : "载物"}
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.href} href={isSubPage ? "#" : l.href}
              onClick={() => { if (isSubPage) setPage("home"); }}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "var(--text2)" }}>
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setPage("news"); setOpen(false); }}
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: page === "news" ? "var(--accent)" : "var(--text2)" }}>
            {t.nav.news}
          </button>
          {SHOW_DONATE && (
          <button
            onClick={() => { setPage("donate"); setOpen(false); }}
            className="btn-primary px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
            ❤️ {t.nav.donate}
          </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(d => !d)}
            className="btn-glass p-2 rounded-xl"
            style={{ color: "var(--accent2)" }}
            aria-label="Toggle dark mode">
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
          <button
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="btn-glass flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ color: "var(--accent2)" }}>
            <Languages size={14} />{t.langBtn}
          </button>
          <button className="md:hidden btn-glass p-2 rounded-xl"
            style={{ color: "var(--text2)" }}
            onClick={() => setOpen(!open)}>
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            className="md:hidden glass mx-4 mt-2 rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "var(--nav-bg)", border: "1px solid var(--border2)" }}>
            {links.map(l => (
              <a key={l.href} href={isSubPage ? "#" : l.href}
                onClick={() => { if (isSubPage) setPage("home"); setOpen(false); }}
                className="text-sm font-medium py-2 px-3 rounded-xl transition-all hover:opacity-70"
                style={{ color: "var(--text2)" }}>
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setPage("news"); setOpen(false); }}
              className="text-sm font-medium py-2 px-3 rounded-xl text-left transition-all hover:opacity-70"
              style={{ color: page === "news" ? "var(--accent)" : "var(--text2)" }}>
              {t.nav.news}
            </button>
            {SHOW_DONATE && (
            <button
              onClick={() => { setPage("donate"); setOpen(false); }}
              className="btn-primary py-2 px-3 rounded-xl text-sm font-bold text-left flex items-center gap-1.5">
              ❤️ {t.nav.donate}
            </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Count-up number animation ───────────────────────────────────────────
function CountUpNumber({ target, duration = 2500, delay = 0, decimals = 0, className = "", style = {} }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let tid, raf;
    tid = setTimeout(() => {
      if (target === 0) { setDisplay(0); return; }
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        // easeOutExpo
        const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        const v = parseFloat((e * target).toFixed(decimals));
        setDisplay(v);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setDisplay(target);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, [target]);
  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {decimals > 0 ? display.toFixed(decimals) : display}
    </span>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero({ lang, t }) {
  const [currency, setCurrency] = useState("CNY");
  const [stats, setStats] = useState(() => loadStats());

  // 实时拉取 ZWWX 帖子总数（不含回复）
  useEffect(() => {
    const API_URL = import.meta.env.VITE_NEWS_API_URL || "https://zwwx.club/zaiwu-api.php";
    fetch(`${API_URL}?action=count`)
      .then(r => r.json())
      .then(json => {
        if (typeof json.count === 'number') {
          setStats(prev => ({ ...prev, articlesCount: json.count }));
        }
      })
      .catch(() => {}); // 静默失败，保留默认值 0
  }, []);

  // 实时计时器：每秒刷新
  const calcElapsed = () => {
    const ms = Math.max(0, Date.now() - new Date(stats.startDate).getTime());
    const totalSec = Math.floor(ms / 1000);
    return {
      days:    Math.floor(totalSec / 86400),
      hours:   Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
    };
  };
  const [elapsed, setElapsed] = useState(calcElapsed);
  useEffect(() => {
    const id = setInterval(() => setElapsed(calcElapsed()), 1000);
    return () => clearInterval(id);
  }, []);

  const displayAmount = (() => {
    const base = stats.donationCNY;
    if (currency === "SGD") return (base * stats.rates.SGD).toFixed(2);
    if (currency === "USD") return (base * stats.rates.USD).toFixed(2);
    return base.toFixed(0);
  })();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--bg) 0%, var(--bg2) 60%, #0f2050 100%)" }} />

      {/* Blobs */}
      <div className="blob absolute top-[-8%] left-[-4%] w-[500px] h-[500px]" style={{ background: "var(--blob1)" }} />
      <div className="blob absolute top-[25%] right-[-6%] w-96 h-96" style={{ background: "var(--blob2)", animationDelay:"3s" }} />
      <div className="blob absolute bottom-0 left-[25%] w-80 h-80" style={{ background: "var(--blob3)", animationDelay:"6s" }} />

      {/* BG image */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=70')",
        backgroundSize:"cover", backgroundPosition:"center",
      }} />

      {/* Ancient cloud top/bottom */}
      <div className="absolute top-0 left-0 right-0"><CloudPattern /></div>
      <div className="absolute bottom-0 left-0 right-0 rotate-180"><CloudPattern /></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, ease:[0.22,1,0.36,1] }} className="space-y-7">
          <div className="flex items-center gap-4">
            <ZaiwuLogo size={52} style={{ color: "var(--accent)" }} />
            <div className="flex flex-col gap-1">
              <span className="section-label">{t.hero.tagline}</span>
              <div className="ink-line w-48" />
            </div>
          </div>

          <div className="relative ancient-border p-2">
            <CornerDecor className="absolute -top-2 -left-2 w-8 h-8" />
            <CornerDecor className="absolute -bottom-2 -right-2 w-8 h-8 rotate-180" />
            <h1 className="text-7xl md:text-8xl font-black text-gradient tracking-tight leading-[1.08] md:leading-[1.05] pb-1">
              {t.hero.title}
            </h1>
            <p className="mt-1 text-xl font-light tracking-[0.2em]" style={{ color:"var(--text3)" }}>
              {t.hero.subtitle}
            </p>
          </div>

          <p className="text-sm leading-[1.9] max-w-lg" style={{ color:"var(--text2)" }}>{t.hero.body}</p>

          {/* Quote */}
          <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 w-fit">
            <Quote size={14} style={{ color:"var(--gold)", flexShrink:0 }} />
            <span className="text-sm italic" style={{ color:"var(--gold)" }}>{t.hero.quote}</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a href="#join-us">
              <button className="btn-primary px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2">
                {t.hero.cta1} <ArrowRight size={16}/>
              </button>
            </a>
            <a href="#about">
              <button className="btn-glass px-7 py-3.5 rounded-2xl font-bold text-sm" style={{ color:"var(--accent2)" }}>
                {t.hero.cta2}
              </button>
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            {t.hero.tags.map(tag => (
              <span key={tag} className="glass px-3.5 py-1.5 rounded-full text-xs font-semibold" style={{ color:"var(--text2)" }}>{tag}</span>
            ))}
          </div>

          {/* 手机端完整数据面板 —— 桌面端隐藏 */}
          <div className="lg:hidden space-y-3">
            {/* 运行时间 */}
            <div className="glass-card rounded-3xl px-5 py-4">
              <p className="section-label mb-3">{lang==="zh" ? "项目已运行" : "Running Time"}</p>
              <div className="flex items-baseline gap-3 flex-wrap">
                {[
                  { val: elapsed.days,    label: lang==="zh" ? "天"  : "days" },
                  { val: elapsed.hours,   label: lang==="zh" ? "时"  : "hr"   },
                  { val: elapsed.minutes, label: lang==="zh" ? "分"  : "min"  },
                  { val: elapsed.seconds, label: lang==="zh" ? "秒"  : "sec"  },
                ].map(({ val, label }, idx) => (
                  <span key={label} className="flex items-baseline gap-1">
                    {idx > 0 && <span className="text-sm font-light" style={{color:"var(--border2)"}}>·</span>}
                    <span className="text-3xl font-black text-gradient leading-none">{String(val).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold" style={{color:"var(--text3)"}}>{label}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs mt-2" style={{color:"var(--text3)"}}>
                {lang==="zh" ? "自2026年4月20日起" : "Since April 20, 2026"}
              </p>
            </div>

            {/* 累计捐助 */}
            {SHOW_DONATE && (
            <div className="glass-card rounded-3xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="section-label">{lang==="zh" ? "累计捐助" : "Total Raised"}</p>
                <div className="flex gap-1.5">
                  {["CNY","SGD","USD"].map(c => (
                    <button key={c} onClick={() => setCurrency(c)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200"
                      style={{
                        background: currency===c ? "var(--accent)" : "var(--surface2)",
                        color: currency===c ? "#fff" : "var(--text3)",
                        border: "1px solid var(--border)",
                      }}>{c}</button>
                  ))}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={currency}
                  initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}
                  transition={{duration:0.18}} className="flex items-end gap-2">
                  <CountUpNumber
                    target={parseFloat(displayAmount)} duration={1800} delay={0}
                    decimals={currency === "CNY" ? 0 : 2}
                    className="text-5xl font-black text-gold leading-none"
                  />
                  <span className="text-base font-semibold mb-1" style={{color:"var(--text3)"}}>{currency}</span>
                </motion.div>
              </AnimatePresence>
              <p className="text-xs mt-1" style={{color:"var(--text3)"}}>
                {lang==="zh" ? "文创义卖 · 在线捐赠" : "Charity Sales · Online Donation"}
              </p>
            </div>
            )}

            {/* 2×2 数字格 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: stats.peopleHelped,    labelZh:"帮助人数",  labelEn:"People Helped", color:"var(--accent2)" },
                { value: stats.volunteersCount, labelZh:"志愿者",    labelEn:"Volunteers",    color:"var(--gold)" },
                { value: stats.articlesCount,   labelZh:"发布文章",  labelEn:"Articles",      color:"var(--accent2)" },
                { value: stats.productsCount,   labelZh:"义卖产品",  labelEn:"Products",      color:"var(--gold)" },
              ].map(({value, labelZh, labelEn, color}, i) => (
                <div key={i} className="glass-card rounded-2xl p-4">
                  <CountUpNumber target={value} duration={2000} delay={400} className="text-3xl font-black leading-none" style={{color}} />
                  <p className="text-xs mt-1.5" style={{color:"var(--text3)"}}>
                    {lang==="zh" ? labelZh : labelEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right —Stats Panel */}
        <motion.div
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:0.9, delay:0.15, ease:[0.22,1,0.36,1] }}
          className="hidden lg:flex flex-col gap-4"
        >
          {/* Days running — realtime ticker */}
          <div className="glass-card rounded-3xl p-7 relative overflow-hidden ancient-border">
            <CornerDecor className="absolute top-2 left-2 w-7 h-7"/>
            <CornerDecor className="absolute bottom-2 right-2 w-7 h-7 rotate-180"/>
            <p className="section-label mb-4">{lang==="zh" ? "项目已运行" : "Running Time"}</p>
            {/* 天：大字 */}
            <div className="flex items-end gap-2 mb-4">
              <CountUpNumber target={elapsed.days} duration={2500} delay={200} className="text-7xl font-black text-gradient leading-none" />
              <span className="text-2xl font-semibold mb-2" style={{color:"var(--text3)"}}>
                {lang==="zh" ? " 天" : " days"}
              </span>
            </div>
            {/* 时 / 分 / 秒：行内 */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {[
                { val: elapsed.hours,   label: lang==="zh" ? "时" : "hr"  },
                { val: elapsed.minutes, label: lang==="zh" ? "分" : "min" },
                { val: elapsed.seconds, label: lang==="zh" ? "秒" : "sec" },
              ].map(({ val, label }, idx) => (
                <span key={label} className="flex items-baseline gap-1">
                  {idx > 0 && <span className="text-sm font-light" style={{color:"var(--border2)"}}>·</span>}
                  <span className="text-2xl font-black text-gradient leading-none">{String(val).padStart(2, "0")}</span>
                  <span className="text-sm font-semibold" style={{color:"var(--text3)"}}>{label}</span>
                </span>
              ))}
            </div>
            <p className="text-xs mt-3" style={{color:"var(--text3)"}}>
              {lang==="zh" ? "自2026年4月20日起" : "Since April 20, 2026"}
            </p>
          </div>

          {/* Donation + currency switcher */}
          {SHOW_DONATE && (
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">{lang==="zh" ? "累计捐助" : "Total Raised"}</p>
              <div className="flex gap-1.5">
                {["CNY","SGD","USD"].map(c => (
                  <button key={c}
                    onClick={() => setCurrency(c)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200"
                    style={{
                      background: currency===c ? "var(--accent)" : "var(--surface2)",
                      color: currency===c ? "#fff" : "var(--text3)",
                      border: "1px solid var(--border)",
                    }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={currency}
                initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}
                transition={{duration:0.18}}
                className="flex items-end gap-2"
              >
                <CountUpNumber
                  target={parseFloat(displayAmount)}
                  duration={1800}
                  delay={0}
                  decimals={currency === "CNY" ? 0 : 2}
                  className="text-5xl font-black text-gold leading-none"
                />
                <span className="text-base font-semibold mb-1" style={{color:"var(--text3)"}}>{currency}</span>
              </motion.div>
            </AnimatePresence>
            <p className="text-xs mt-2" style={{color:"var(--text3)"}}>
              {lang==="zh" ? "文创义卖 · 在线捐赠" : "Charity Sales · Online Donation"}
            </p>
          </div>
          )}

          {/* 2×2 stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: stats.peopleHelped,    labelZh:"帮助人数",  labelEn:"People Helped", color:"var(--accent2)" },
              { value: stats.volunteersCount, labelZh:"志愿者",    labelEn:"Volunteers",    color:"var(--gold)" },
              { value: stats.articlesCount,   labelZh:"发布文章",  labelEn:"Articles",      color:"var(--accent2)" },
              { value: stats.productsCount,   labelZh:"义卖产品",  labelEn:"Products",      color:"var(--gold)" },
            ].map(({value, labelZh, labelEn, color}, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <CountUpNumber target={value} duration={2000} delay={400} className="text-3xl font-black leading-none" style={{color}} />
                <p className="text-xs mt-1.5" style={{color:"var(--text3)"}}>
                  {lang==="zh" ? labelZh : labelEn}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ opacity:0.35 }}>
        <div className="w-px h-10" style={{ background:"linear-gradient(to bottom, transparent, var(--accent2))" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--accent2)" }} />
      </motion.div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────
function About({ t }) {
  const ref = useReveal();
  const icons = [PenTool, Globe2, HeartHandshake];
  const [modal, setModal] = useState(false);

  return (
    <section id="about" className="py-28 scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, var(--bg) 0%, var(--bg2) 100%)" }} />
      <div className="blob absolute right-0 top-0 w-80 h-80" style={{ background:"var(--blob2)", animationDelay:"2s" }} />
      <div className="absolute bottom-0 left-0 right-0"><CloudPattern /></div>

      <div ref={ref} className="section-reveal relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images stacked */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden glass-card h-[420px]">
              <img src="https://images.unsplash.com/photo-1546198632-9ef6368bef12?w=800&q=85" alt="Books and culture" className="w-full h-full object-cover img-reveal" style={{ opacity:0.75 }} />
              <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, var(--accent)/20 0%, transparent)" }} />
              <CornerDecor className="absolute top-4 left-4 w-10 h-10" />
            </div>
            {/* Small secondary image */}
            <div className="absolute -bottom-8 -right-6 rounded-2xl overflow-hidden glass-card w-44 h-44 shadow-2xl border-2" style={{ borderColor:"var(--border)" }}>
              <img src="https://images.unsplash.com/photo-1555116505-38ab61800975?w=400&q=80" alt="Calligraphy" className="w-full h-full object-cover img-reveal" style={{ opacity:0.80 }} />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-7">
            <div>
              <div className="section-label mb-3">About · 关于</div>
              <h2 className="text-4xl font-black leading-[1.12] pb-1" style={{ color:"var(--text)" }}>{t.about.title}</h2>
              <div className="ink-line mt-4 w-24" />
            </div>
            <div className="space-y-4 text-sm leading-[1.95]" style={{ color:"var(--text2)" }}>
              {t.about.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* Expandable extra */}
            <ExpandCard className="glass-card rounded-2xl p-4">
              {open => (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold" style={{ color:"var(--gold)" }}>
                      {open ? (t === T.zh ? "收起" : "Show less") : (t === T.zh ? "展开更多" : "Read more")}
                    </span>
                    {open ? <ChevronUp size={14} style={{ color:"var(--gold)" }}/> : <ChevronDown size={14} style={{ color:"var(--gold)" }}/>}
                  </div>
                  <AnimatePresence>
                    {open && (
                      <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                        className="text-xs leading-relaxed mt-3" style={{ color:"var(--text3)" }}>
                        {t.about.extra}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              )}
            </ExpandCard>

            <div className="grid gap-4">
              {t.about.cards.map((card, i) => {
                const Icon = icons[i];
                return (
                  <motion.div key={i} initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                    className="glass-card rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{ background:"linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)" }}>
                      <Icon size={18} color="#fff"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1" style={{ color:"var(--text)" }}>{card.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color:"var(--text2)" }}>{card.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WhatWeDo ───────────────────────────────────────────────────────────────
function WhatWeDo({ t }) {
  const ref = useReveal();
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section id="what-we-do" className="py-28 scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)" }} />
      <div className="blob absolute left-[-8%] bottom-0 w-96 h-96" style={{ background:"var(--blob3)", animationDelay:"1s" }} />
      <div className="absolute top-0 left-0 right-0"><CloudPattern /></div>

      <div ref={ref} className="section-reveal relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label mb-3 justify-center">What We Do · 项目内容</div>
          <h2 className="text-4xl font-black leading-[1.12] pb-1" style={{ color:"var(--text)" }}>{t.whatWeDo.title}</h2>
          <div className="ink-line mt-4 w-32 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whatWeDo.cards.map((card, i) => {
            const Icon = whatIcons[i] || BookOpen;
            return (
              <motion.div key={i}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.1, duration:0.6, ease:[0.22,1,0.36,1] }}
                className="glass-card rounded-3xl overflow-hidden cursor-pointer group"
                onClick={() => setActiveModal(i)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover img-reveal" style={{ opacity:0.75 }} />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 40%, var(--bg2))" }} />
                </div>
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                    style={{ background:"linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)" }}>
                    <Icon size={20} color="#fff"/>
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color:"var(--text)" }}>{card.title}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color:"var(--text2)" }}>{card.body}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color:"var(--gold)" }}>
                    <span>{t === T.zh ? "了解更多" : "Learn more"}</span>
                    <ArrowRight size={12}/>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {t.whatWeDo.cards.map((card, i) => (
          <Modal key={i} open={activeModal === i} onClose={() => setActiveModal(null)} title={card.title} img={card.img}>
            <p className="mb-3">{card.body}</p>
            <DiamondDivider />
            <p className="mt-3">{card.extra}</p>
          </Modal>
        ))}
      </div>
    </section>
  );
}

// ── Recruitment ─────────────────────────────────────────────────────────────
function Recruitment({ t }) {
  const ref = useReveal();
  const [activeModal, setActiveModal] = useState(null);
  const cards = t.recruitment.cards;
  // 将卡片复制三份，确保屏幕宽度下始终填满
  const tripled = [...cards, ...cards, ...cards];

  return (
    <section id="recruitment" className="py-28 scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, var(--bg) 0%, var(--bg2) 100%)" }} />
      <div className="blob absolute right-[-5%] top-[20%] w-80 h-80" style={{ background:"var(--blob1)", animationDelay:"3.5s" }} />

      <div ref={ref} className="section-reveal relative z-10">
        <div className="text-center mb-4 px-6">
          <div className="section-label mb-3 justify-center">Recruitment · 招新</div>
          <h2 className="text-4xl font-black leading-[1.12] pb-1" style={{ color:"var(--text)" }}>{t.recruitment.title}</h2>
        </div>
        <p className="text-center text-sm mb-12 px-6" style={{ color:"var(--text3)" }}>{t.recruitment.subtitle}</p>

        {/* 横向无限滚动展示 */}
        <div className="relative overflow-hidden" style={{ paddingBlock:"4px" }}>
          {/* 左渐隐 */}
          <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background:"linear-gradient(to right, var(--bg2) 0%, transparent 100%)" }} />
          {/* 右渐隐 */}
          <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background:"linear-gradient(to left, var(--bg2) 0%, transparent 100%)" }} />

          <div className="marquee-track">
            {tripled.map((card, i) => {
              const Icon = recruitIcons[i % cards.length] || Users;
              return (
                <div
                  key={i}
                  className="glass-card rounded-3xl overflow-hidden cursor-pointer flex-shrink-0"
                  style={{ width: 268 }}
                  onClick={() => setActiveModal(i % cards.length)}
                >
                  <div className="relative overflow-hidden" style={{ height:120 }}>
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover" style={{ opacity:0.65, transition:"transform 0.5s ease", transform:"scale(1)" }}
                      onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"}
                      onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}
                    />
                    <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 20%, var(--bg2))" }} />
                    <div className="absolute bottom-3 left-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md"
                        style={{ background:"linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)" }}>
                        <Icon size={16} color="#fff"/>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-sm mb-2 leading-snug" style={{ color:"var(--text)" }}>{card.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color:"var(--text2)", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{card.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {cards.map((card, i) => (
          <Modal key={i} open={activeModal === i} onClose={() => setActiveModal(null)} title={card.title} img={card.img}>
            <p className="mb-3">{card.body}</p>
            <DiamondDivider />
            <p className="mt-3 font-semibold" style={{ color:"var(--accent2)" }}>{card.fit}</p>
          </Modal>
        ))}
      </div>
    </section>
  );
}

// ── Impact ─────────────────────────────────────────────────────────────────
function Impact({ t }) {
  const ref = useReveal();
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section id="impact" className="py-28 scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"var(--dark-section)" }} />
      <div className="blob absolute top-[-10%] right-[10%] w-96 h-96" style={{ background:"rgba(30,60,160,0.35)", animationDelay:"0s" }} />
      <div className="blob absolute bottom-[-10%] left-[5%] w-80 h-80" style={{ background:"rgba(20,50,120,0.30)", animationDelay:"4s" }} />
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage:"url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=70')",
        backgroundSize:"cover", backgroundPosition:"center",
      }} />
      <div className="absolute top-0 left-0 right-0"><CloudPattern /></div>

      <div ref={ref} className="section-reveal relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label mb-3 justify-center" style={{ "--gold":"#d4af37" }}>Impact · 公益影响</div>
          <h2 className="text-4xl font-black text-white leading-[1.12] pb-1">{t.impact.title}</h2>
          <div className="ink-line mt-4 w-32 mx-auto" />
          <p className="mt-6 text-sm leading-relaxed max-w-2xl mx-auto" style={{ color:"rgba(180,200,240,0.75)" }}>{t.impact.body}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.impact.cards.map((card, i) => {
            const Icon = impactIcons[i];
            return (
              <motion.div key={i}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.1, duration:0.6 }}
                className="rounded-3xl overflow-hidden glass-dark cursor-pointer group"
                onClick={() => setActiveModal(i)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover img-reveal" style={{ opacity:0.60 }} />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 30%, rgba(10,25,55,0.92))" }} />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center"
                    style={{ background:"rgba(255,255,255,0.10)" }}>
                    <Icon size={18} color="#93c5fd"/>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-base mb-2">{card.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color:"rgba(180,200,240,0.70)" }}>{card.body}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color:"var(--gold2)" }}>
                    <span>{t === T.zh ? "了解更多" : "Learn more"}</span>
                    <ArrowRight size={11}/>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {t.impact.cards.map((card, i) => (
          <Modal key={i} open={activeModal === i} onClose={() => setActiveModal(null)} title={card.title} img={card.img}>
            <p>{card.body}</p>
          </Modal>
        ))}
      </div>
    </section>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────────
// Gallery removed
function _Gallery({ lang }) {
  const ref = useReveal();
  const imgs = [
    { src:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", label: lang==="zh" ? "书法艺术" : "Calligraphy" },
    { src:"https://images.unsplash.com/photo-1546198632-9ef6368bef12?w=600&q=80", label: lang==="zh" ? "文学阅读" : "Reading" },
    { src:"https://images.unsplash.com/photo-1555116505-38ab61800975?w=600&q=80", label: lang==="zh" ? "文化传承" : "Heritage" },
    { src:"https://images.unsplash.com/photo-1604238376818-e37db9c5f6e4?w=600&q=80", label: lang==="zh" ? "传统技艺" : "Crafts" },
    { src:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80", label: lang==="zh" ? "社区活动" : "Events" },
    { src:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80", label: lang==="zh" ? "杂志出版" : "Publishing" },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, var(--bg2) 0%, var(--bg) 100%)" }} />

      <div ref={ref} className="section-reveal relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label mb-3 justify-center">Gallery · 图库</div>
          <h2 className="text-3xl font-black" style={{ color:"var(--text)" }}>
            {lang==="zh" ? "用影像记录载物" : "Moments of Ink & Heritage"}
          </h2>
          <div className="ink-line mt-3 w-24 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imgs.map((img, i) => (
            <motion.div key={i}
              initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ delay:i*0.08, duration:0.5 }}
              className="relative rounded-2xl overflow-hidden glass-card group cursor-pointer"
              style={{ height: i === 0 || i === 5 ? "280px" : "200px" }}
            >
              <img src={img.src} alt={img.label} className="w-full h-full object-cover img-reveal" style={{ opacity:0.82 }} />
              <div className="absolute inset-0 transition-opacity" style={{ background:"linear-gradient(to top, var(--bg)/80 0%, transparent 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">{img.label}</span>
              </div>
              <CornerDecor className="absolute top-2 left-2 w-7 h-7 opacity-50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Ecosystem removed
function _Ecosystem({ t }) {
  const ref = useReveal();

  return (
    <section id="ecosystem" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)" }} />
      <div className="absolute top-0 left-0 right-0"><CloudPattern /></div>
      <div className="absolute bottom-0 left-0 right-0 rotate-180"><CloudPattern /></div>

      <div ref={ref} className="section-reveal relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label mb-3 justify-center">Ecosystem · 生态</div>
          <h2 className="text-4xl font-black leading-[1.12] pb-1" style={{ color:"var(--text)" }}>{t.ecosystem.title}</h2>
          <div className="ink-line mt-4 w-32 mx-auto" />
        </div>

        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale:0.8, opacity:0 }} whileInView={{ scale:1, opacity:1 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}
            className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-2xl relative"
            style={{ background:"linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)" }}
          >
            <CornerDecor className="absolute top-1 left-1 w-8 h-8 opacity-40" />
            <div className="text-center px-2">
              <BookOpen size={26} color="#fff" className="mx-auto mb-1"/>
              <p className="text-white font-black text-sm leading-tight">{t.ecosystem.center}</p>
            </div>
          </motion.div>

          {/* Connection lines hint */}
          <div className="w-0.5 h-8 opacity-30" style={{ background:"var(--gold)" }} />

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            {t.ecosystem.nodes.map((node, i) => (
              <motion.div key={i}
                initial={{ opacity:0, scale:0.88 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                transition={{ delay:i*0.07, duration:0.5 }}
                className="eco-node px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{ color:"var(--text)" }}>
                {node}
              </motion.div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 max-w-3xl text-center mt-2 relative">
            <CornerDecor className="absolute top-3 left-3 w-8 h-8" />
            <CornerDecor className="absolute bottom-3 right-3 w-8 h-8 rotate-180" />
            <p className="text-sm leading-relaxed" style={{ color:"var(--text2)" }}>{t.ecosystem.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── JoinUs ─────────────────────────────────────────────────────────────────
function JoinUs({ t }) {
  const ref = useReveal();

  return (
    <section id="join-us" className="py-28 scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)" }} />
      <div className="blob absolute top-0 left-[20%] w-96 h-96" style={{ background:"var(--blob1)", animationDelay:"2s" }} />
      <div className="blob absolute bottom-0 right-[10%] w-80 h-80" style={{ background:"var(--blob2)", animationDelay:"5s" }} />

      <div ref={ref} className="section-reveal relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="section-label mb-3 justify-center">Join Us · 加入</div>
        <h2 className="text-4xl font-black leading-[1.12] pb-1 mb-4" style={{ color:"var(--text)" }}>{t.joinUs.title}</h2>
        <div className="ink-line w-24 mx-auto mb-8" />

        <div className="space-y-3 text-sm leading-[1.9] mb-12" style={{ color:"var(--text2)" }}>
          {t.joinUs.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="glass-card rounded-3xl p-10 space-y-6 relative">
          <CornerDecor className="absolute top-3 left-3 w-8 h-8" />
          <CornerDecor className="absolute bottom-3 right-3 w-8 h-8 rotate-180" />

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {[
              { Icon: Mail, label: t.joinUs.email, val: "hahatt0902@gmail.com", href:"mailto:hahatt0902@gmail.com" },
              { Icon: Globe2, label: t.joinUs.site, val: "zwwx.club", href:"https://zwwx.club" },
            ].map(({ Icon, label, val, href }, i) => (
              <div key={i} className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
                <Icon size={16} style={{ color:"var(--accent2)", flexShrink:0 }} />
                <div className="text-left overflow-hidden">
                  <p className="text-xs mb-0.5" style={{ color:"var(--text3)" }}>{label}</p>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    className="font-semibold text-xs hover:opacity-70 transition-opacity truncate block" style={{ color:"var(--text)" }}>{val}</a>
                </div>
              </div>
            ))}
          </div>

          <a href="https://forms.gle/iDswCLdtiVMYMbpHA" target="_blank" rel="noreferrer">
            <button className="btn-primary w-full md:w-auto px-12 py-4 rounded-2xl font-black text-base flex items-center gap-2 mx-auto">
              {t.joinUs.cta} <ArrowRight size={18}/>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── DonatePage ─────────────────────────────────────────────────────────────
function DonatePage({ lang, onGoHome }) {
  const isZh = lang === "zh";
  const fadeUp = { hidden: { opacity:0, y:30 }, show: { opacity:1, y:0 } };
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }}
      className="min-h-screen relative overflow-hidden"
      style={{ background:"linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)" }}>
      <div className="blob absolute top-[-8%] left-[-4%] w-[400px] h-[400px]" style={{ background:"var(--blob1)" }} />
      <div className="blob absolute bottom-0 right-[-6%] w-96 h-96" style={{ background:"var(--blob2)", animationDelay:"3s" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <motion.button onClick={onGoHome}
          initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.35 }}
          className="flex items-center gap-2 text-sm font-medium mb-10 hover:opacity-70 transition-opacity"
          style={{ color:"var(--text3)" }}>
          <ArrowRight size={14} style={{ transform:"rotate(180deg)" }} />
          {isZh ? "返回首页" : "Back to Home"}
        </motion.button>

        {/* Header */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          transition={{ duration:0.5, delay:0.1 }}
          className="text-center mb-12">
          <div className="section-label mb-3 justify-center">Donate · 捐款</div>
          <h1 className="text-4xl font-black leading-[1.12] pb-1 mb-4" style={{ color:"var(--text)" }}>
            {isZh ? "支持载物" : "Support Ink & Heritage"}
          </h1>
          <div className="ink-line w-24 mx-auto mb-6" />
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color:"var(--text2)" }}>
            {isZh
              ? "你的每一分支持都将直接用于暖食计划、文化活动、遗产保护与社区项目。感谢你让这一切成为可能。"
              : "Every contribution goes directly to our Warm Meals Initiative, cultural events, heritage preservation, and community projects. Thank you for making this possible."}
          </p>
        </motion.div>

        {/* QR Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Alipay */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration:0.5, delay:0.25 }}
            whileHover={{ y:-6, boxShadow:"0 20px 40px rgba(22,119,255,0.18)" }}
            className="glass-card rounded-3xl overflow-hidden cursor-default">
            <div className="px-6 pt-6 pb-2 flex items-center gap-3">
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", delay:0.4, stiffness:260, damping:18 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
                style={{ background:"#1677FF" }}>支</motion.div>
              <div>
                <p className="font-bold text-sm" style={{ color:"var(--text)" }}>
                  {isZh ? "支付宝" : "Alipay"}
                </p>
                <p className="text-xs" style={{ color:"var(--text3)" }}>
                  {isZh ? "打开支付宝扫一扫" : "Open Alipay and scan"}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-3">
              <motion.div
                initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.45, delay:0.45 }}
                className="rounded-2xl overflow-hidden bg-white p-3">
                <img src="/qr-alipay.jpg" alt="Alipay QR" className="w-full h-auto block" />
              </motion.div>
            </div>
          </motion.div>

          {/* WeChat Pay */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration:0.5, delay:0.35 }}
            whileHover={{ y:-6, boxShadow:"0 20px 40px rgba(7,193,96,0.18)" }}
            className="glass-card rounded-3xl overflow-hidden cursor-default">
            <div className="px-6 pt-6 pb-2 flex items-center gap-3">
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", delay:0.5, stiffness:260, damping:18 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
                style={{ background:"#07C160" }}>微</motion.div>
              <div>
                <p className="font-bold text-sm" style={{ color:"var(--text)" }}>
                  {isZh ? "微信支付" : "WeChat Pay"}
                </p>
                <p className="text-xs" style={{ color:"var(--text3)" }}>
                  {isZh ? "打开微信扫一扫" : "Open WeChat and scan"}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-3">
              <motion.div
                initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.45, delay:0.55 }}
                className="rounded-2xl overflow-hidden bg-white p-3">
                <img src="/qr-wechat.jpg" alt="WeChat Pay QR" className="w-full h-auto block" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:0.6 }} transition={{ duration:0.6, delay:0.65 }}
          className="text-center text-xs mt-8" style={{ color:"var(--text3)" }}>
          {isZh
            ? "如有任何问题请联系 hahatt0902@gmail.com"
            : "For any questions, contact hahatt0902@gmail.com"}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer({ t, lang }) {
  return (
    <footer className="relative overflow-hidden py-14">
      <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, #050e20 0%, #071228 100%)" }} />
      <div className="blob absolute top-0 right-0 w-80 h-40" style={{ background:"rgba(26,58,124,0.30)", animationDelay:"1s" }} />
      <div className="absolute top-0 left-0 right-0"><CloudPattern /></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ZaiwuLogo size={42} style={{ color: "rgba(180,210,255,0.75)" }} />
              <div>
                <p className="font-black text-white text-lg">{lang === "zh" ? "载物" : "Ink & Heritage"}</p>
                <p className="text-xs tracking-[0.15em]" style={{ color:"rgba(150,180,230,0.55)" }}>{lang === "zh" ? "Ink & Heritage" : "载物"}</p>
              </div>
            </div>
            <p className="text-sm italic max-w-xs" style={{ color:"rgba(150,180,230,0.60)" }}>{t.footer.slogan}</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {t.footer.links.map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                className="text-sm transition-opacity hover:opacity-60" style={{ color:"rgba(150,180,230,0.65)" }}>
                {label}
              </a>
            ))}
          </div>

          <div className="text-right space-y-1">
            <div className="ink-line w-40 ml-auto" />
            <p className="text-xs" style={{ color:"rgba(150,180,230,0.40)" }}>{t.footer.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Dark mode helper ──────────────────────────────────────────────────────
function useDarkMode() {
  const prefersDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDarkState] = useState(prefersDark);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("force-dark");
      root.classList.remove("force-light");
    } else {
      root.classList.add("force-light");
      root.classList.remove("force-dark");
    }
  }, [dark]);

  return [dark, setDarkState];
}

export default function App() {
  const [lang, setLang] = useState(detectLang);
  const [dark, setDark] = useDarkMode();
  const [page, setPage] = useState(() => {
    if (window.location.pathname === "/donate" || window.location.hash === "#donate") return "donate";
    return "home";
  }); // "home" | "news" | "donate"
  const t = T[lang];

  return (
    <div style={{ minHeight:"100vh" }}>
      <Navbar lang={lang} setLang={setLang} t={t} dark={dark} setDark={setDark} page={page} setPage={setPage} />
      {page === "donate" ? (
        <DonatePage lang={lang} onGoHome={() => setPage("home")} />
      ) : page === "news" ? (
        <NewsRoot lang={lang} onGoHome={() => setPage("home")} />
      ) : (
        <>
          <main>
            <Hero lang={lang} t={t} />
            <About t={t} />
            <WhatWeDo t={t} />
            <Recruitment t={t} />
            <Impact t={t} />
            <JoinUs t={t} />
          </main>
          <Footer t={t} lang={lang} />
        </>
      )}
    </div>
  );
}

