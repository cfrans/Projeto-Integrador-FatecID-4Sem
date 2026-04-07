import { useState } from "react";
import {
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MODELS = [
  { name: "Alerta de Senha Expirada" },
  { id: 2, name: "Verificacao de Conta Bancaria" },
  { id: 3, name: "Atualizacao de Cadastro RH" },
];

const SECTORS = [
  { id: 1, name: "Financeiro" },
  { id: 2, name: "TI" },
  { id: 3, name: "RH" },
  { id: 4, name: "Comercial" },
];

const TEXT_AREA_CLASS =
  "min-h-[230px] w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition-colors resize-y focus:border-teal-700 focus:ring-2 focus:ring-teal-300/30";

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [modelName, setModelName] = useState("");
  const [templateText, setTemplateText] = useState("");

  const handleClear = () => {
    setSelectedModel("");
    setSelectedSector("");
    setModelName("");
    setTemplateText("");
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Criacao e Edicao de Modelos</h1>
        <p className="mt-1 text-sm text-slate-600">Gerencie modelos de campanhas por setor e mantenha historico de versoes.</p>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field>
              <FieldLabel>Modelo</FieldLabel>
              <SelectField value={selectedModel} onChange={setSelectedModel} options={MODELS} placeholder="Nenhum modelo selecionado" />
            </Field>

            <Field>
              <FieldLabel>Setor Destino</FieldLabel>
              <SelectField value={selectedSector} onChange={setSelectedSector} options={SECTORS} placeholder="Nenhum setor selecionado" />
            </Field>

            <Field>
              <FieldLabel>Usuario / Ultima Modificacao</FieldLabel>
              <Input value="-" readOnly className="h-9 bg-slate-100 text-slate-500" />
            </Field>

            <Field>
              <FieldLabel>Data Ultima Modificacao</FieldLabel>
              <Input value="-" readOnly className="h-9 bg-slate-100 text-slate-500" />
            </Field>
          </section>

          <Field>
            <FieldLabel>Nome do Modelo</FieldLabel>
            <Input
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              className="h-9"
              placeholder="Ex: Alerta de Seguranca - Senha Expirada"
            />
          </Field>

          <Field>
            <FieldLabel>Texto</FieldLabel>
            <div className="relative">
              <textarea
                value={templateText}
                onChange={(event) => setTemplateText(event.target.value)}
                className={TEXT_AREA_CLASS}
                placeholder=""
              />

              {!templateText && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <FishPlaceholder />
                  <span className="text-sm italic">Digite aqui seu texto modelo</span>
                </div>
              )}
            </div>
          </Field>

          <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="destructive" size="sm" onClick={handleClear}>
              <TrashIcon className="size-4" />
              Excluir
            </Button>

            <Button type="button" variant="secondary" size="sm" onClick={handleClear}>
              <XMarkIcon className="size-4" />
              Limpar
            </Button>

            <Button type="button" variant="primary" size="sm">
              <CheckIcon className="size-4" />
              Salvar
            </Button>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem key={option.name} value={String(option.name)}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FishPlaceholder() {
  return (
    <svg width="68" height="54" viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <ellipse cx="55" cy="50" rx="32" ry="22" fill="#c4d8d2" />
      <path d="M87 50C100 36 108 26 104 14C96 30 90 38 87 50Z" fill="#b2cbc4" />
      <path d="M87 50C100 64 108 74 104 86C96 70 90 62 87 50Z" fill="#b2cbc4" />
      <ellipse cx="43" cy="44" rx="5" ry="5" fill="#7eaaa0" />
      <circle cx="44" cy="43" r="2" fill="white" opacity="0.5" />
      <path d="M35 42Q30 38 28 44Q30 50 35 48" fill="#b2cbc4" />
    </svg>
  );
}