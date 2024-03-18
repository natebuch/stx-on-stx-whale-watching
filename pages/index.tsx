import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const inter = Inter({ subsets: ["latin"] });

interface Transaction {
  amount: number;
  sender: string;
  recipient: string;
  block: number;
  tx_id: string,
  tx_timestamp: string;
}

function shortenString(str: string, startLength = 4, endLength = 4) {
  if (str.length <= startLength + endLength) {
      // If the string is not longer than the combined lengths, return it as is.
      return str;
  }
  return `${str.substring(0, startLength)}...${str.substring(str.length - endLength)}`;
}

function convertDateTime(dateTime: any) {
  return new Date(dateTime).toString()
}

export default function Home() {
  const [allTimeData, setAllTimeData] = useState<Transaction[]>([])
  const [recentData, setRecentData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_KEY as string);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch all-time data
      const { data: allTimeData, error: allTimeError } = await supabase
        .from('transactions')
        .select('amount, sender, recipient, block, tx_id, tx_timestamp')
        .limit(10)
        .order('amount', { ascending: false });

      if (allTimeError) {
        console.error('Error fetching all-time data:', allTimeError);
      } else {
        setAllTimeData(allTimeData);
      }
      
      // Fetch recent data
      const { data: recentData, error: recentError } = await supabase
        .from('transactions')
        .select('amount, sender, recipient, block, tx_id, tx_timestamp')
        .limit(10)
        .order('id, amount', { ascending: false });

      if (recentError) {
        console.error('Error fetching recent data:', recentError);
      } else {
        setRecentData(recentData);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}
      <h1  className="text-4xl text-white-700 uppercase dark:text-white-900 p-5">
      🐳 STX on STX Whale Watching 🐳
      </h1>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">    
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h2  className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            All Time Transactions
          </h2>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 py-5">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Amount(STX)</th>
                <th scope="col" className="px-6 py-3">Sender</th>
                <th scope="col" className="px-6 py-3">Recipient</th>
                <th scope="col" className="px-6 py-3">Block(STX)</th>
                <th scope="col" className="px-6 py-3">Tx Id</th>
                <th scope="col" className="px-6 py-3">Tx Timestamp</th>
              </tr>
            </thead>
            <tbody>
                { 
                  allTimeData?.map((data, index) => (
                    <tr key={index}>
                      <td className="px-6 py-3">{data.amount/Math.pow(10,6)}</td>
                      <td className="px-6 py-3">{shortenString(data.sender)}</td>
                      <td className="px-6 py-3">{shortenString(data.recipient)}</td>
                      <td className="px-6 py-3">{data.block}</td>
                      <td className="px-6 py-3">
                          <a href={`https://explorer.hiro.so/txid/${data.tx_id}?chain=mainnet`} className="text-blue-600 hover:text-blue-800 visited:text-purple-600">
                            {shortenString(data.tx_id)}
                          </a>
                      </td>
                      <td className="px-6 py-3">{convertDateTime(data.tx_timestamp)}</td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
          <h2  className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            Recent Transactions
          </h2>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 py-5">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Amount(STX)</th>
                <th scope="col" className="px-6 py-3">Sender</th>
                <th scope="col" className="px-6 py-3">Recipient</th>
                <th scope="col" className="px-6 py-3">Block(STX)</th>
                <th scope="col" className="px-6 py-3">Tx Id</th>
                <th scope="col" className="px-6 py-3">Tx Timestamp</th>
              </tr>
            </thead>
            <tbody>
                { 
                  recentData?.map((data, index) => (
                    <tr key={index}>
                      <td className="px-6 py-3">{data.amount/Math.pow(10,6)}</td>
                      <td className="px-6 py-3">{shortenString(data.sender)}</td>
                      <td className="px-6 py-3">{shortenString(data.recipient)}</td>
                      <td className="px-6 py-3">{data.block}</td>
                      <td className="px-6 py-3">
                          <a href={`https://explorer.hiro.so/txid/${data.tx_id}?chain=mainnet`} className="text-blue-600 hover:text-blue-800 visited:text-purple-600">
                            {shortenString(data.tx_id)}
                          </a>
                      </td>
                      <td className="px-6 py-3">{convertDateTime(data.tx_timestamp)}</td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
        </div>
        
      </div>   
    </main>
  );
}
