"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "../customFormField";
import SubmitButton from "../submitButton";
import { use, useState } from "react";
import {  getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import { createAppointment } from "@/lib/actions/appointment.action";

export enum formFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  SELECT = "select",
  DATE_PICKER = "datePicker",
  PHONE_INPUT = "phoneInput",
  SKELETON = "skeleton",
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();
  const AppointmentFormValidation = getAppointmentSchema(type)
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      note: "",
      reason: "",
      cancellationReason: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  let status: "pending" | "cancelled" | "scheduled";
  switch (type) {
    case "create":
      status = "pending";
      break;
    case "cancel":
      status = "cancelled";
      break;
    default:
      status = "scheduled";
      break;
  }

  let buttonLabel;

  switch (type) {
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    default:
      buttonLabel = "Schedule Appointment";
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="Header"> New appointment</h1>
          <p className="text-dark-700"> Enter your details to get started</p>
        </section>

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={formFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
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
            <CustomFormField
              fieldType={formFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Select a date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            ></CustomFormField>
            <div className="flex flex-col gap-6">
              <CustomFormField
                fieldType={formFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              ></CustomFormField>
              <CustomFormField
                fieldType={formFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
              ></CustomFormField>
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={formFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter cancellation reason"
          ></CustomFormField>
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
