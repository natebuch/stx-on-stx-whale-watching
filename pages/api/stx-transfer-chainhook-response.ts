import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    responseLimit: false,
  },
}

type ResponseData = {
  message: string
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_KEY as string);

function epochToJsDate(timestamp: any){
  return new Date(timestamp*1000).toISOString();
}

async function insertData( req_data: any ) {
  const { data, error } = await supabase
        .from('raw_transactions')
        .insert([
          { 
            transaction_data: req_data
          }
        ])
        .select()
  if (error) {
    console.error('Error inserting data:', error);
    return;
  }  
  console.log(data)
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) 
{
  if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
    }
  {
    insertData(req.body)
    res.status(200).json({ message: 'Hello from Next.js!' })
  }
}

