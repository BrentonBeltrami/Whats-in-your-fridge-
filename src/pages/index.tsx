import Head from "next/head";
import { FrigdeForm } from "~/components/FridgeForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Whats in your fridge?</title>
        <meta name="description" content="Whats in your fridge?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <FrigdeForm />
      </main>
    </>
  );
}
