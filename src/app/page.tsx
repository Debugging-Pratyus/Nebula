"use client";

import React from "react";
import Atmosphere from "@/components/Atmosphere";
import SolarSystemExplorer from "@/components/SolarSystemExplorer";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main id="top">
        <SolarSystemExplorer />
      </main>
    </>
  );
}
