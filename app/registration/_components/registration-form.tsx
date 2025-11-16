"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import Combobox from "@/components/form/combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ONGOING } from "@/constants/event";
import {
  COUNTRIES,
  DIETARY_RESTRICTIONS,
  FIELDS_OF_STUDY,
  GENDERS,
  LEVELS_OF_STUDY,
  RACES,
  SCHOOLS,
  TSHIRT_SIZES,
} from "@/constants/user";
import Event from "@/types/event";
import type User from "@/types/user";

import useRegistrationForm from "../_hooks/use-registration-form";

type RegistrationFormProps = {
  userId: User["id"];
  eventState: Event["state"];
};

export default function RegistrationForm({ userId, eventState }: RegistrationFormProps) {
  const { control, handleSubmit, reset, onSubmit, isSubmitting } = useRegistrationForm(userId, eventState);

  return (
    <Card className="bg-[#fefefe] rounded-2xl shadow-md">
      <CardContent>
        <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet disabled={isSubmitting}>
              <FieldLegend className="w-full text-start">Personal Information</FieldLegend>
              <FieldDescription className="w-full text-start">Tell us about yourself</FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          First Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Enter your first name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="given-name"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Last Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Enter your last name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="family-name"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Enter your email"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="age"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Age
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Enter your age"
                          aria-invalid={fieldState.invalid}
                          type="number"
                          min={0}
                          max={99}
                          step={1}
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Phone
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your phone number"
                          autoComplete="tel"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="country"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Country
                      </FieldLabel>
                      <Combobox
                        field={field}
                        fieldState={fieldState}
                        options={COUNTRIES}
                        placeholder="Select your home country"
                        searchPlaceholder="Search countries..."
                        emptyText="No country found."
                        minSearchLength={2}
                        maxResults={50}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet disabled={isSubmitting}>
              <FieldLegend className="w-full text-start">Education</FieldLegend>
              <FieldDescription className="w-full text-start">Tell us about your academic background</FieldDescription>
              <FieldGroup>
                <Controller
                  name="school"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        School
                      </FieldLabel>
                      <Combobox
                        field={field}
                        fieldState={fieldState}
                        options={SCHOOLS}
                        placeholder="Select your school"
                        searchPlaceholder="Search schools..."
                        emptyText="No school found."
                        minSearchLength={3}
                        maxResults={30}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="level_of_study"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Level of Study
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select your level of study" defaultValue={field.value} />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                          {LEVELS_OF_STUDY.map((levelOfStudy) => (
                            <SelectItem key={levelOfStudy} value={levelOfStudy}>
                              {levelOfStudy}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="field_of_study"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Field of Study
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select your field of study" />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                          {FIELDS_OF_STUDY.map((fieldOfStudy) => (
                            <SelectItem key={fieldOfStudy} value={fieldOfStudy}>
                              {fieldOfStudy}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet disabled={isSubmitting}>
              <FieldLegend className="w-full text-start">Hacker Profile</FieldLegend>
              <FieldDescription className="w-full text-start">Help us personalize your experience</FieldDescription>
              <FieldGroup>
                <Controller
                  name="github_username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Github Username
                      </FieldLabel>
                      <FieldDescription className="w-full text-start">
                        Please enter what you use to login to your Github account
                      </FieldDescription>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your Github username"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="tshirt_size"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        T-shirt Size
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select your t-shirt size" />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                          {TSHIRT_SIZES.map((tshirtSize) => (
                            <SelectItem key={tshirtSize} value={tshirtSize}>
                              {tshirtSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet disabled={isSubmitting}>
              <FieldLegend className="w-full text-start">Demographics and Dietary</FieldLegend>
              <FieldDescription className="w-full text-start">Help us create an inclusive event</FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Gender
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent className="w-[var(--radix-select-trigger-width)]">
                            {GENDERS.map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="race"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Racial/Ethnic Background
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select your racial/ethnic background" />
                          </SelectTrigger>
                          <SelectContent className="w-[var(--radix-select-trigger-width)]">
                            {RACES.map((race) => (
                              <SelectItem key={race} value={race}>
                                {race}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="dietary_restrictions"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Dietary Restrictions
                      </FieldLabel>
                      <MultiSelect values={field.value} onValuesChange={field.onChange}>
                        <MultiSelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                          <MultiSelectValue placeholder="Select all of your dietary restrictions" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                          <MultiSelectGroup>
                            {DIETARY_RESTRICTIONS.map((dietary_restriction) => (
                              <MultiSelectItem key={dietary_restriction} value={dietary_restriction}>
                                {dietary_restriction}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectGroup>
                        </MultiSelectContent>
                      </MultiSelect>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="other_dietary_restrictions"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Other Dietary Restrictions</FieldLabel>
                      <FieldDescription className="w-full text-start">
                        If you selected &quot;Other&quot;, please specify below
                      </FieldDescription>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your other dietary restrictions"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {eventState === ONGOING && (
              <>
                <FieldSet disabled={isSubmitting}>
                  <FieldLegend className="w-full text-start">Late Registration</FieldLegend>
                  <FieldGroup>
                    <Controller
                      name="permission_code"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Permission Code</FieldLabel>
                          <FieldDescription className="w-full text-start">
                            If you missed the initial registration deadline, please enter your provided permission code
                          </FieldDescription>
                          <Input
                            {...field}
                            id={field.name}
                            placeholder="Enter your permission code"
                            aria-invalid={fieldState.invalid}
                            autoComplete="given-name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} className="w-full text-start" />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />
              </>
            )}

            <FieldSet disabled={isSubmitting}>
              <FieldLegend className="w-full text-start">MLH Agreements</FieldLegend>
              <FieldDescription className="w-full text-start">Required agreements for participation</FieldDescription>
              <FieldGroup>
                <Controller
                  name="mlh_code_of_conduct"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldContent>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          MLH Code of Conduct
                        </FieldLabel>
                        <FieldDescription className="w-full text-start">
                          I agree to the{" "}
                          <a
                            href="https://mlh.io/code-of-conduct"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-primary"
                          >
                            MLH Code of Conduct
                          </a>
                        </FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  name="mlh_privacy_policy"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldContent>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          MLH Privacy Policy
                        </FieldLabel>
                        <FieldDescription className="w-full text-start">
                          I have read and agree to the{" "}
                          <a
                            href="https://mlh.io/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-primary"
                          >
                            MLH Privacy Policy
                          </a>
                        </FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  name="mlh_marketing"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>MLH Email Communications</FieldLabel>
                        <FieldDescription className="w-full text-start">
                          I authorize MLH to send me occasional emails about relevant events and opportunities
                        </FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex-row-reverse">
          <Button type="submit" form="registration-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 /> : "Submit"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
