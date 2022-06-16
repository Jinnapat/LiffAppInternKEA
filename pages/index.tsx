import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from 'next/dynamic'
import { useState, useEffect, createContext } from "react";
import { supabase } from "../utils/supabaseClient";
import LoadPage from "../components/LoadPage";
import NoAction from "../components/NoAction";

export const liffContext = createContext<Liff | null>(null)

interface UserData {
  status: string,
  param: string
}

const MapEditorNoSSR = dynamic(
  () => import('../components/MapEditor'),
  { 
    loading: () => <LoadPage text="loading..."/>,
    ssr: false
  }
)

const Home: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
  liffError
}) => {
  const [userId, setUserId] = useState('')
  const [status, setStatus] = useState('')
  const [param, setParam] = useState('')
  const [plot, setPlot] = useState<string>('')

  useEffect(() => {
    liff?.getProfile()
    .then(async (profile) => {
      setUserId(profile.userId)
      const { data, error } = await supabase.from('users').select('status,param').eq('userId', profile.userId)
      if (error || data == null || data.length == 0) return
      const userData: UserData = data[0]
      setStatus(userData.status)
      setParam(userData.param)
      if (userData.status == "edit" || userData.status == "view") {
        const {data, error} = await supabase.from('plots').select('plot_bounds').eq('id', userData.param)
        if (error || data == null || data.length == 0) return
        setPlot(data[0].plot_bounds)
      }
    })

    
  }, [liff])

  if (liffError) return <code>{liffError}</code>
  if (!liff) return <LoadPage text="initialize..."/>
  if (userId == '' || status == '') return <LoadPage text="loading..."/>
  if (status == 'edit' && plot == '') return <LoadPage text="getting plot data..."/>
  if (status == "free") return <NoAction />
  return (
    <div>
      <Head>
        <title>KEA add plot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center gap-y-5">
        <liffContext.Provider value={liff}>
          <MapEditorNoSSR status={status} userId={userId} plot_id={param} plot={plot} setPlot={setPlot}/>
        </liffContext.Provider>
      </div>
    </div>
  );
};

export default Home;