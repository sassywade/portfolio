export type ProjectTheme =
  | "signal"
  | "field"
  | "archive"
  | "ground"
  | "systems"
  | "afterimage";

export type CaseStudyArtifact = {
  src: string;
  alt: string;
  caption: string;
  kind?: "screen" | "brief";
};

export type Project = {
  number: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  year: string;
  theme: ProjectTheme;
  cover: CaseStudyArtifact;
};

export type CaseStudySection = {
  id: string;
  label: string;
  title: string;
  body: string;
  artifact?: CaseStudyArtifact;
  page?: number;
};

export type CaseStudy = {
  lede: string;
  role: string;
  team: string[];
  collaborator: string;
  sourcePdf: string;
  sourceLabel: string;
  artifacts: CaseStudyArtifact[];
  sections: CaseStudySection[];
  reflection: string;
};

const briefPages = (slug: string, title: string, count: number): CaseStudyArtifact[] =>
  Array.from({ length: count }, (_, index) => ({
    src: `/case-studies/${slug}/page-${String(index + 1).padStart(2, "0")}.png`,
    alt: `${title} brief, page ${index + 1}`,
    caption: `Brief page ${String(index + 1).padStart(2, "0")}`,
    kind: "brief" as const,
  }));

export const projects: Project[] = [
  {
    number: "01",
    slug: "agent-observability",
    title: "Agent observability",
    description: "Making agent behavior understandable.",
    category: "Product design · Glean",
    year: "2025",
    theme: "signal",
    cover: {
      src: "/case-studies/agent-observability/page-01.png",
      alt: "Agent observability case study brief cover",
      caption: "Making agent behavior understandable",
      kind: "brief",
    },
  },
  {
    number: "02",
    slug: "artifacts",
    title: "Artifacts",
    description: "From zero to nearly 200K weekly active users.",
    category: "Product design · Glean",
    year: "2025",
    theme: "ground",
    cover: {
      src: "/work/work-04.png",
      alt: "Glean Edit with AI toolbar",
      caption: "From generated response to editable work",
      kind: "screen",
    },
  },
  {
    number: "03",
    slug: "growth",
    title: "Growth",
    description: "Helping users move from trying Glean to returning to it.",
    category: "Growth product design · Glean",
    year: "2025",
    theme: "field",
    cover: {
      src: "/work/work-03.png",
      alt: "Glean onboarding experience",
      caption: "Helping users reach value faster",
      kind: "screen",
    },
  },
  {
    number: "04",
    slug: "homepage",
    title: "Homepage redesign",
    description: "Simplifying the front door to Glean.",
    category: "Product design · Glean",
    year: "2025",
    theme: "archive",
    cover: {
      src: "/work/work-01.png",
      alt: "Glean homepage with personalized cards and composer",
      caption: "A focused starting point",
      kind: "screen",
    },
  },
  {
    number: "05",
    slug: "psychic",
    title: "Psychic",
    description: "Designing relief before the work begins.",
    category: "Product concept · Glean",
    year: "2026",
    theme: "afterimage",
    cover: {
      src: "/case-studies/psychic/page-01.png",
      alt: "Psychic case study brief cover",
      caption: "Designing relief before the work begins",
      kind: "brief",
    },
  },
  {
    number: "06",
    slug: "workspace-admin-console-actions",
    title: "Workspace admin",
    description: "Designing the admin experience for setup, connectors, and actions.",
    category: "Product design · Glean",
    year: "2025",
    theme: "systems",
    cover: {
      src: "/case-studies/workspace-admin-console-actions/page-01.png",
      alt: "Workspace admin case study brief cover",
      caption: "Getting Glean ready for work",
      kind: "brief",
    },
  },
];

const agentBrief = briefPages("agent-observability", "Agent observability", 3);
const artifactsBrief = briefPages("artifacts", "Artifacts", 4);
const growthBrief = briefPages("growth", "Growth", 4);
const homepageBrief = briefPages("homepage", "Homepage redesign", 4);
const psychicBrief = briefPages("psychic", "Psychic", 3);
const workspaceBrief = briefPages("workspace-admin-console-actions", "Workspace admin", 4);

