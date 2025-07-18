import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.action";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-icon.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit mb-6"
          ></Image>
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={200}
            alt="success"
          ></Image>
        </section>

        <h2 className="header mb-6 max-w-[600px] text-center">
          Your <span className="text-green-500">appointment request</span> has
          been successfully created.
        </h2>
        <p>we will be in touch shortly to confirm</p>

        <section className="request-details">
          <p>requested appointment details: </p>
          <div className="flex item-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              height={100}
              width={100}
              className="size-6"
            ></Image>
            <p className="whitespace-nowrap">DR.{doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            ></Image>
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright"> © 2024 LiveCare. All rights reserved.</p>
      </div>
    </div>
  );
};

export default success;
