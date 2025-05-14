"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../customFormField";
import SubmitButton from "../submitButton";
import { use, useState } from "react";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { formFieldType } from "./patientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../fileUploader";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

let formData;
if (values.identificationDocument && values.identificationDocument.length > 0){
  const blobFile = new Blob([values.identificationDocument[0]], {
    type: values.identificationDocument[0].type})
  formData = new FormData();
  formData.append('blobfile',blobFile);
  formData.append('name', values.identificationDocument[0].name)

};

    try {
      const patientData = {
        ...values,
        userId:user.$id,
        identificationDocument: formData,
        birthDate: new Date(values.birthDate)
      }
      //@ts-ignore
      const patient = await registerPatient(patientData);
      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
      console.log(error);
    };

  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="Header"> Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header"> Personal Information </h2>
          </div>

          <CustomFormField
            fieldType={formFieldType.INPUT}
            control={form.control}
            name="name"
            label="Patient name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            placeholder="Enter your full name"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
              placeholder="Enter your email address"
            />
            <CustomFormField
              fieldType={formFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="+91 123 456 7890"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.DATE_PICKER}
              control={form.control}
              name="birthdate"
              label="Date of birth"
            />
            <CustomFormField
              fieldType={formFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-12 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
            />
            <CustomFormField
              fieldType={formFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />
            <CustomFormField
              fieldType={formFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(555) 123-4567"
            />
          </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header"> Medical Information </h2>
            </div>
          </section>
          <CustomFormField
            fieldType={formFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select your physician"
          >
            {Doctors.map((doctor) => (
              <SelectItem
                key={doctor.name}
                value={doctor.name}
                className="bg-dark-400 hover:bg-dark-500 text-white"
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={32}
                    height={32}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={formFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Enter your insurance provider"
          />
          <CustomFormField
            fieldType={formFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC1234567890"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={formFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />

          <CustomFormField
            fieldType={formFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medications"
            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={formFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label=" Family medical history (if relevant)"
            placeholder="Mother had brain cancer, Father has hypertension"
          />

          <CustomFormField
            fieldType={formFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.SELECT}
              control={form.control}
              name="identificationType"
              label="Identification Type"
              placeholder="Select Identification Type"
            >
              {IdentificationTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="bg-dark-400 hover:bg-dark-500 text-white"
                >
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={formFieldType.INPUT}
              control={form.control}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned Copy of Identification Document"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </div>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and privacy</h2>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={formFieldType.CHECKBOX}
              control={form.control}
              name="treatmentConsent"
              label="I consent to treatment"
            />
            <CustomFormField
              fieldType={formFieldType.CHECKBOX}
              control={form.control}
              name="disclosureConsent"
              label=" I consent to the disclosure of my medical information"
            />
            <CustomFormField
              fieldType={formFieldType.CHECKBOX}
              control={form.control}
              name="privacyConsent"
              label="I consent to the privacy policy"
            />
          </div>
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
