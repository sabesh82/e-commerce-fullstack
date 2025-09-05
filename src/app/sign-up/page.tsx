import React from "react";
import register from "../../../public/register.jpg";
import Image from "next/image";
import RegisterForm from "./RegisterForm";

const page = () => {
  return (
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/*left side*/}
      <div className="p-2">
        <Image
          src={register}
          alt=""
          className="h-170 w-full rounded-2xl hidden sm:block object-cover"
        ></Image>
      </div>
      {/*right side*/}
      <div className="w-full p-2.5">
        <div className="mt-16 w-full">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default page;
