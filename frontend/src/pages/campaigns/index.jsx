import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

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
  { id: 5, name: "Nenhum" },
];

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [modelName, setModelName] = useState("");
  const [templateText, setTemplateText] = useState("");
  const [chosenSectors, setChosenSectors] = useState([]);
  const [campaignDate, setCampaignDate] = useState("");
  const [linkPhishing, setLinkPhishing] = useState("");
  const [emailtext, setEmailText] = useState("");

  const handleClear = () => {
    setSelectedModel("");
    setSelectedSector("");
    setModelName("");
    setTemplateText("");
    setChosenSectors([]);
    setCampaignDate("");
    setLinkPhishing("");
    setEmailText("");
  };

  const handleAddSector = () => {
    if (selectedSector && !chosenSectors.includes(selectedSector)) {
      setChosenSectors([...chosenSectors, selectedSector]);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Criação de Campanhas
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Crie novas campanhas.
        </p>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-4">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <Field>
              <FieldLabel>Data da Camapanha</FieldLabel>
              <Input
                value={campaignDate}
                onChange={(e) => setCampaignDate(e.target.value)}
                className="h-9"
              />
            </Field>

            <Field>
              <FieldLabel>Modelo</FieldLabel>
              <SelectField value={selectedModel} onChange={setSelectedModel} options={MODELS} placeholder="Nenhum modelo selecionado" />
            </Field>

            <div className="flex items-end gap-3">
              <Field className="flex-1">
                <FieldLabel>Adicionar Setor Destino</FieldLabel>
                <SelectField
                  value={selectedSector}
                  onChange={setSelectedSector}
                  options={SECTORS}
                  placeholder="Nenhum setor selecionado"
                />
              </Field>

              <Button
                type="button"
                variant="create"
                size="lg"
                className="size-10 "
                onClick={handleAddSector}
              >
                +
              </Button>
            </div>

            <Field>
              <FishPlaceholder />
            </Field>

          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Field>
              <FieldLabel>Setor(es) escolhidos</FieldLabel>
              <Input
                value={chosenSectors.join(', ')}
                readOnly
                className="h-9 bg-slate-100 text-slate-500"
              />
            </Field>
          </section>

          <section className="grid gap-4 md:grid-cols- xl:grid-cols-1
          ">
            <Field>
              <FieldLabel>Link Phising</FieldLabel>
              <div className="flex gap-2 justify-end">
                <Input
                  value={linkPhishing}
                  onChange={(e) => setLinkPhishing(e.target.value)}
                  className="h-9 flex-1"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="default"
                  className="bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-400/40 h-9"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  Anexo
                </Button>
              </div>
            </Field>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Field>
              <FieldLabel>Texto</FieldLabel>
              <Textarea
                value={emailtext}
                onChange={(e) => setEmailText(e.target.value)}
                className="h-32"
              />
            </Field>
          </section>

        </CardContent>
      </Card>
    </div >
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


