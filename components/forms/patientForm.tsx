"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import CustomFormField from "../customFormField"
import SubmitButton from "../submitButton"
import { use, useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions"

export enum formFieldType {
    INPUT='input',
    CHECKBOX='checkbox',
    TEXTAREA='textarea',
    SELECT='select',
    DATE_PICKER='datePicker',
    PHONE_INPUT='phoneInput',
    SKELETON='skeleton',

} 

 
const PatientForm=()=> {
  const router = useRouter()
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const user = await createUser({ name, email, phone });
      console.log("Created user:", user);
      if (user && user.$id) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="Header"> HI There 👋</h1>
            <p className="text-dark-700">Start booking your first appointment</p>

        </section>
        <CustomFormField
        fieldType={formFieldType.INPUT}
        control={form.control}
        name="name"
        label='Full Name'
        iconSrc='/assets/icons/user.svg'
        iconAlt='user'
        placeholder='Enter your full name'
        />
 
        <CustomFormField
        fieldType={formFieldType.INPUT}
        control={form.control}
        name="email"
        label='Email'
        iconSrc='/assets/icons/email.svg'
        iconAlt='email'
        placeholder='Enter your email address'
        />
        <CustomFormField
        fieldType={formFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label='Phone number'
        
        placeholder='+91 123 456 7890'
        />
 
      <SubmitButton  isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default PatientForm