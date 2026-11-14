/**
 * ALL site copy lives here, in English and French.
 * Edit this file to update the site: map panels, classic view and /cv all read from it.
 * `**double asterisks**` render as highlighted text.
 */

export type Lang = 'en' | 'fr'

export type SectionId = 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact'

export const SECTION_IDS: SectionId[] = [
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'contact',
]

export interface Stat {
  value: string
  label: string
}

export interface Job {
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
}

export interface Project {
  id: string
  title: string
  context?: string
  pitch: string
  problem: string
  approach: string
  result: string
  /** Extra line shown on the site only (not on the printable CV). */
  note?: string
  stack: string[]
  featured?: boolean
}

export interface SkillModule {
  code: string
  title: string
  status: string
  items: string[]
}

export interface LanguageSkill {
  name: string
  level: string
}

export interface School {
  school: string
  degree: string
  period: string
  location: string
}

export interface Certification {
  name: string
  issuer: string
}

export interface Activity {
  name: string
  role: string
  period: string
}

export interface StationCopy {
  /** Station name on the map, e.g. "DOCK-00" */
  name: string
  /** Section title, e.g. "About" */
  label: string
}

export interface Content {
  meta: {
    name: string
    role: string
    tagline: string
    location: string
    company: string
  }
  stations: Record<SectionId, StationCopy>
  hero: {
    kicker: string
    ctaPlayground: string
    ctaCv: string
    ctaContact: string
    stats: Stat[]
  }
  about: { paragraphs: string[] }
  experience: { jobs: Job[] }
  projects: {
    featuredLabel: string
    problem: string
    approach: string
    result: string
    items: Project[]
  }
  skills: {
    modules: SkillModule[]
    languagesTitle: string
    languages: LanguageSkill[]
  }
  education: {
    schoolsTitle: string
    schools: School[]
    certificationsTitle: string
    certifications: Certification[]
    courseworkTitle: string
    coursework: string[]
    activitiesTitle: string
    activities: Activity[]
  }
  contact: {
    intro: string
    email: string
    emailCta: string
    copy: string
    copied: string
    linkedinLabel: string
    linkedinUrl: string
    locationLine: string
  }
  playground: {
    title: string
    intro: string
    dropTasks: string
    dropHint: string
    randomize: string
    clear: string
    naive: string
    optimized: string
    naiveShort: string
    optimizedShort: string
    results: string
    distance: string
    makespan: string
    improvement: string
    runBoth: string
    needTasks: string
    tasks: string
    loading: string
    floorLabel: string
  }
  boot: { lines: string[]; skip: string }
  hud: {
    state: string
    idle: string
    moving: string
    charging: string
    battery: string
    path: string
    eta: string
    missions: string
    fleetView: string
    classicView: string
    switchToFleet: string
    switchToClassic: string
    language: string
    cv: string
    paletteHint: string
    openPalette: string
    mapHint: string
  }
  map: {
    title: string
    jumpTo: string
    stationAria: string
    robotAria: string
  }
  panel: {
    report: string
    close: string
  }
  palette: {
    title: string
    placeholder: string
    help: string[]
    unknown: string
    needDesktop: string
    done: string
    close: string
  }
  cv: {
    download: string
    back: string
    profile: string
    profileText: string
    experience: string
    projects: string
    education: string
    skills: string
    languages: string
    certifications: string
  }
  footer: string
}

/** Facts that do not change with the language. */
const shared = {
  name: 'Rami Bouchnag',
  email: 'bouchnagramii@gmail.com',
  linkedinLabel: 'linkedin.com/in/rami-bouchnag',
  linkedinUrl: 'https://www.linkedin.com/in/rami-bouchnag',
  company: 'ISITEC',
}

