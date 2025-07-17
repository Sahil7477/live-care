import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/patientForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";


export default async function NewAppointment({params:{userId}}:SearchParamProps) {
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen min-h-screen">
      
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-icon.svg"
            height={1000}
            width={1000}
            alt="LiveCare"
            className="mb-12 h-10 w-fit"
            unoptimized
          />

          <AppointmentForm 
          type='create'
          userId={userId}
          patientId={patient.$id}
          />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 LiveCare. All rights reserved.
            </p>
           
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