export const caseStudies: Record<string, CaseStudy> = {
  "agent-observability": {
    lede: "A debugging experience built into how creators build agents.",
    role: "Product design, interaction, prototyping",
    team: ["Seema Jethani, Product", "Neil Dhruva, Product", "Megha Jhunjhunwala, Engineering", "Yuxing Zhou, Engineering", "Andy Welfle, Content Design"],
    collaborator: "Glean · April-June 2025",
    sourcePdf: "/case-studies/agent-observability/brief.pdf",
    sourceLabel: "Open the Agent Observability brief",
    artifacts: agentBrief,
    sections: [
      {
        id: "problem",
        label: "The problem",
        title: "Agents were a black box.",
        body: "Creators could build an agent but had no reliable way to see why it behaved the way it did. When a run went wrong, the failure was buried in backend traces meant for engineers, not builders.",
        page: 0,
      },
      {
        id: "trace-view",
        label: "The trace view",
        title: "A trace view for steps, not latency.",
        body: "I designed a step-by-step input and output view that shows the agent's behavior in sequence. Each step carries its own execution detail so creators can reason about what happened without leaving the builder.",
        page: 1,
      },
      {
        id: "preview",
        label: "Inside preview",
        title: "Debugging inside preview, not a separate trace URL.",
        body: "The revised design moved debugging information directly into preview mode. Creators could test, inspect, search, and fix in the same place, with language and affordances that worked for both technical and non-technical audiences.",
        page: 1,
      },
      {
        id: "impact",
        label: "The impact",
        title: "A clearer path from failure to fix.",
        body: "Debug mode reached GA for task-based agents across customer environments, with conversational-agent debugging following as tracing expanded across multiple runs of a single conversation.",
        page: 2,
      },
    ],
    reflection: "The strongest part of the work was choosing a mental model creators could understand immediately: a sequence of steps, each close enough to inspect and fix.",
  },
  artifacts: {
    lede: "From zero to nearly 200K weekly active users.",
    role: "Product design, Canvas and Artifacts",
    team: ["Zane Homsi, Product Manager", "Ihsaan Patel, Engineering", "Mingtao Chen, Engineering", "Neel Saswade, Designer"],
    collaborator: "Glean · six-month product arc",
    sourcePdf: "/case-studies/artifacts/brief.pdf",
    sourceLabel: "Open the Artifacts brief",
    artifacts: artifactsBrief,
    sections: [
      {
        id: "core-experience",
        label: "The core experience",
        title: "From generated response to editable work.",
        body: "Artifacts was expanding from a new Canvas experience into a broader way to create and shape work in Glean. The work tightened the transition from chat into Canvas, keeping context while giving the result a place to grow.",
        artifact: { src: "/work/work-04.png", alt: "Glean contextual Edit with AI toolbar", caption: "Edit where the intent happens", kind: "screen" },
      },
      {
        id: "edit-with-ai",
        label: "Edit with AI",
        title: "Edit where the intent happens.",
        body: "A contextual toolbar brought AI actions directly to selected content. Custom prompts became the main path, while secondary formatting stayed close without competing with the work itself.",
        page: 1,
      },
      {
        id: "diff-and-queue",
        label: "Review and apply",
        title: "Make every change legible.",
        body: "Diff view made AI edits reviewable in context. Queue Mode let users mark up several sections before asking Assistant to revise the document, then apply the result in one coherent pass.",
        page: 2,
      },
      {
        id: "impact",
        label: "The impact",
        title: "A system that made more kinds of work possible.",
        body: "Canvas reached nearly 200K weekly active users within six months. The work also supported sharing, audio artifacts, autosave, streaming feedback, and the launch details that made the editor dependable during everyday use.",
        page: 3,
      },
    ],
    reflection: "The product became more valuable as the loop got tighter: select, describe the change, review it, and keep working in place.",
  },
  growth: {
    lede: "Helping users move from trying Glean to returning to it.",
    role: "Growth product design",
    team: ["Arpit Agrawal, Product Manager", "Ben McMahan, Engineering", "Sarah Di, Engineering", "Edward Hwang, Engineering", "Neel Saswade, Designer"],
    collaborator: "Glean · 25K to 1M+ WAU",
    sourcePdf: "/case-studies/growth/brief.pdf",
    sourceLabel: "Open the Growth brief",
    artifacts: growthBrief,
    sections: [
      {
        id: "onboarding",
        label: "Chat-first onboarding",
        title: "Help people reach value faster.",
        body: "I helped move onboarding from a search-first flow toward guided Chat, persona-based queries, follow-up actions, and Starter Kit content. The design focused on making the first useful moment easier to find.",
        artifact: { src: "/work/work-03.png", alt: "Glean onboarding search experience", caption: "A clearer first question", kind: "screen" },
      },
      {
        id: "keep-it",
        label: "The Keep It page",
        title: "Design the reason to return.",
        body: "The Keep It redesign clarified the value of staying installed and made the next action easier to understand. Keep rate improved by about 9.09 percentage points.",
        page: 1,
      },
      {
        id: "starter-kit",
        label: "Starter Kit",
        title: "Teach Glean through work.",
        body: "The Starter Kit used short tasks to help users find information, use Chat, discover expertise, and create something useful. Completion became a strong directional signal for Week 2 and longer-term retention.",
        page: 1,
      },
      {
        id: "system",
        label: "The broader system",
        title: "Make value visible at every return visit.",
        body: "The broader Growth system included extension adoption, social proof, lifecycle email, homepage Chat discovery, artifact sharing, proactive cards, and activation dashboards. Glean grew from 25K to more than 1M weekly active users during this period.",
        page: 2,
      },
    ],
    reflection: "The strongest Growth concepts began with a user action. Placement, hierarchy, and timing often mattered more than adding more copy.",
  },
  homepage: {
    lede: "Simplifying the front door to Glean.",
    role: "Product design, interaction, prototyping",
    team: ["Arpit Agrawal, Product Manager", "Ben McMahan, Engineering", "Sarah Di, Engineering", "Edward Hwang, Engineering", "Neel Saswade, Designer"],
    collaborator: "Glean · Homepage redesign",
    sourcePdf: "/case-studies/homepage/brief.pdf",
    sourceLabel: "Open the Homepage brief",
    artifacts: homepageBrief,
    sections: [
      {
        id: "old-homepage",
        label: "The old homepage",
        title: "The widget grid had become the starting point.",
        body: "The previous homepage had accumulated widgets for calendar, announcements, feed activity, shortcuts, collections, and other destinations. Each surface had a reason to exist, but together they weakened the main path into Glean.",
        page: 1,
      },
      {
        id: "new-homepage",
        label: "The new direction",
        title: "One clear place to start.",
        body: "The redesign replaced the widget grid with a unified composer, personalized cards, and a dedicated Company Corner. Core destinations stayed available through the product, while the homepage became easier to scan and act on.",
        artifact: { src: "/work/work-01.png", alt: "Glean homepage with a personalized composer and cards", caption: "The redesigned homepage", kind: "screen" },
      },
      {
        id: "impact",
        label: "The impact",
        title: "A calmer front door increased meaningful action.",
        body: "The redesign increased chat sessions by 1.44 per user, combined sessions by 0.59 per user, and new-user activation by 1.3%.",
        page: 2,
      },
    ],
    reflection: "The homepage got better when it stopped trying to be a map of the whole product and started acting like a useful first step.",
  },
  psychic: {
    lede: "Designing relief before the work begins.",
    role: "Product design, proactive intelligence",
    team: ["Product, Engineering, Content", "Cross-functional design partners", "Neel Saswade, Designer"],
    collaborator: "Glean · concept study · 2026",
    sourcePdf: "/case-studies/psychic/brief.pdf",
    sourceLabel: "Open the Psychic brief",
    artifacts: psychicBrief,
    sections: [
      {
        id: "overview",
        label: "Overview",
        title: "A small amount of useful momentum.",
        body: "Psychic was built to help people discover what Glean could do for them. Early versions surfaced tasks that were broad, ambiguous, and easy to miss; the design shifted toward a proactive work experience grounded in context, clear outcomes, and user control.",
        page: 0,
      },
      {
        id: "question",
        label: "The question",
        title: "How can coming back to work in Glean feel lighter?",
        body: "A suggestion had to feel timely, specific, and connected to real work. It also had to leave the user feeling in control, offering a useful next move without pretending to know everything.",
        page: 1,
      },
      {
        id: "moment",
        label: "The moment before",
        title: "Design for the conditions around a task.",
        body: "I started with signals around a task: a meeting later that day, a recent conversation, an unfinished document, or a teammate waiting for a response. These signals gave Psychic a chance to offer help at the moment it mattered.",
        page: 2,
      },
    ],
    reflection: "The work was less about deciding which task to show and more about designing the feeling of arriving in Glean with a useful next move already waiting.",
  },
  "workspace-admin-console-actions": {
    lede: "Designing the admin experience for setup, connectors, and actions.",
    role: "Product design, Workspace and Admin Console",
    team: ["Debby Shephard, Product Manager", "Yiming Jen, Engineering", "Vinke Xu, Engineering", "Hans Bala, Engineering", "Neel Saswade, Designer"],
    collaborator: "Glean · Workspace / Admin",
    sourcePdf: "/case-studies/workspace-admin-console-actions/brief.pdf",
    sourceLabel: "Open the Workspace Admin brief",
    artifacts: workspaceBrief,
    sections: [
      {
        id: "overview",
        label: "Overview",
        title: "Make a company ready to use Glean.",
        body: "I was the sole designer across Workspace, the Admin Console, and the Tools and Actions team. The work covered setting up the workspace, connecting data sources, configuring permissions, managing connectors, and preparing the systems people would use every day.",
        page: 0,
      },
      {
        id: "admin-journey",
        label: "The admin journey",
        title: "Bring setup, governance, and action creation into one path.",
        body: "The admin work had spread across different surfaces and teams. The goal was to make the path from initial setup to ongoing management easier to understand, from connectors and permissions through apps, actions, and workflows.",
        page: 1,
      },
      {
        id: "understanding-admin",
        label: "Understanding the admin",
        title: "Design for the people responsible for the system.",
        body: "I studied the people responsible for setting up and managing Glean, then used their recurring questions and handoffs to shape a more legible experience for the work that happens before employees can use the product.",
        page: 2,
      },
      {
        id: "outcome",
        label: "The outcome",
        title: "A clearer foundation for everything that follows.",
        body: "The resulting direction treats setup as an ongoing product experience rather than a one-time checklist. It gives admins clearer ownership, better context, and a more coherent path through the system.",
        page: 3,
      },
    ],
    reflection: "The best admin experiences make complexity feel organized without hiding it. Clarity is what lets a system scale beyond the person who first configured it.",
  },
};
