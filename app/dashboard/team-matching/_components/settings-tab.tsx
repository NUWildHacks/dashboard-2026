"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { TeamMatchingSettings } from "@/types";

import { saveSettings } from "../_actions/save-settings.actions";

type SettingsTabProps = {
  settings: TeamMatchingSettings;
};

type WeightKey = keyof Pick<
  TeamMatchingSettings,
  | "weight_role_diversity"
  | "weight_work_style"
  | "weight_skills_complementarity"
  | "weight_experience_mix"
  | "weight_gender_preference"
  | "weight_proximity"
  | "weight_size_preference"
>;

const WEIGHT_LABELS: Record<WeightKey, string> = {
  weight_role_diversity: "Role diversity",
  weight_work_style: "Work style alignment",
  weight_skills_complementarity: "Skills complementarity",
  weight_experience_mix: "Experience mix",
  weight_gender_preference: "Gender preference",
  weight_proximity: "Overnight stay alignment",
  weight_size_preference: "Team size preference",
};

const WEIGHT_KEYS: WeightKey[] = [
  "weight_role_diversity",
  "weight_work_style",
  "weight_skills_complementarity",
  "weight_experience_mix",
  "weight_gender_preference",
  "weight_proximity",
  "weight_size_preference",
];

export const SettingsTab = ({ settings }: SettingsTabProps) => {
  const [weights, setWeights] = useState<Record<WeightKey, number>>(
    Object.fromEntries(WEIGHT_KEYS.map((k) => [k, settings[k]])) as Record<WeightKey, number>
  );
  const [whereToMeet, setWhereToMeet] = useState(settings.where_to_meet);
  const [saving, setSaving] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const totalOk = Math.abs(total - 1.0) <= 0.01;

  const handleWeightChange = (key: WeightKey, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!totalOk) {
      toast.error("Weights must sum to 1.0", { description: `Current sum: ${total.toFixed(3)}` });
      return;
    }
    setSaving(true);
    const result = await saveSettings({
      ...settings,
      ...weights,
      where_to_meet: whereToMeet,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save", { description: result.error });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="where_to_meet">Where to meet</FieldLabel>
          <Input
            id="where_to_meet"
            placeholder="e.g. Ford Design Center, Room 1.330"
            value={whereToMeet}
            onChange={(e) => setWhereToMeet(e.target.value)}
          />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Scoring weights</p>
          <span className={`text-xs font-mono ${totalOk ? "text-muted-foreground" : "text-destructive"}`}>
            sum = {total.toFixed(3)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Weights must sum to 1.0.</p>

        {WEIGHT_KEYS.map((key) => (
          <div key={key} className="grid grid-cols-[1fr_2fr_auto] items-center gap-3">
            <span className="text-sm text-muted-foreground">{WEIGHT_LABELS[key]}</span>
            <Slider
              min={0}
              max={1}
              step={0.025}
              value={[weights[key]]}
              onValueChange={([v]) => handleWeightChange(key, v)}
            />
            <span className="text-sm font-mono w-10 text-right">{weights[key].toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving || !totalOk} className="w-fit">
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Save settings"}
      </Button>
    </div>
  );
};