const en: Content = {
  meta: {
    name: shared.name,
    role: 'Optimization Engineer',
    tagline:
      'I make robot fleets think faster: optimization algorithms for AMR/AGV fleets, from the math model to the factory floor.',
    location: 'Tunis, Tunisia',
    company: shared.company,
  },
  stations: {
    about: { name: 'DOCK-00', label: 'About' },
    experience: { name: 'MISSION LOG', label: 'Experience' },
    projects: { name: 'PICK STATIONS', label: 'Projects' },
    skills: { name: 'CONTROL ROOM', label: 'Skills' },
    education: { name: 'CHARGING BAY', label: 'Education & Certifications' },
    contact: { name: 'EXIT', label: 'Contact' },
  },
  hero: {
    kicker: 'Optimization Engineer · AMR/AGV fleets · ISITEC',
    ctaPlayground: 'Run the optimizer',
    ctaCv: 'Printable CV',
    ctaContact: 'Contact',
    stats: [
      { value: '25 AMRs', label: 'flagship fleet' },
      { value: '2 regions', label: 'Europe & North Africa' },
      { value: 'Since 2024', label: 'ISITEC' },
      { value: 'Bac+5', label: 'ENIT' },
    ],
  },
  about: {
    paragraphs: [
      'Industrial engineer specialized in **optimization and operations research**, applied to fleets of autonomous mobile robots (AMR/AGV). My core strength is turning an operational problem into a mathematical model, then into an algorithm that holds up in production.',
      'Strong in **Python**, heuristics and metaheuristics, MILP modeling, scheduling and simulation, with solid machine learning foundations and hands-on experience integrating algorithms into a **C#/.NET** Fleet Management System. Equally at ease in the field: on-site commissioning, stakeholder coordination and operator training on international projects, up to a flagship site running a **25-AMR fleet**.',
      'Rigorous, autonomous and clear with both technical and non-technical audiences. Fluent in French and English (C1), native Arabic speaker. ENIT graduate (Bac+5, master\'s level, 2024).',
    ],
  },
  experience: {
    jobs: [
      {
        company: 'ISITEC',
        role: 'Optimization Engineer',
        period: 'Aug 2024 – Present',
        location: 'Tunis, Tunisia · Lyon, France',
        bullets: [
          'Designed and implemented Python optimization algorithms for mobile-robot fleets: **task assignment, routing, traffic management and charging strategy**.',
          "Integrated them into ISITEC's **C#/.NET Fleet Management System**; R&D-tested with clients.",
          'Led on-site AMR deployments for major industrial groups across Europe, including a flagship site running a **25-AMR fleet**, and AGV deployments for clients in North Africa.',
          'Ran deployments end to end: planning, stakeholder coordination, progress tracking, issue escalation and weekly steering meetings.',
          'Analyzed customer processes (logistics, production, workflows) and turned them into functional requirements; designed simulation and API components for real-time process validation and system configuration.',
          'Wrote and structured robot implementation and installation procedures (reflector placement, calibration and verification), kept separate for the AMR and forklift variants.',
          'Took over a **robot mission scheduling ML pipeline** in a knowledge-transfer handover: audited the notebooks and documentation, then found and documented critical issues (hardcoded paths, a shallow-copy bug, an ID correctness issue, undocumented GPU requirements, mismatches between docs and code).',
          'Trained operators, team leaders and maintenance staff; main functional contact for project follow-up.',
        ],
      },
      {
        company: 'ISITEC',
        role: 'Operations Research Intern · Graduation Project',
        period: 'Feb 2024 – Jul 2024',
        location: 'Tunis, Tunisia · Lyon, France',
        bullets: [
          'Mapped client logistics flows and constraints into mathematical models for task assignment and routing.',
          'Designed a mixed-integer linear program (MILP) for multi-robot coordination with IBM CPLEX.',
          'Developed a metaheuristic reaching near-optimal solutions (**≤5% gap**) on large-scale industrial scenarios.',
          'Provided insights that supported system configuration and decisions for later deployments.',
        ],
      },
      {
        company: 'BIWARE Consulting',
        role: 'Machine Learning Intern',
        period: 'Jun 2023 – Aug 2023',
        location: 'Tunis, Tunisia',
        bullets: [
          'Reviewed advanced audio preprocessing techniques for ML classification.',
          'Trained FNN and LSTM models on the GTZAN dataset, reaching **93% accuracy**.',
          'Built a real-time classification GUI with Tkinter for end users.',
        ],
      },
      {
        company: 'DEMCO Industry',
        role: 'Summer Intern',
        period: 'Jun 2022 – Jul 2022',
        location: 'Monastir, Tunisia',
        bullets: [
          'Gained exposure to industrial production and maintenance processes.',
          'Assisted predictive maintenance teams with equipment monitoring.',
        ],
      },
    ],
  },
  projects: {
    featuredLabel: 'Featured case study',
    problem: 'Problem',
    approach: 'Approach',
    result: 'Result',
    items: [
      {
        id: 'fleet-optimizer',
        title: 'Fleet Optimizer for AMR/AGV',
        context: 'ISITEC · Production FMS',
        pitch:
          'Task assignment, routing, traffic and charging optimization, integrated into a production Fleet Management System.',
        problem:
          'A fleet is only as good as its dispatch decisions: which robot takes which task, by which route, without blocking the others or running out of battery.',
        approach:
          "Mathematical models and metaheuristics written in Python for assignment, routing, traffic management and charging strategy, integrated into ISITEC's C#/.NET FMS.",
        result:
          'Integrated into the FMS and R&D-tested with clients.',
        note: 'The playground below runs a small-scale version of the assignment problem in your browser.',
        stack: ['Python', 'Operations research', 'Heuristics', 'C#/.NET integration'],
        featured: true,
      },
      {
        id: 'ml-audit',
        title: 'Robot Mission Scheduling ML Pipeline: Audit & Handover',
        context: 'ISITEC · Knowledge transfer',
        pitch: 'Reliability audit of an inherited ML pipeline before taking ownership of it.',
        problem:
          'The pipeline arrived through a knowledge-transfer handover, with notebooks and documentation that no longer matched each other.',
        approach:
          'Audited the notebooks against the documentation, traced data and ID handling end to end, and checked the environment requirements.',
        result:
          'Documented the critical issues: hardcoded paths, a shallow-copy bug, an ID correctness issue, undocumented GPU requirements and mismatches between docs and code.',
        stack: ['Python', 'Jupyter', 'PyTorch / CUDA'],
      },
      {
        id: 'install-assistant',
        title: 'Installation Knowledge Assistant',
        pitch: 'Document-grounded Q&A assistant for robot installation procedures.',
        problem:
          'Installation procedures are long and differ by robot variant. On site, an answer that sounds right but is not in the procedure costs time.',
        approach:
          'Answers are grounded in the installation documents, with a strict split between what is documented and what is inferred.',
        result:
          'Every answer separates documented statements from flagged inferences, so the reader knows what to verify.',
        stack: ['Document-grounded Q&A', 'Installation procedures', 'AMR / forklift variants'],
      },
      {
        id: 'pfe-milp',
        title: 'Multi-Robot Coordination: MILP and Metaheuristic',
        context: 'Graduation project · ISITEC · 2024',
        pitch: 'Exact and heuristic models for task assignment and routing across a robot fleet.',
        problem:
          'Assign and route tasks across a fleet under real client logistics flows and constraints, at industrial scale.',
        approach:
          'Modelled the problem as a mixed-integer linear program solved with IBM CPLEX, then developed a metaheuristic for large-scale scenarios.',
        result: 'Near-optimal solutions (≤5% gap) on large-scale industrial scenarios.',
        stack: ['MILP', 'IBM CPLEX', 'Metaheuristics'],
      },
      {
        id: 'surgery-planning',
        title: 'Operating Room Scheduling',
        context: 'Academic project · ENIT',
        pitch: 'Planning of surgical activity for a public health care institution.',
        problem:
          'Schedule as many patients as possible in the operating room while giving priority to the most urgent cases.',
        approach: 'Optimization model built with Python and Gurobi, combined with metaheuristics.',
        result:
          'Schedules that prioritize urgency and allocate operating-room resources efficiently.',
        stack: ['Python', 'Gurobi', 'Operations research'],
      },
      {
        id: 'genre-classifier',
        title: 'Real-Time Music Genre Classifier',
        context: 'Internship · BIWARE Consulting · 2023',
        pitch: 'Audio classification models with a real-time desktop interface.',
        problem: 'Classify audio by genre, and make the model usable by non-technical end users.',
        approach:
          'Reviewed audio preprocessing techniques, then trained FNN and LSTM models on the GTZAN dataset.',
        result: '93% accuracy, delivered with a real-time classification GUI built with Tkinter.',
        stack: ['Python', 'FNN', 'LSTM', 'Tkinter'],
      },
      {
        id: 'sustainable-bm',
        title: 'Sustainable Business Model Design Tool',
        context: 'End-of-year project · ENIT',
        pitch: 'A decision-support tool for designing sustainability strategies.',
        problem:
          'Companies lack practical tools to design sustainable business models from the frameworks found in the literature.',
        approach:
          'Literature review of sustainable business model frameworks, then a decision-support tool based on the Rayna and Striukova model.',
        result: 'An interactive desktop tool with a graphical interface built with Tkinter.',
        stack: ['Python', 'Tkinter', 'Decision support'],
      },
    ],
  },
  skills: {
    modules: [
      {
        code: 'OPT-01',
        title: 'Optimization & OR',
        status: 'Core',
        items: [
          'Heuristics & metaheuristics',
          'Task assignment',
          'Routing',
          'Scheduling',
          'MILP modeling',
          'Simulation',
          'IBM CPLEX',
          'Gurobi',
        ],
      },
      {
        code: 'PY-02',
        title: 'Python',
        status: 'Core',
        items: ['Optimization algorithms', 'Pandas', 'Jupyter', 'Tkinter', 'Git'],
      },
      {
        code: 'ML-03',
        title: 'Machine Learning',
        status: 'Applied',
        items: [
          'Scikit-Learn',
          'TensorFlow / Keras',
          'Data mining',
          'Forecasting',
        ],
      },
      {
        code: 'NET-04',
        title: 'C#/.NET integration',
        status: 'Integration',
        items: ['Python algorithms in a C#/.NET FMS', 'Simulation and API components'],
      },
      {
        code: 'ROB-05',
        title: 'Robotics',
        status: 'Field',
        items: [
          'AMR / AGV',
          'Fleet management',
          'On-site commissioning',
          'Installation procedures',
          'Operator training',
        ],
      },
      {
        code: 'DATA-06',
        title: 'Data & tooling',
        status: 'Tooling',
        items: ['SQL', 'R', 'Power BI', 'Excel / VBA', 'ARENA'],
      },
      {
        code: 'BIZ-07',
        title: 'Supply chain & ERP',
        status: 'Background',
        items: [
          'Supply chain process analysis',
          'Inventory management',
          'MRP',
          'Lean 4.0',
          'SAP ERP (university exposure)',
        ],
      },
    ],
    languagesTitle: 'Languages',
    languages: [
      { name: 'Arabic', level: 'Native' },
      { name: 'French', level: 'C1' },
      { name: 'English', level: 'C1' },
      { name: 'Spanish', level: 'Beginner' },
    ],
  },
  education: {
    schoolsTitle: 'Education',
    schools: [
      {
        school: 'ENIT · National Engineering School of Tunis',
        degree: "Industrial Engineering degree (Bac+5, master's level) · Supply Chain specialization",
        period: '2021 – 2024',
        location: 'Tunis, Tunisia',
      },
      {
        school: 'Preparatory Institute for Engineering Studies, Monastir',
        degree: 'Mathematics & Physics preparatory cycle',
        period: '2019 – 2021',
        location: 'Monastir, Tunisia',
      },
      {
        school: 'Pioneer Preparatory School, Tataouine',
        degree: 'High School Diploma · Mathematics (with honors)',
        period: '2015 – 2019',
        location: 'Tataouine, Tunisia',
      },
    ],
    certificationsTitle: 'Certifications',
    certifications: [
      { name: 'Data Science Orientation', issuer: 'Coursera (IBM)' },
      { name: 'Python for Data Science', issuer: 'Sololearn' },
      { name: 'Introduction to Python', issuer: 'DataCamp' },
      { name: 'Introduction to SQL', issuer: 'DataCamp' },
    ],
    courseworkTitle: 'Relevant coursework',
    coursework: [
      'Operations Research',
      'Dynamic Programming',
      'Stochastic Processes',
      'Simulation (ARENA)',
      'Data Mining',
      'Artificial Intelligence',
      'Supply Chain',
      'Advanced Mathematics',
      'Computer Science',
      'Financial Management',
    ],
    activitiesTitle: 'Community',
    activities: [
      { name: 'Industrial Engineering Club, ENIT', role: 'Senior Member', period: '2021 – Present' },
      { name: 'Google Developer Student Club, ENIT', role: 'Senior Member', period: '2021 – 2022' },
    ],
  },
  contact: {
    intro:
      'For optimization, robotics or fleet-management roles and projects, email is the fastest way to reach me.',
    email: shared.email,
    emailCta: 'Send an email',
    copy: 'Copy',
    copied: 'Copied',
    linkedinLabel: shared.linkedinLabel,
    linkedinUrl: shared.linkedinUrl,
    locationLine: 'Tunis, Tunisia · open to international roles',
  },
  playground: {
    title: 'Optimizer Playground',
    intro:
      'Three robots, a handful of pick tasks. Dispatch them first-come, first-served, then let the optimizer assign and sequence them, and compare.',
    dropTasks: 'Drop tasks',
    dropHint: 'Click the floor to place 5 to 10 pick tasks. Click a task to remove it.',
    randomize: 'Randomize',
    clear: 'Clear',
    naive: 'Dispatch (naive)',
    optimized: 'Dispatch (optimized)',
    naiveShort: 'Naive · first-come, first-served',
    optimizedShort: 'Optimized · insertion + 2-opt',
    results: 'Results',
    distance: 'Total distance',
    makespan: 'Makespan',
    improvement: 'Improvement',
    runBoth: 'Run both dispatch modes to compare them.',
    needTasks: 'Place at least 2 tasks, or press Randomize.',
    tasks: 'tasks',
    loading: 'Loading optimizer…',
    floorLabel: 'Playground floor. Click to place pick tasks.',
  },
  boot: {
    lines: [
      'FLEET//OS v2.4 — initializing',
      'loading map: rami_bouchnag.yaml',
      'registering stations ... 6 found',
      'localizing AMR-01 ... OK',
      'battery 87% · lidar OK',
      'optimizer: ready',
    ],
    skip: 'Skip',
  },
  hud: {
    state: 'STATE',
    idle: 'IDLE',
    moving: 'MOVING',
    charging: 'CHARGING',
    battery: 'BATTERY',
    path: 'PATH',
    eta: 'ETA',
    missions: 'MISSIONS',
    fleetView: 'FLEET VIEW',
    classicView: 'CLASSIC VIEW',
    switchToFleet: 'Switch to fleet view',
    switchToClassic: 'Switch to classic view',
    language: 'Language',
    cv: 'CV',
    paletteHint: '⌘K / Ctrl+K — operator console',
    openPalette: 'Open the operator console',
    mapHint: 'Click a station or press 1–6 to send AMR-01',
  },
  map: {
    title: 'Warehouse map. Each station opens a section of the portfolio.',
    jumpTo: 'Jump to section',
    stationAria: 'Send AMR-01 to station {name}: {label}',
    robotAria: 'AMR-01 robot',
  },
  panel: {
    report: 'Mission report',
    close: 'Close panel',
  },
  palette: {
    title: 'Operator console',
    placeholder: 'Type a command, e.g. goto projects',
    help: [
      'goto about|experience|projects|skills|education|contact',
      'lang en|fr',
      'view classic | view fleet',
      'cv — open the printable CV',
      'optimize — open the Optimizer Playground',
      'help — show this list',
    ],
    unknown: 'Unknown command. Type "help" for the list.',
    needDesktop: 'Fleet view needs a screen at least 1024 px wide.',
    done: 'OK',
    close: 'Close console',
  },
  cv: {
    download: 'Download PDF',
    back: 'Back to site',
    profile: 'Profile',
    profileText:
      "Optimization Engineer at ISITEC. I design Python optimization algorithms for AMR/AGV fleets (task assignment, routing, traffic management, charging strategy), integrate them into a C#/.NET Fleet Management System and deploy fleets on site: AMR deployments for major industrial groups across Europe, including a flagship site running a 25-AMR fleet, and AGV deployments for clients in North Africa. Industrial Engineering degree from ENIT (Bac+5, 2024).",
    experience: 'Experience',
    projects: 'Selected projects',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications',
  },
  footer: 'Designed and built as a fleet console. Paths computed with A*.',
}

