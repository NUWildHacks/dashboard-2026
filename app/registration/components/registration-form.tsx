"use client";

import { Controller } from "react-hook-form";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type User from "@/types/user";

import useRegistrationForm from "../hooks/use-registration-form";

import Combobox from "./combobox";
import DatePicker from "./date-picker";

type RegistrationFormProps = {
  userId: User["id"];
};

export default function RegistrationForm({ userId }: RegistrationFormProps) {
  const { form, onSubmit } = useRegistrationForm(userId);

  return (
    <Card className="bg-[#fefefe] rounded-2xl shadow-md">
      <CardContent>
        <form id="registration-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="w-full text-start">Personal Information</FieldLegend>
              <FieldDescription className="w-full text-start">Tell us about yourself</FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="first_name"
                    control={form.control}
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
                    control={form.control}
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
                  control={form.control}
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
                    name="date_of_birth"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Date of Birth
                        </FieldLabel>
                        <DatePicker field={field} fieldState={fieldState} placeholder="Select your date of birth" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={form.control}
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
                  control={form.control}
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

            <FieldSet>
              <FieldLegend className="w-full text-start">Education</FieldLegend>
              <FieldDescription className="w-full text-start">Tell us about your academic background</FieldDescription>
              <FieldGroup>
                <Controller
                  name="school"
                  control={form.control}
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Level of Study
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectTrigger id={field.name}>
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Field of Study
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectTrigger id={field.name}>
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

            <FieldSet>
              <FieldLegend className="w-full text-start">Hacker Profile</FieldLegend>
              <FieldDescription className="w-full text-start">Help us personalize your experience</FieldDescription>
              <FieldGroup>
                <Controller
                  name="github_username"
                  control={form.control}
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        T-shirt Size
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectTrigger id={field.name}>
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

            <FieldSet>
              <FieldLegend className="w-full text-start">Demographics and Dietary</FieldLegend>
              <FieldDescription className="w-full text-start">Help us create an inclusive event</FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Gender
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectTrigger id={field.name}>
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
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="after:content-['*'] after:ml-0.5 after:text-red-500"
                        >
                          Racial/Ethnic Background
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectTrigger id={field.name}>
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Dietary Restrictions
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder="Select all of your dietary restrictions" />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                          {DIETARY_RESTRICTIONS.map((dietaryRestriction) => (
                            <SelectItem key={dietaryRestriction} value={dietaryRestriction}>
                              {dietaryRestriction}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />

                <Controller
                  name="other_dietary_restrictions"
                  control={form.control}
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

            <FieldSet>
              <FieldLegend className="w-full text-start">MLH Agreements</FieldLegend>
              <FieldDescription className="w-full text-start">Required agreements for participation</FieldDescription>
              <FieldGroup>
                <Controller
                  name="mlh_code_of_conduct"
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
          <Button type="submit" form="registration-form">
            Submit
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
