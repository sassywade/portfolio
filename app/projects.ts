export type ProjectTheme =
  | "signal"
  | "field"
  | "archive"
  | "ground"
  | "systems"
  | "afterimage";

export type Project = {
  number: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  year: string;
  theme: ProjectTheme;
};

export type CaseStudySection = {
  id: string;
  label: string;
  title: string;
  body: string;
  visual: "research" | "system" | "prototype" | "gallery";
};

export type CaseStudy = {
  lede: string;
  role: string;
  team: string[];
  collaborator: string;
  sections: CaseStudySection[];
  reflection: string;
};

export const projects: Project[] = [
  {
    number: "01",
    slug: "signal-noise",
    title: "Homepage redesign",
    description: "A calmer way to make sense of a busy product.",
    category: "Product design",
    year: "2025",
    theme: "signal",
  },
  {
    number: "02",
    slug: "field-notes",
    title: "Proactive Intelligence",
    description: "A visual identity for people who make things slowly.",
    category: "Brand + direction",
    year: "2024",
    theme: "field",
  },
  {
    number: "03",
    slug: "the-archive",
    title: "Growth",
    description: "Turning a collection of stories into a place to wander.",
    category: "Digital experience",
    year: "2024",
    theme: "archive",
  },
  {
    number: "04",
    slug: "common-ground",
    title: "Artifacts",
    description: "Tools for making space around the important conversations.",
    category: "Product design",
    year: "2023",
    theme: "ground",
  },
  {
    number: "05",
    slug: "soft-systems",
    title: "Agent observability",
    description: "A flexible toolkit for a distinctly human service.",
    category: "Strategy + design",
    year: "2023",
    theme: "systems",
  },
  {
    number: "06",
    slug: "afterimage",
    title: "Enterprise setup",
    description: "A small study in memory, motion, and the everyday.",
    category: "Experiments",
    year: "2022",
    theme: "afterimage",
  },
  {
    number: "07",
    slug: "ambient-search",
    title: "Editing artifacts",
    description: "Placeholder case study for a quieter search experience.",
    category: "Concept placeholder",
    year: "2026",
    theme: "archive",
  },
  {
    number: "08",
    slug: "side-streets",
    title: "Company vision",
    description: "Placeholder case study about navigating the city differently.",
    category: "Concept placeholder",
    year: "2026",
    theme: "field",
  },
  {
    number: "09",
    slug: "tiny-rituals",
    title: "Starter kit",
    description: "Placeholder case study for small, repeatable moments.",
    category: "Concept placeholder",
    year: "2026",
    theme: "ground",
  },
  {
    number: "10",
    slug: "slow-signal",
    title: "Self serve setup",
    description: "Placeholder case study for patient, proactive software.",
    category: "Concept placeholder",
    year: "2026",
    theme: "signal",
  },
  {
    number: "11",
    slug: "field-guide",
    title: "Insights",
    description: "Placeholder case study for an adaptable creative toolkit.",
    category: "Concept placeholder",
    year: "2026",
    theme: "systems",
  },
  {
    number: "12",
    slug: "good-neighbor",
    title: "Diff review",
    description: "Placeholder case study for a more useful local network.",
    category: "Concept placeholder",
    year: "2026",
    theme: "afterimage",
  },
  {
    number: "13",
    slug: "after-hours",
    title: "Podcast",
    description: "Placeholder case study for ideas made after work.",
    category: "Concept placeholder",
    year: "2026",
    theme: "afterimage",
  },
  {
    number: "14",
    slug: "home-ground",
    title: "Actions platform",
    description: "Placeholder case study about belonging and place.",
    category: "Concept placeholder",
    year: "2026",
    theme: "ground",
  },
  {
    number: "15",
    slug: "soft-launch",
    title: "Treasure",
    description: "Placeholder case study for thoughtful product beginnings.",
    category: "Concept placeholder",
    year: "2026",
    theme: "systems",
  },
  {
    number: "16",
    slug: "pocket-studio",
    title: "NFTs as Lenses",
    description: "Placeholder case study for making wherever you are.",
    category: "Concept placeholder",
    year: "2026",
    theme: "field",
  },
];

