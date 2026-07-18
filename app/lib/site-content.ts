export type SiteNavItem = {
  href: string;
  label: string;
  description: string;
};

export type SocialAccount = {
  name: string;
  handle: string;
  url: string;
};

export type CoordinatorSlug = "caep" | "caes" | "clam" | "cac" | "clev";

export type CoordinatorProfile = {
  slug: CoordinatorSlug;
  shortName: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  imageSrc: string;
  accent: {
    primary: string;
    secondary: string;
    surface: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  overview: Array<{
    title: string;
    text: string;
  }>;
  mission: string;
  values: string[];
  highlights: string[];
  team?: Array<{
    name: string;
    role: string;
    photo: string;
  }>;
  qrCode?: {
    src: string;
    title: string;
    caption: string;
  };
};

export const siteNavigation: SiteNavItem[] = [
  { href: "/", label: "Início", description: "Visão geral do DADG" },
  { href: "/certificados", label: "Certificados", description: "Busque e valide certificados" },
  { href: "/coordenadorias", label: "Coordenadorias", description: "Conheça os núcleos de atuação" },
  { href: "/eventos", label: "Eventos", description: "Calendário acadêmico e programação" },
  { href: "/sobre", label: "Sobre", description: "História, missão e valores" },
  { href: "/contato", label: "Contato", description: "Instagram, e-mail e canais" },
  { href: "/ouvidoria", label: "Ouvidoria", description: "Envie manifestações e sugestões" },
];

export const socialAccounts: SocialAccount[] = [
  { name: "DADG Imepac", handle: "@dadg.imepac", url: "https://instagram.com/dadg.imepac" },
  { name: "CAEP Imepac", handle: "@caep.imepac", url: "https://instagram.com/caep.imepac" },
  { name: "CLAM Imepac", handle: "@clam.imepac", url: "https://instagram.com/clam.imepac" },
  { name: "CLEV Imepac Araguari", handle: "@clevimepacaraguari", url: "https://instagram.com/clevimepacaraguari" },
  { name: "CAES Imepac", handle: "@caes.imepac", url: "https://instagram.com/caes.imepac" },
  { name: "COEPS Araguari", handle: "@coeps.araguari", url: "https://instagram.com/coeps.araguari" },
];

export const homepageHighlights = [
  {
    title: "Acesso rápido a serviços",
    text: "Certificados, calendário, mural e canais de contato ficam a poucos cliques, em uma estrutura mais clara e objetiva.",
  },
  {
    title: "Representação com organização",
    text: "O site passa a apresentar o DADG como uma instituição estudantil forte, com comunicação profissional e bem segmentada.",
  },
  {
    title: "Experiência pensada para estudantes",
    text: "Cada página prioriza legibilidade, orientação e fluxo, sem perder as funções que já sustentam o dia a dia acadêmico.",
  },
];

export const supportPillars = [
  "Representação estudantil",
  "Extensão e pesquisa",
  "Educação em saúde",
  "Ligas acadêmicas",
  "Certificados e tecnologia",
  "Estágios e vivências",
];

export const coordinatorProfiles: Record<CoordinatorSlug, CoordinatorProfile> = {
  caep: {
    slug: "caep",
    shortName: "CAEP",
    title: "CAEP",
    subtitle: "Coordenadoria Acadêmica de Extensão e Pesquisa",
    summary: "Conecta ensino, pesquisa e extensão em iniciativas com impacto acadêmico e social.",
    description:
      "A CAEP fortalece o ambiente universitário ao aproximar estudantes de projetos, pesquisas e ações extensionistas que ampliam a formação médica.",
    imageSrc: "/coordinators/CAEP.png",
    accent: {
      primary: "#000066",
      secondary: "#3366CC",
      surface: "rgba(51, 102, 204, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Pesquisa e extensão" },
      { label: "Atuação", value: "Integração acadêmica" },
      { label: "Perfil", value: "Inovação científica" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "Somos a coordenadoria responsável por fomentar e coordenar as atividades de extensão e pesquisa dentro da estrutura do DADG.",
      },
      {
        title: "O que buscamos",
        text: "Promover a integração entre ensino, pesquisa e extensão por meio de projetos que contribuam para o desenvolvimento acadêmico e social.",
      },
      {
        title: "Como contribuimos",
        text: "Criamos pontes entre alunos, projetos e oportunidades para transformar curiosidade científica em ação concreta.",
      },
    ],
    mission:
      "Promover o desenvolvimento acadêmico por meio da integração entre ensino, pesquisa e extensão, contribuindo para a formação de profissionais comprometidos com a transformação social.",
    values: [
      "Excelência acadêmica",
      "Inovação científica",
      "Compromisso social",
      "Integração com a comunidade",
    ],
    highlights: [
      "Apoio a projetos com impacto para a comunidade",
      "Estreitamento entre teoria, prática e produção científica",
      "Valorização de uma formação médica mais completa",
    ],
  },
  caes: {
    slug: "caes",
    shortName: "CAES",
    title: "CAES",
    subtitle: "Coordenadoria Acadêmica de Educação em Saúde",
    summary: "Leva educação em saúde para dentro e para fora da faculdade com foco em transformação social.",
    description:
      "A CAES organiza iniciativas educativas que aproximam conhecimento, prevenção e impacto social, reforçando o compromisso do curso com a comunidade.",
    imageSrc: "/coordinators/CAES.jpg",
    accent: {
      primary: "#056653",
      secondary: "#16A34A",
      surface: "rgba(22, 163, 74, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Educação em saúde" },
      { label: "Impacto", value: "Comunidade" },
      { label: "Direção", value: "Prevenção e cuidado" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "Somos a coordenadoria dedicada a desenvolver iniciativas de educação em saúde com linguagem acessível e impacto real.",
      },
      {
        title: "O que buscamos",
        text: "Levar educação em saúde para a comunidade e ampliar a consciência sobre temas que transformam a qualidade de vida da população.",
      },
      {
        title: "Como atuamos",
        text: "Conectamos estudantes, conhecimento e ação prática em projetos voltados para orientação, prevenção e promoção da saúde.",
      },
    ],
    mission:
      "Trabalhamos para impactar positivamente a vida das pessoas e transformar a comunidade em um lugar melhor por meio da educação em saúde.",
    values: [
      "Compromisso com a excelência",
      "Ética",
      "Educação em saúde para a população",
      "Inovação e evolução constante",
    ],
    highlights: [
      "Projetos com linguagem clara e orientada ao cuidado",
      "Vivências que aproximam estudantes da realidade social",
      "Fortalecimento da responsabilidade coletiva em saúde",
    ],
  },
  clam: {
    slug: "clam",
    shortName: "CLAM",
    title: "CLAM",
    subtitle: "Coordenadoria de Ligas Acadêmicas de Medicina",
    summary: "Organiza, integra e dá visibilidade ao ecossistema de ligas acadêmicas da Imepac.",
    description:
      "A CLAM conecta ligas, estudantes e oportunidades, fortalecendo a cultura acadêmica e o aprofundamento em diferentes áreas da medicina.",
    imageSrc: "/coordinators/CLAM.png",
    accent: {
      primary: "#0A7A1A",
      secondary: "#22C55E",
      surface: "rgba(34, 197, 94, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Ligas acadêmicas" },
      { label: "Atuação", value: "Integração e organização" },
      { label: "Perfil", value: "Protagonismo estudantil" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "A CLAM é o órgão responsável por coordenar e integrar todas as ligas acadêmicas da Imepac.",
      },
      {
        title: "Objetivo central",
        text: "Promover integração entre as ligas, incentivar o desenvolvimento científico e ampliar as possibilidades de aprendizado.",
      },
      {
        title: "Como apoiamos",
        text: "Facilitamos o acesso a informações, fortalecemos a identidade das ligas e organizamos a vitrine de oportunidades acadêmicas.",
      },
    ],
    mission:
      "Fomentar um ambiente colaborativo no qual as ligas acadêmicas contribuam para uma formação médica de excelência.",
    values: [
      "Integração",
      "Organização",
      "Autonomia estudantil",
      "Desenvolvimento científico",
    ],
    highlights: [
      "Navegação organizada por ciclo acadêmico",
      "Apresentação clara da identidade de cada liga",
      "Maior visibilidade para projetos e áreas de atuação",
    ],
  },
  cac: {
    slug: "cac",
    shortName: "CAC",
    title: "CAC",
    subtitle: "Coordenadoria Acadêmica de Certificados e TI",
    summary: "Cuida dos fluxos de certificados e evolui a experiência digital do DADG.",
    description:
      "A CAC atua como ponte entre organização, tecnologia e atendimento, melhorando processos internos e a usabilidade dos serviços oferecidos aos estudantes.",
    imageSrc: "/coordinators/CAC.jpeg",
    accent: {
      primary: "#050A4A",
      secondary: "#3B82F6",
      surface: "rgba(59, 130, 246, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Certificados e TI" },
      { label: "Atuação", value: "Processos digitais" },
      { label: "Perfil", value: "Organização e suporte" },
    ],
    overview: [
      {
        title: "Visão",
        text: "Ser a ponte entre setores, pessoas e ideias com empatia, organização e excelência.",
      },
      {
        title: "Missao operacional",
        text: "Garantir inovação e organização para os processos de certificados e melhorar continuamente a experiência digital dos discentes.",
      },
      {
        title: "Papel no site",
        text: "A CAC sustenta fluxos que precisam funcionar de verdade: busca, validação, visualização e distribuição de certificados.",
      },
    ],
    mission:
      "Trazer clareza, agilidade e tecnologia para os processos que precisam ser confiáveis e simples para todos os estudantes.",
    values: [
      "Empatia",
      "Transparência",
      "Agilidade",
      "Organização",
      "Colaboração",
    ],
    highlights: [
      "Melhoria contínua dos fluxos digitais do DADG",
      "Atendimento mais claro para quem precisa de certificados",
      "Apoio técnico para dar escala e consistência aos processos",
    ],
  },
  clev: {
    slug: "clev",
    shortName: "CLEV",
    title: "CLEV",
    subtitle: "Coordenadoria Local de Estágios e Vivências",
    summary: "Transforma experiências práticas em oportunidades de crescimento acadêmico e profissional.",
    description:
      "A CLEV organiza experiências, estágios e vivências que conectam estudantes a contextos práticos importantes para sua formação médica.",
    imageSrc: "/coordinators/CLEV.jpg",
    accent: {
      primary: "#526C94",
      secondary: "#60A5FA",
      surface: "rgba(96, 165, 250, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Estágios e vivências" },
      { label: "Atuação", value: "Experiências práticas" },
      { label: "Perfil", value: "Crescimento profissional" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "Somos a coordenadoria responsável por gerenciar e organizar experiências práticas para os estudantes de medicina.",
      },
      {
        title: "O que buscamos",
        text: "Garantir acesso a estágios e vivências que complementem a formação acadêmica com qualidade e relevância.",
      },
      {
        title: "Como apoiamos",
        text: "Ajudamos os alunos a transformar interesse em oportunidade por meio de organização, orientação e acesso.",
      },
    ],
    mission:
      "Garantir que cada estudante tenha acesso a experiências práticas de qualidade, contribuindo para uma formação médica completa e excelente.",
    values: [
      "Excelência na formação prática",
      "Organização e eficiência",
      "Compromisso com a qualidade",
      "Inovação nos processos",
    ],
    highlights: [
      "Proximidade com vivências que ampliam repertório",
      "Mais organização para oportunidades extracurriculares",
      "Rede de informações acessível e direta",
    ],
    qrCode: {
      src: "/QRCLEV.png",
      title: "Grupo oficial da CLEV",
      caption: "Escaneie o QR Code para entrar no grupo do WhatsApp e receber informações sobre eventos e vivências.",
    },
  },
};

export const coordinatorCards = Object.values(coordinatorProfiles).map((profile) => ({
  slug: profile.slug,
  shortName: profile.shortName,
  title: profile.subtitle,
  summary: profile.summary,
  imageSrc: profile.imageSrc,
  accent: profile.accent,
}));
