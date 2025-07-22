'use client';
import LandingPage from "./Components/landingPage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <LandingPage 
        onGetStarted={() => {
          router.push('/auth');
        }} 
      />
    </>
  );
}