export const STATUS_OPTIONS = ["Idea", "Guion listo", "Grabado", "Editado", "Publicado"] as const;

export type VideoStatus = (typeof STATUS_OPTIONS)[number];

export type VideoItem = {
  id: string;
  fechaPublicacion: string;
  tema: string;
  publicoObjetivo: string;
  ganchoInicial: string;
  guionCorto: string;
  ejemploPractico: string;
  llamadaAccion: string;
  estado: VideoStatus;
  notas: string;
};

export const emptyVideo = (): VideoItem => ({
  id: "",
  fechaPublicacion: "",
  tema: "",
  publicoObjetivo: "",
  ganchoInicial: "",
  guionCorto: "",
  ejemploPractico: "",
  llamadaAccion: "",
  estado: "Idea",
  notas: ""
});

export const templateScript = `Gancho:\n\nExplicación:\n\nEjemplo práctico:\n\nLlamada a la acción:`;
