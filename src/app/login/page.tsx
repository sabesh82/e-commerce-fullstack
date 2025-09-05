import React from "react";
import login from "../../../public/login.jpg";
import Image from "next/image";
import LoginForm from "./LoginForm";

const page = () => {
  return (
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/*left side*/}
      <div className="p-2">
        <Image
          src={login}
          alt=""
          className="h-170 w-full rounded-2xl hidden sm:block object-cover"
        ></Image>
      </div>
      {/*right side*/}
      <div className="w-full p-2.5">
        <div className="mt-28 w-full">
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default page;