export const placeholderCaseStudy: CaseStudy = {
  lede: "A placeholder story for work that is still taking shape.",
  role: "Product design, interaction, prototyping",
  team: ["1 designer", "Creative collaborators", "In progress"],
  collaborator: "Concept placeholder",
  sections: [
    {
      id: "context",
      label: "Context",
      title: "The real project story will live here.",
      body: "This temporary section holds the pacing and structure of the case study until the final context, constraints, and outcomes are ready.",
      visual: "research",
    },
    {
      id: "direction",
      label: "Direction",
      title: "A flexible frame for decisions and iterations.",
      body: "The layout is ready for process work, prototypes, and the design decisions that connect the problem to the final direction.",
      visual: "system",
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "A clear landing place for the finished work.",
      body: "Replace this placeholder with the final product experience, what changed, and the most useful thing learned along the way.",
      visual: "prototype",
    },
  ],
  reflection: "This is an honest placeholder case study and will be replaced as the work is documented.",
};

export const caseStudies: Record<string, CaseStudy> = {
  "signal-noise": {
    lede: "A clearer operating system for teams who have too much to keep track of.",
    role: "Product design, interaction, prototyping",
    team: ["1 designer", "1 product partner", "2 engineers"],
    collaborator: "Concept study",
    sections: [
      { id: "problem", label: "The problem", title: "The important thing was getting lost in the noise.", body: "Signal started with a familiar feeling: every tool was technically working, but the work itself was harder to see. This concept study explores a calmer layer for finding what deserves attention now.", visual: "research" },
      { id: "insight", label: "Insight", title: "People need a sense of now before they need another dashboard.", body: "Instead of adding more filters, the experience begins with a small set of meaningful signals. The design makes space for context, confidence, and the next useful action.", visual: "system" },
      { id: "solution", label: "Solution", title: "A focused surface for the things that move work forward.", body: "The final direction brings status, conversation, and momentum into one quiet view. The visual system uses contrast sparingly so the hierarchy can do the talking.", visual: "prototype" },
    ],
    reflection: "The most successful part of this exercise was choosing what not to surface. Less information made the useful information feel more present.",
  },
  "field-notes": {
    lede: "A flexible identity for a small studio collecting good ideas in the real world.",
    role: "Identity, art direction, editorial design",
    team: ["1 designer", "1 founder", "Independent"],
    collaborator: "Concept study",
    sections: [
      { id: "context", label: "Context", title: "The work was tactile. The identity needed to leave room for it.", body: "Field Notes began as a naming and visual language exercise for a studio with a deep respect for materials, makers, and the evidence of a human hand.", visual: "gallery" },
      { id: "direction", label: "Direction", title: "Document the details. Let the system stay open.", body: "Rather than locking the brand into one perfect composition, the system works like a field journal: a repeatable set of labels, marks, and colors that can travel with the story.", visual: "system" },
      { id: "toolkit", label: "Toolkit", title: "A little structure makes the irregularity feel intentional.", body: "The toolkit pairs a disciplined grid with loose image crops and notes from the margins. It gives the studio consistency without sanding away its point of view.", visual: "prototype" },
    ],
    reflection: "A good identity should feel more useful after the presentation than it did during it. This one is designed to be picked up and used.",
  },
  "the-archive": {
    lede: "A digital home for a growing collection of objects, stories, and small discoveries.",
    role: "Experience design, information architecture",
    team: ["1 designer", "1 curator", "2 developers"],
    collaborator: "Concept study",
    sections: [
      { id: "question", label: "The question", title: "How do you browse a collection without flattening it?", body: "The Archive is a concept for a collection that keeps getting bigger. The challenge was to make discovery feel inviting while allowing each object to retain its own context.", visual: "research" },
      { id: "structure", label: "Structure", title: "A directory can still feel like a place.", body: "We explored a layered index where filters feel more like invitations than controls. Each path through the collection is legible, but never quite predetermined.", visual: "gallery" },
      { id: "experience", label: "Experience", title: "The best search result is a new direction.", body: "The visual language uses oversized typography and patient transitions to slow the pace just enough. The interaction rewards curiosity instead of demanding a perfect query.", visual: "prototype" },
    ],
    reflection: "Archives are not only about retrieval. They are about making the connection between two things feel like a small discovery.",
  },
  "common-ground": {
    lede: "A conversation tool designed around the space between listening and responding.",
    role: "Product design, research, prototyping",
    team: ["1 designer", "1 researcher", "2 engineers"],
    collaborator: "Concept study",
    sections: [
      { id: "friction", label: "The friction", title: "The conversation ended before anyone felt heard.", body: "Common Ground looks at a meeting format where useful ideas were often lost in the pressure to keep moving. The first step was making room for a slower, more visible rhythm.", visual: "research" },
      { id: "principle", label: "Principle", title: "Make the shared understanding visible.", body: "The concept turns notes, questions, and points of alignment into objects the group can shape together. It replaces the hidden document with a shared surface.", visual: "system" },
      { id: "prototype", label: "Prototype", title: "A little more space changes the quality of the answer.", body: "The prototype uses deliberate pauses and calm states to keep the room from feeling rushed. The interface gets out of the way so the conversation can stay in front.", visual: "prototype" },
    ],
    reflection: "Designing for conversation is mostly designing for the seconds people usually skip. Those seconds turned out to be the product.",
  },
  "soft-systems": {
    lede: "A small toolkit for teams building dependable rituals around creative work.",
    role: "Strategy, product design, facilitation",
    team: ["1 designer", "3 collaborators", "Independent"],
    collaborator: "Concept study",
    sections: [
      { id: "context", label: "Context", title: "Every team has a process. Not every process helps.", body: "Soft Systems began with an interest in the invisible rituals that help a group make good work: how they start, decide, share, and reset.", visual: "gallery" },
      { id: "principles", label: "Principles", title: "A system can be supportive without being strict.", body: "The design uses a set of lightweight patterns instead of a rigid framework. Each one gives the team a starting point, then gets out of the way.", visual: "system" },
      { id: "kit", label: "The kit", title: "Small prompts. Better habits.", body: "The toolkit is made of simple cards, prompts, and check-ins that can be brought into the work at the right moment. It is intentionally useful before it is impressive.", visual: "prototype" },
    ],
    reflection: "The best toolkits are generous about interpretation. They give people enough shape to begin and enough freedom to make it theirs.",
  },
  afterimage: {
    lede: "A visual study of how ordinary places stay with us after we have left them.",
    role: "Art direction, motion, visual experiment",
    team: ["1 designer", "1 camera", "A long walk"],
    collaborator: "Personal experiment",
    sections: [
      { id: "prompt", label: "The prompt", title: "Can a digital object hold onto a feeling?", body: "Afterimage is a small visual experiment about memory, repetition, and the details that become clearer after the fact. It starts with images that are intentionally incomplete.", visual: "gallery" },
      { id: "material", label: "Material", title: "Soft edges make room for association.", body: "The composition pairs warm color fields with looping forms and fragments of type. Each piece is specific enough to recognize, but open enough to bring your own memory to it.", visual: "system" },
      { id: "motion", label: "Motion", title: "Let the image arrive a beat after the thought.", body: "The motion language is slow, quiet, and slightly out of sync. Nothing is trying to impress you; it is simply giving the eye time to notice what changed.", visual: "prototype" },
    ],
    reflection: "The experiment reminded me that movement does not always need to explain. Sometimes it only needs to make the page feel alive.",
  },
};
