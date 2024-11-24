"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
const Cookies = require("js-cookie");

function Page() {
  const router = useRouter();

 
  return (
    <div className="flex  w-full diagonal-background   ">
        <div>
        <Sidebar />
        </div>
        <p>To be implemented</p>
    </div>
  );
}

export default Page;
