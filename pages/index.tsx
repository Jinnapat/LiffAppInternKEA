import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import styles from "../styles/Home.module.css";

const Home: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
  liffError
}) => {
  const data = liff?.getDecodedIDToken()

  if (liffError) return <code>{liffError}</code>
  if (!liff) return <div>loading...</div>

  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {data?.picture ? <Image src={data.picture} alt="Profile Picture"/> : <i>No Profile Picture</i>}
        <i>{data?.name ? data.name : "No username"}</i>
        <i>{data?.email ? data.email : "No email"}</i>
      </div>
    </div>
  );
};

export default Home;
