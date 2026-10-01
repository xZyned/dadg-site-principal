export const TOPIC_OPTIONS = [
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "problemas da turma", label: "Problemas da turma" },
  {
    value: "problemas com a coordenação",
    label: "Problemas com a coordenação",
  },
  {
    value: "problemas com os professores",
    label: "Problemas com os professores",
  },
  { value: "certificados", label: "Certificados" },
] as const;
export const TOPICS = new Set<string>(
  TOPIC_OPTIONS.map((topic) => topic.value),
);
