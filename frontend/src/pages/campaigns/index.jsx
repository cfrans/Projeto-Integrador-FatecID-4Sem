import { useState } from "react";
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
        <h1 className="text-2xl font-bold text-slate-900">
          Criação de Campanhas
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Crie novas campanhas.
        </p>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white py-5 shadow-lg shadow-slate-900/10">
        <CardContent className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <Field>
              <FieldLabel>Data da Camapanha</FieldLabel>
              <Input
                value=""
                readOnly
                className="h-9 bg-slate-100 text-slate-500"
              />
            </Field>

            <Field>
              <FieldLabel>Modelo</FieldLabel>
              <SelectField value={selectedModel} onChange={setSelectedModel} options={MODELS} placeholder="Nenhum modelo selecionado" />
            </Field>


          </section>
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