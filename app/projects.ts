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
  cardDescription?: string;
  category: string;
  year: string;
  theme: ProjectTheme;
  cover: CaseStudyArtifact;
  externalUrl?: string;
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
    number: "03",
    slug: "artifacts",
    title: "Artifacts",
    description: "Making the jump from chat to editable work.",
    cardDescription: "Creating content from chats",
    category: "Product design · Glean",
    year: "2025",
    theme: "ground",
    cover: {
      src: "/work/glean-artifacts.png",
      alt: "Glean artifact showing a generated customer success document beside its source conversation",
      caption: "From generated response to editable work",
      kind: "screen",
    },
  },
  {
    number: "04",
    slug: "growth",
    title: "Growth",
    description: "Helping people find value, then come back.",
    cardDescription: "How do you make Glean a habit?",
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
    number: "01",
    slug: "homepage",
    title: "Homepage redesign",
    description: "Making Glean easier to start.",
    cardDescription: "Updating the Glean homepage after 4 years",
    category: "Product design · Glean",
    year: "2025",
    theme: "archive",
    cover: {
      src: "/work/glean-homepage-redesign.png",
      alt: "Redesigned Glean homepage with a unified composer and suggested task",
      caption: "A focused starting point",
      kind: "screen",
    },
  },
  {
    number: "02",
    slug: "psychic",
    title: "Proactive intelligence",
    description: "Offering a useful next step before people ask.",
    cardDescription: "Doing work before someone has to ask",
    category: "Product concept · Glean",
    year: "2026",
    theme: "afterimage",
    cover: {
      src: "/work/work-02.png",
      alt: "Placeholder for the proactive intelligence project",
      caption: "Proactive intelligence placeholder",
      kind: "screen",
    },
  },
  {
    number: "05",
    slug: "soft-launch",
    title: "Treasure",
    description: "A playful way to discover digital collectibles in Snap AR.",
    cardDescription: "An AR experience to visualize your NFTs",
    category: "Product design · Snap",
    year: "2022",
    theme: "systems",
    cover: {
      src: "/work/snap-treasure.png",
      alt: "Treasure augmented reality shopping experience on Snapchat",
      caption: "Treasure",
      kind: "screen",
    },
  },
  {
    number: "06",
    slug: "pocket-studio",
    title: "NFTs as Lenses",
    description: "Turning digital collectibles into Snapchat Lenses.",
    cardDescription: "Bringing NFT ownership to Snapchat",
    category: "Product design · Snap",
    year: "2022",
    theme: "field",
    externalUrl: "https://techcrunch.com/2022/07/13/snap-eyes-adding-nfts-as-ar-filters-in-snapchat/",
    cover: {
      src: "/work/snap-nfts-as-lenses.png",
      alt: "NFT collectible shown as an augmented reality Lens in Snapchat",
      caption: "NFTs as Lenses",
      kind: "screen",
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
    lede: "A debugging experience for people who build agents.",
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
    lede: "Making the jump from chat to editable work.",
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
    lede: "Helping people find value, then come back.",
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
    lede: "Making Glean easier to start.",
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
    lede: "Offering a useful next step before people ask.",
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
    lede: "Making setup, connectors, and actions easier to manage.",
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

// Homepage reading order and media layouts. Dimensions scale from a 1145px canvas.
export const psychicPopups = {
  src: "/work/psychic-popups-shadow.png",
  alt: "Proactive drafts for Google Docs, Slack, and email",
} as const;

export const growthChecklist = {
  src: "/work/growth-checklist.png",
  alt: "Glean getting-started checklist with completed and suggested onboarding tasks",
} as const;

export const growthOnboardingScreens = [
  { src: "/work/growth-welcome.png", alt: "Welcome to Glean onboarding screen" },
  { src: "/work/growth-extension.png", alt: "Start every tab with Glean extension onboarding screen" },
  { src: "/work/growth-bookmark.png", alt: "Bookmark Glean onboarding screen" },
] as const;

export const growthVideoAlternative = {
  src: "/work/growth-alternate.mp4",
  poster: "/work/growth-alternate-poster.jpg",
} as const;

export const featuredWork = [
  { slug: "psychic", video: { src: "/work/psychic-updated.mp4", poster: "/work/psychic-updated-poster.jpg" }, navTitle: "Proactive intelligence", title: "Proactive Intelligence", year: "2026", company: "Glean", layout: "split", summary: "How do you help someone before they ask? As lead designer, I explored how Glean could anticipate people’s needs and turn proactive intelligence into a feeling of relief." },
  { slug: "homepage", video: { src: "/work/homepage-final.mp4", poster: "/work/homepage-final-poster.jpg" }, navTitle: "Homepage redesign", title: "Redesigning the Glean homepage", year: "2026", company: "Glean", layout: "split", summary: "I led design and product strategy for a redesign of the Glean homepage to match its growing AI capabilities. We moved from a traditional intranet-style homepage to a starting point that helped people move work forward and close more loops." },
  { slug: "artifacts", navTitle: "Artifacts", title: "Artifacts", year: "2026", company: "Glean", layout: "split", summary: "I led design for Artifacts from its early launch through its growth to nearly 200K weekly active users. I helped shape how people create, edit, and share work with AI.",
    panels: [
      { kind: "document", src: "/work/artifacts/document.png", alt: "Glean chat alongside an editable document artifact", width: 2704, height: 1680 },
      { kind: "edit", src: "/work/artifacts/edit-with-ai.png", alt: "Describe your edit toolbar with AI editing and formatting controls", width: 1400, height: 216 },
      { kind: "skins", src: "/work/artifacts/app-skins.png", alt: "Artifact drafts styled for Slack, Outlook, and Gmail", width: 1335, height: 784 },
    ],
  },
  { slug: "growth", video: { src: "/work/growth-main.mp4", poster: "/work/growth-main-poster.jpg" }, navTitle: "Growth", title: "Growth", year: "2025", company: "Glean", layout: "trio", summary: "I led Growth design during a period when Glean scaled from 25K to more than 1M weekly active users. My work focused on helping new users experience Glean’s value and build reasons to return." },
  {
    slug: "snap",
    navTitle: "Web3 at Snap",
    title: "Web3 at Snapchat",
    year: "2022",
    company: "Snap",
    layout: "pair",
    media: {
      groups: [
        {
          label: "Treasure",
          images: [
            { src: "/work/snap/treasure-ar.png", alt: "Treasure augmented reality artwork in a room" },
            { src: "/work/snap/treasure-collection.png", alt: "Treasure NFT collection profile" },
            { src: "/work/snap/treasure-feed.png", alt: "Treasure feed with a collectible sneaker" },
          ],
        },
        {
          label: "NFTs as lenses",
          images: [{ src: "/work/snap/nft-lens.png", alt: "NFT used as a Snapchat Lens" }],
        },
      ],
    },
    summary: "At Snapchat, I spent my time on two projects: Treasure, a consumer app that used Snap’s AR kit to let people bring their NFT collections into the real world, and a feature to bring NFTs as lenses inside the core Snapchat app",
    summaryLink: {
      label: "TechCrunch article",
      href: "https://techcrunch.com/2022/07/13/snap-eyes-adding-nfts-as-ar-filters-in-snapchat/",
    },
  },
] as const;
