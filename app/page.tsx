"use client";
import { useMemo, useState } from "react";
import { STATUS_OPTIONS, VideoItem, emptyVideo, templateScript } from "@/lib/types";

const STORAGE_KEY = "cybertok_planner_v1";

const load = (): VideoItem[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as VideoItem[]; } catch { return []; }
};
const save = (items: VideoItem[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const csvEscape = (v: string) => `"${(v || "").replaceAll("\"", "\"\"")}"`;

export default function HomePage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [draft, setDraft] = useState<VideoItem>(emptyVideo());
  const [editId, setEditId] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [busqueda, setBusqueda] = useState("");

  useState(() => { setVideos(load()); return undefined; });

  const persist = (next: VideoItem[]) => { setVideos(next); save(next); };

  const visible = useMemo(() => videos.filter(v => (filtroEstado === "Todos" || v.estado === filtroEstado) && v.tema.toLowerCase().includes(busqueda.toLowerCase())), [videos, filtroEstado, busqueda]);

  const submit = () => {
    if (!draft.tema.trim()) return alert("El tema es obligatorio");
    if (editId) {
      persist(videos.map(v => v.id === editId ? { ...draft, id: editId } : v));
      setEditId(null);
    } else {
      persist([{ ...draft, id: crypto.randomUUID() }, ...videos]);
    }
    setDraft(emptyVideo());
  };

  const edit = (v: VideoItem) => { setDraft(v); setEditId(v.id); };
  const remove = (id: string) => persist(videos.filter(v => v.id !== id));

  const createFromTemplate = () => setDraft({ ...emptyVideo(), guionCorto: templateScript });

  const exportCSV = () => {
    const header = ["fechaPublicacion","tema","publicoObjetivo","ganchoInicial","guionCorto","ejemploPractico","llamadaAccion","estado","notas"];
    const rows = videos.map(v => header.map(h => csvEscape((v as Record<string,string>)[h])).join(","));
    const content = [header.join(","), ...rows].join("\n");
    downloadFile("cybertok-planner.csv", "text/csv;charset=utf-8;", content);
  };

  const exportMD = () => {
    const content = videos.map(v => `## ${v.tema}\n- Fecha: ${v.fechaPublicacion || "-"}\n- Público objetivo: ${v.publicoObjetivo}\n- Estado: ${v.estado}\n\n**Gancho inicial**\n${v.ganchoInicial}\n\n**Guion corto**\n${v.guionCorto}\n\n**Ejemplo práctico**\n${v.ejemploPractico}\n\n**Llamada a la acción**\n${v.llamadaAccion}\n\n**Notas**\n${v.notas}\n`).join("\n");
    downloadFile("cybertok-planner.md", "text/markdown;charset=utf-8;", content || "# CyberTok Planner\n");
  };

  return (
    <main className="container grid" style={{ gap: 16 }}>
      <h1>CyberTok Planner</h1>
      <div className="card grid">
        <h2>{editId ? "Editar video" : "Nuevo video"}</h2>
        <div className="grid grid-2">
          <Input label="Fecha de publicación" type="date" value={draft.fechaPublicacion} onChange={v => setDraft({ ...draft, fechaPublicacion: v })} />
          <Input label="Tema" value={draft.tema} onChange={v => setDraft({ ...draft, tema: v })} />
          <Input label="Público objetivo" value={draft.publicoObjetivo} onChange={v => setDraft({ ...draft, publicoObjetivo: v })} />
          <Input label="Gancho inicial" value={draft.ganchoInicial} onChange={v => setDraft({ ...draft, ganchoInicial: v })} />
          <Select label="Estado" value={draft.estado} onChange={v => setDraft({ ...draft, estado: v as VideoItem["estado"] })} options={STATUS_OPTIONS} />
          <Input label="Llamada a la acción" value={draft.llamadaAccion} onChange={v => setDraft({ ...draft, llamadaAccion: v })} />
        </div>
        <InputArea label="Guion corto" value={draft.guionCorto} onChange={v => setDraft({ ...draft, guionCorto: v })} />
        <InputArea label="Ejemplo práctico" value={draft.ejemploPractico} onChange={v => setDraft({ ...draft, ejemploPractico: v })} />
        <InputArea label="Notas" value={draft.notas} onChange={v => setDraft({ ...draft, notas: v })} />
        <div className="row">
          <button onClick={submit}>{editId ? "Guardar cambios" : "Crear video"}</button>
          <button className="ghost" onClick={createFromTemplate}>Crear desde plantilla</button>
          <button className="secondary" onClick={() => { setDraft(emptyVideo()); setEditId(null); }}>Limpiar</button>
        </div>
      </div>

      <div className="card grid">
        <h2>Ideas de videos</h2>
        <div className="grid grid-2">
          <Select label="Filtro por estado" value={filtroEstado} onChange={setFiltroEstado} options={["Todos", ...STATUS_OPTIONS]} />
          <Input label="Buscar por tema" value={busqueda} onChange={setBusqueda} />
        </div>
        <div className="row">
          <button className="ghost" onClick={exportCSV}>Exportar a CSV</button>
          <button className="ghost" onClick={exportMD}>Exportar a Markdown</button>
        </div>
        <table className="table">
          <thead><tr><th>Fecha</th><th>Tema</th><th>Estado</th><th>Guion</th><th>Acciones</th></tr></thead>
          <tbody>
            {visible.map(v => (
              <tr key={v.id}>
                <td>{v.fechaPublicacion || "-"}</td>
                <td><strong>{v.tema}</strong><div className="small">{v.publicoObjetivo}</div></td>
                <td><span className="tag">{v.estado}</span></td>
                <td>{v.guionCorto.slice(0, 80)}{v.guionCorto.length > 80 ? "..." : ""}</td>
                <td><div className="row"><button className="secondary" onClick={() => edit(v)}>Editar</button><button className="danger" onClick={() => remove(v.id)}>Eliminar</button></div></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={5}>No hay videos para mostrar.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function downloadFile(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string; }) {
  return <label>{label}<input type={type} value={value} onChange={e => onChange(e.target.value)} /></label>;
}
function InputArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void; }) {
  return <label>{label}<textarea value={value} onChange={e => onChange(e.target.value)} /></label>;
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; }) {
  return <label>{label}<select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></label>;
}