const fr: Content = {
  meta: {
    name: shared.name,
    role: 'Ingénieur Optimisation',
    tagline:
      "Je fais réfléchir les flottes de robots plus vite : des algorithmes d'optimisation pour flottes AMR/AGV, du modèle mathématique jusqu'à l'atelier.",
    location: 'Tunis, Tunisie',
    company: shared.company,
  },
  stations: {
    about: { name: 'DOCK-00', label: 'À propos' },
    experience: { name: 'MISSION LOG', label: 'Expérience' },
    projects: { name: 'PICK STATIONS', label: 'Projets' },
    skills: { name: 'CONTROL ROOM', label: 'Compétences' },
    education: { name: 'CHARGING BAY', label: 'Formation & Certifications' },
    contact: { name: 'EXIT', label: 'Contact' },
  },
  hero: {
    kicker: 'Ingénieur Optimisation · Flottes AMR/AGV · ISITEC',
    ctaPlayground: "Lancer l'optimiseur",
    ctaCv: 'CV imprimable',
    ctaContact: 'Contact',
    stats: [
      { value: '25 AMR', label: 'flotte du site majeur' },
      { value: '2 régions', label: 'Europe & Afrique du Nord' },
      { value: 'Depuis 2024', label: 'ISITEC' },
      { value: 'Bac+5', label: 'ENIT' },
    ],
  },
  about: {
    paragraphs: [
      "Ingénieur en génie industriel spécialisé en **optimisation et recherche opérationnelle**, appliquées aux flottes de robots mobiles autonomes (AMR/AGV). Mon point fort : traduire un problème opérationnel en modèle mathématique, puis en algorithme qui tient en production.",
      "Solide maîtrise de **Python**, des heuristiques et métaheuristiques, de la modélisation MILP, de l'ordonnancement et de la simulation, avec de bonnes bases en machine learning et une expérience concrète de l'intégration d'algorithmes dans un Fleet Management System **C#/.NET**. Tout aussi à l'aise sur le terrain : mise en service sur site, coordination des parties prenantes et formation des opérateurs sur des projets internationaux, jusqu'à un site majeur exploitant une flotte de **25 AMR**.",
      "Rigoureux, autonome et clair avec des interlocuteurs techniques comme non techniques. Français et anglais courants (C1), arabe langue maternelle. Diplômé de l'ENIT (Bac+5, 2024).",
    ],
  },
  experience: {
    jobs: [
      {
        company: 'ISITEC',
        role: 'Ingénieur Optimisation',
        period: "Août 2024 – Aujourd'hui",
        location: 'Tunis, Tunisie · Lyon, France',
        bullets: [
          "Conception et implémentation d'algorithmes d'optimisation en Python pour flottes de robots mobiles : **affectation des tâches, routage, gestion du trafic et stratégie de recharge**.",
          "Intégration dans le **Fleet Management System C#/.NET** d'ISITEC ; validation R&D avec les clients.",
          'Déploiements AMR sur site pour de grands groupes industriels en Europe, dont un site majeur exploitant une flotte de **25 AMR**, et déploiements AGV pour des clients en Afrique du Nord.',
          "Pilotage des déploiements de bout en bout : planification, coordination des parties prenantes, suivi d'avancement, remontée des points bloquants et comités de pilotage hebdomadaires.",
          "Analyse des processus clients (logistique, production, flux) et traduction en exigences fonctionnelles ; conception de composants de simulation et d'API pour valider les processus en temps réel et configurer le système.",
          "Rédaction et structuration des procédures d'implémentation et d'installation des robots (pose des réflecteurs, calibration et vérification), avec des versions distinctes pour les AMR et les chariots élévateurs.",
          "Reprise d'un **pipeline ML de planification des missions robots** lors d'un transfert de compétences : audit des notebooks et de la documentation, puis identification et documentation de problèmes critiques (chemins codés en dur, bug de copie superficielle, erreur de cohérence des identifiants, prérequis GPU non documentés, écarts entre la documentation et le code).",
          "Formation des opérateurs, des chefs d'équipe et des équipes de maintenance ; interlocuteur fonctionnel principal pour le suivi des projets.",
        ],
      },
      {
        company: 'ISITEC',
        role: "Stagiaire Recherche Opérationnelle · Projet de fin d'études",
        period: 'Fév. 2024 – Juil. 2024',
        location: 'Tunis, Tunisie · Lyon, France',
        bullets: [
          "Cartographie des flux logistiques et des contraintes clients pour construire des modèles mathématiques d'affectation et de routage.",
          "Conception d'un programme linéaire en nombres entiers mixtes (MILP) pour la coordination multi-robots avec IBM CPLEX.",
          "Développement d'une métaheuristique atteignant des solutions quasi optimales (**écart ≤ 5 %**) sur des scénarios industriels de grande taille.",
          'Analyses utilisées pour la configuration du système et les décisions sur les déploiements suivants.',
        ],
      },
      {
        company: 'BIWARE Consulting',
        role: 'Stagiaire Machine Learning',
        period: 'Juin 2023 – Août 2023',
        location: 'Tunis, Tunisie',
        bullets: [
          'Étude de techniques avancées de prétraitement audio pour la classification par ML.',
          'Entraînement de modèles FNN et LSTM sur le jeu de données GTZAN, avec **93 % de précision**.',
          "Développement d'une interface de classification en temps réel avec Tkinter pour les utilisateurs finaux.",
        ],
      },
      {
        company: 'DEMCO Industry',
        role: "Stagiaire d'été",
        period: 'Juin 2022 – Juil. 2022',
        location: 'Monastir, Tunisie',
        bullets: [
          'Découverte des processus industriels de production et de maintenance.',
          'Appui aux équipes de maintenance prédictive pour la surveillance des équipements.',
        ],
      },
    ],
  },
  projects: {
    featuredLabel: 'Étude de cas principale',
    problem: 'Problème',
    approach: 'Approche',
    result: 'Résultat',
    items: [
      {
        id: 'fleet-optimizer',
        title: 'Optimiseur de flotte AMR/AGV',
        context: 'ISITEC · FMS en production',
        pitch:
          'Optimisation de l\'affectation, du routage, du trafic et de la recharge, intégrée à un Fleet Management System en production.',
        problem:
          "Une flotte vaut ce que valent ses décisions de dispatch : quel robot prend quelle tâche, par quel chemin, sans bloquer les autres ni tomber en panne de batterie.",
        approach:
          "Modèles mathématiques et métaheuristiques écrits en Python pour l'affectation, le routage, la gestion du trafic et la stratégie de recharge, intégrés au FMS C#/.NET d'ISITEC.",
        result:
          'Intégré au FMS et validé en R&D avec les clients.',
        note: "Le playground ci-dessous exécute une version réduite du problème d'affectation dans votre navigateur.",
        stack: ['Python', 'Recherche opérationnelle', 'Heuristiques', 'Intégration C#/.NET'],
        featured: true,
      },
      {
        id: 'ml-audit',
        title: 'Pipeline ML de planification des missions robots : audit et reprise',
        context: 'ISITEC · Transfert de compétences',
        pitch: "Audit de fiabilité d'un pipeline ML hérité, avant d'en prendre la responsabilité.",
        problem:
          'Le pipeline a été transmis lors d\'un transfert de compétences, avec des notebooks et une documentation qui ne concordaient plus.',
        approach:
          "Audit des notebooks au regard de la documentation, suivi de bout en bout du traitement des données et des identifiants, vérification des prérequis d'environnement.",
        result:
          'Problèmes critiques documentés : chemins codés en dur, bug de copie superficielle, erreur de cohérence des identifiants, prérequis GPU non documentés et écarts entre la documentation et le code.',
        stack: ['Python', 'Jupyter', 'PyTorch / CUDA'],
      },
      {
        id: 'install-assistant',
        title: "Assistant de connaissance pour l'installation",
        pitch:
          "Assistant de questions-réponses fondé sur les documents des procédures d'installation des robots.",
        problem:
          "Les procédures d'installation sont longues et varient selon le type de robot. Sur site, une réponse plausible mais absente de la procédure fait perdre du temps.",
        approach:
          "Les réponses s'appuient sur les documents d'installation, avec une séparation stricte entre ce qui est documenté et ce qui est déduit.",
        result:
          'Chaque réponse distingue les éléments documentés des déductions signalées : le lecteur sait ce qu\'il doit vérifier.',
        stack: ['Q&R sur documents', "Procédures d'installation", 'Variantes AMR / chariot'],
      },
      {
        id: 'pfe-milp',
        title: 'Coordination multi-robots : MILP et métaheuristique',
        context: "Projet de fin d'études · ISITEC · 2024",
        pitch:
          "Modèles exacts et heuristiques pour l'affectation et le routage des tâches d'une flotte de robots.",
        problem:
          "Affecter et router les tâches d'une flotte en respectant les flux logistiques et les contraintes réelles des clients, à l'échelle industrielle.",
        approach:
          "Modélisation en programme linéaire en nombres entiers mixtes résolu avec IBM CPLEX, puis développement d'une métaheuristique pour les scénarios de grande taille.",
        result: 'Solutions quasi optimales (écart ≤ 5 %) sur des scénarios industriels de grande taille.',
        stack: ['MILP', 'IBM CPLEX', 'Métaheuristiques'],
      },
      {
        id: 'surgery-planning',
        title: 'Planification du bloc opératoire',
        context: 'Projet académique · ENIT',
        pitch: "Planification de l'activité chirurgicale d'un établissement de santé public.",
        problem:
          'Planifier un maximum de patients au bloc opératoire en donnant la priorité aux cas les plus urgents.',
        approach: "Modèle d'optimisation construit avec Python et Gurobi, combiné à des métaheuristiques.",
        result:
          "Des plannings qui respectent les priorités d'urgence et allouent efficacement les ressources du bloc.",
        stack: ['Python', 'Gurobi', 'Recherche opérationnelle'],
      },
      {
        id: 'genre-classifier',
        title: 'Classification de genres musicaux en temps réel',
        context: 'Stage · BIWARE Consulting · 2023',
        pitch: 'Modèles de classification audio avec une interface de bureau en temps réel.',
        problem:
          'Classer des extraits audio par genre et rendre le modèle utilisable par des non-spécialistes.',
        approach:
          'Étude des techniques de prétraitement audio, puis entraînement de modèles FNN et LSTM sur le jeu de données GTZAN.',
        result: '93 % de précision, avec une interface de classification en temps réel développée avec Tkinter.',
        stack: ['Python', 'FNN', 'LSTM', 'Tkinter'],
      },
      {
        id: 'sustainable-bm',
        title: 'Outil de conception de business models durables',
        context: "Projet de fin d'année · ENIT",
        pitch: "Un outil d'aide à la décision pour concevoir des stratégies de durabilité.",
        problem:
          "Les entreprises manquent d'outils concrets pour concevoir des business models durables à partir des cadres proposés dans la littérature.",
        approach:
          "Revue de littérature sur les business models durables, puis outil d'aide à la décision fondé sur le modèle de Rayna et Striukova.",
        result: 'Un outil de bureau interactif avec une interface graphique développée avec Tkinter.',
        stack: ['Python', 'Tkinter', 'Aide à la décision'],
      },
    ],
  },
  skills: {
    modules: [
      {
        code: 'OPT-01',
        title: 'Optimisation & RO',
        status: 'Cœur de métier',
        items: [
          'Heuristiques & métaheuristiques',
          'Affectation des tâches',
          'Routage',
          'Ordonnancement',
          'Modélisation MILP',
          'Simulation',
          'IBM CPLEX',
          'Gurobi',
        ],
      },
      {
        code: 'PY-02',
        title: 'Python',
        status: 'Cœur de métier',
        items: ["Algorithmes d'optimisation", 'Pandas', 'Jupyter', 'Tkinter', 'Git'],
      },
      {
        code: 'ML-03',
        title: 'Machine Learning',
        status: 'Appliqué',
        items: [
          'Scikit-Learn',
          'TensorFlow / Keras',
          'Data mining',
          'Prévision',
        ],
      },
      {
        code: 'NET-04',
        title: 'Intégration C#/.NET',
        status: 'Intégration',
        items: ['Algorithmes Python dans un FMS C#/.NET', "Composants de simulation et d'API"],
      },
      {
        code: 'ROB-05',
        title: 'Robotique',
        status: 'Terrain',
        items: [
          'AMR / AGV',
          'Gestion de flotte',
          'Mise en service sur site',
          "Procédures d'installation",
          'Formation des opérateurs',
        ],
      },
      {
        code: 'DATA-06',
        title: 'Données & outils',
        status: 'Outillage',
        items: ['SQL', 'R', 'Power BI', 'Excel / VBA', 'ARENA'],
      },
      {
        code: 'BIZ-07',
        title: 'Supply chain & ERP',
        status: 'Socle',
        items: [
          'Analyse des processus supply chain',
          'Gestion des stocks',
          'MRP',
          'Lean 4.0',
          'SAP ERP (cadre universitaire)',
        ],
      },
    ],
    languagesTitle: 'Langues',
    languages: [
      { name: 'Arabe', level: 'Langue maternelle' },
      { name: 'Français', level: 'C1' },
      { name: 'Anglais', level: 'C1' },
      { name: 'Espagnol', level: 'Débutant' },
    ],
  },
  education: {
    schoolsTitle: 'Formation',
    schools: [
      {
        school: "ENIT · École Nationale d'Ingénieurs de Tunis",
        degree: "Diplôme d'ingénieur en Génie Industriel (Bac+5) · Spécialisation Supply Chain",
        period: '2021 – 2024',
        location: 'Tunis, Tunisie',
      },
      {
        school: "Institut Préparatoire aux Études d'Ingénieurs de Monastir",
        degree: 'Cycle préparatoire Mathématiques-Physique',
        period: '2019 – 2021',
        location: 'Monastir, Tunisie',
      },
      {
        school: 'Lycée Pilote de Tataouine',
        degree: 'Baccalauréat · Mathématiques (avec mention)',
        period: '2015 – 2019',
        location: 'Tataouine, Tunisie',
      },
    ],
    certificationsTitle: 'Certifications',
    certifications: [
      { name: 'Data Science Orientation', issuer: 'Coursera (IBM)' },
      { name: 'Python for Data Science', issuer: 'Sololearn' },
      { name: 'Introduction to Python', issuer: 'DataCamp' },
      { name: 'Introduction to SQL', issuer: 'DataCamp' },
    ],
    courseworkTitle: 'Enseignements clés',
    coursework: [
      'Recherche opérationnelle',
      'Programmation dynamique',
      'Processus stochastiques',
      'Simulation (ARENA)',
      'Data mining',
      'Intelligence artificielle',
      'Supply chain',
      'Mathématiques avancées',
      'Informatique',
      'Gestion financière',
    ],
    activitiesTitle: 'Vie associative',
    activities: [
      { name: 'Club Génie Industriel, ENIT', role: 'Membre senior', period: "2021 – Aujourd'hui" },
      { name: 'Google Developer Student Club, ENIT', role: 'Membre senior', period: '2021 – 2022' },
    ],
  },
  contact: {
    intro:
      "Pour un poste ou un projet en optimisation, en robotique ou en gestion de flotte, l'e-mail reste le moyen le plus rapide de me joindre.",
    email: shared.email,
    emailCta: 'Envoyer un e-mail',
    copy: 'Copier',
    copied: 'Copié',
    linkedinLabel: shared.linkedinLabel,
    linkedinUrl: shared.linkedinUrl,
    locationLine: "Tunis, Tunisie · ouvert aux postes à l'international",
  },
  playground: {
    title: 'Optimizer Playground',
    intro:
      "Trois robots, quelques tâches de picking. Dispatchez-les dans l'ordre d'arrivée, puis laissez l'optimiseur les affecter et les séquencer, et comparez.",
    dropTasks: 'Poser des tâches',
    dropHint: 'Cliquez sur le sol pour poser 5 à 10 tâches. Cliquez sur une tâche pour la retirer.',
    randomize: 'Aléatoire',
    clear: 'Effacer',
    naive: 'Dispatch (naïf)',
    optimized: 'Dispatch (optimisé)',
    naiveShort: "Naïf · ordre d'arrivée",
    optimizedShort: 'Optimisé · insertion + 2-opt',
    results: 'Résultats',
    distance: 'Distance totale',
    makespan: 'Makespan',
    improvement: 'Gain',
    runBoth: 'Lancez les deux modes de dispatch pour les comparer.',
    needTasks: 'Posez au moins 2 tâches, ou cliquez sur Aléatoire.',
    tasks: 'tâches',
    loading: "Chargement de l'optimiseur…",
    floorLabel: 'Sol du playground. Cliquez pour poser des tâches de picking.',
  },
  boot: {
    lines: [
      'FLEET//OS v2.4 — initialisation',
      'chargement de la carte : rami_bouchnag.yaml',
      'enregistrement des stations ... 6 trouvées',
      'localisation de AMR-01 ... OK',
      'batterie 87 % · lidar OK',
      'optimiseur : prêt',
    ],
    skip: 'Passer',
  },
  hud: {
    state: 'ÉTAT',
    idle: 'EN ATTENTE',
    moving: 'EN ROUTE',
    charging: 'EN CHARGE',
    battery: 'BATTERIE',
    path: 'TRAJET',
    eta: 'ETA',
    missions: 'MISSIONS',
    fleetView: 'VUE FLOTTE',
    classicView: 'VUE CLASSIQUE',
    switchToFleet: 'Passer à la vue flotte',
    switchToClassic: 'Passer à la vue classique',
    language: 'Langue',
    cv: 'CV',
    paletteHint: '⌘K / Ctrl+K — console opérateur',
    openPalette: 'Ouvrir la console opérateur',
    mapHint: 'Cliquez sur une station ou appuyez sur 1–6 pour envoyer AMR-01',
  },
  map: {
    title: "Plan de l'entrepôt. Chaque station ouvre une section du portfolio.",
    jumpTo: 'Aller à la section',
    stationAria: 'Envoyer AMR-01 à la station {name} : {label}',
    robotAria: 'Robot AMR-01',
  },
  panel: {
    report: 'Rapport de mission',
    close: 'Fermer le panneau',
  },
  palette: {
    title: 'Console opérateur',
    placeholder: 'Saisissez une commande, ex. goto projects',
    help: [
      'goto about|experience|projects|skills|education|contact',
      'lang en|fr',
      'view classic | view fleet',
      'cv — ouvrir le CV imprimable',
      "optimize — ouvrir l'Optimizer Playground",
      'help — afficher cette liste',
    ],
    unknown: 'Commande inconnue. Tapez « help » pour la liste.',
    needDesktop: "La vue flotte nécessite un écran d'au moins 1024 px de large.",
    done: 'OK',
    close: 'Fermer la console',
  },
  cv: {
    download: 'Télécharger le PDF',
    back: 'Retour au site',
    profile: 'Profil',
    profileText:
      "Ingénieur optimisation chez ISITEC. Je conçois des algorithmes d'optimisation en Python pour flottes AMR/AGV (affectation des tâches, routage, gestion du trafic, stratégie de recharge), je les intègre à un Fleet Management System C#/.NET et je déploie les flottes sur site : déploiements AMR pour de grands groupes industriels en Europe, dont un site majeur exploitant une flotte de 25 AMR, et déploiements AGV pour des clients en Afrique du Nord. Diplôme d'ingénieur en Génie Industriel de l'ENIT (Bac+5, 2024).",
    experience: 'Expérience',
    projects: 'Projets sélectionnés',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    certifications: 'Certifications',
  },
  footer: 'Conçu et développé comme une console de flotte. Trajets calculés avec A*.',
}

export const content: Record<Lang, Content> = { en, fr }
