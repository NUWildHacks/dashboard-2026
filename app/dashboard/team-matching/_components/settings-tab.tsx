"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { TeamMatchingSettings } from "@/types";

import { saveSettings } from "../_actions/save-settings.actions";

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

const HARD_CONSTRAINTS: {
  key: "enforce_mutual_requirement" | "enforce_tech_member";
  label: string;
  description: string;
}[] = [
  {
    key: "enforce_mutual_requirement",
    label: "Enforce mutual teammate requirements",
    description: "Participants who mutually listed each other are guaranteed to be on the same team.",
  },
  {
    key: "enforce_tech_member",
    label: "Require at least 1 technical member per team",
    description:
      "Every team must have a Frontend, Backend, Full Stack, or Mobile engineer. Teams are repaired if possible; a warning is shown if not.",
  },
];

export const SettingsTab = ({ settings }: { settings: TeamMatchingSettings }) => {
  const [hardConstraints, setHardConstraints] = useState({
    enforce_mutual_requirement: settings.enforce_mutual_requirement,
    enforce_tech_member: settings.enforce_tech_member ?? true,
  });
  const [weights, setWeights] = useState<Record<WeightKey, number>>(
    Object.fromEntries(WEIGHT_KEYS.map((k) => [k, settings[k]])) as Record<WeightKey, number>
  );
  const [whereToMeet, setWhereToMeet] = useState(settings.where_to_meet);
  const [saving, setSaving] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const totalOk = Math.abs(total - 1.0) <= 0.01;

  const handleSave = async () => {
    if (!totalOk) {
      toast.error("Weights must sum to 1.0", { description: `Current sum: ${total.toFixed(3)}` });
      return;
    }
    setSaving(true);
    const result = await saveSettings({
      ...settings,
      ...hardConstraints,
      ...weights,
      where_to_meet: whereToMeet,
    });
    setSaving(false);
    if (result.success) toast.success("Settings saved");
    else toast.error("Failed to save", { description: result.error });
  };

  return (
    <div className="flex flex-col gap-8 max-w-lg">
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

      {/* Hard constraints */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium">Hard constraints</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strictly enforced during team formation. Violations are repaired or flagged as warnings.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {HARD_CONSTRAINTS.map(({ key, label, description }) => (
            <div key={key} className="flex items-start gap-3">
              <Checkbox
                id={key}
                checked={hardConstraints[key]}
                onCheckedChange={(checked) => setHardConstraints((prev) => ({ ...prev, [key]: !!checked }))}
                className="mt-0.5"
              />
              <label htmlFor={key} className="flex flex-col gap-0.5 cursor-pointer">
                <span className="text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Soft constraint weights */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Soft constraint weights</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Must sum to 1.0. Higher weight = stronger influence on team scoring.
            </p>
          </div>
          <span className={`text-xs font-mono ${totalOk ? "text-muted-foreground" : "text-destructive"}`}>
            sum = {total.toFixed(3)}
          </span>
        </div>

        {WEIGHT_KEYS.map((key) => (
          <div key={key} className="grid grid-cols-[1fr_2fr_auto] items-center gap-3">
            <span className="text-sm text-muted-foreground">{WEIGHT_LABELS[key]}</span>
            <Slider
              min={0}
              max={1}
              step={0.025}
              value={[weights[key]]}
              onValueChange={([v]) => setWeights((prev) => ({ ...prev, [key]: v }))}
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
