import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'
 
type ResponseData = {
  message: string
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_KEY as string);

function epochToJsDate(timestamp: any){
  return new Date(timestamp*1000).toISOString();
}

async function insertData( req_data: any ) {
  const { data, error } = await supabase
        .from('transactions')
        .insert([
          { 
            block: req_data.block, 
            tx_timestamp: req_data.tx_timestamp,
            tx_id: req_data.tx_id,
            sender: req_data.sender,
            recipient: req_data.recipient,
            amount: req_data.amount,
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

    const req_data = (
      {
        block: req.body.apply[0].block_identifier.index,
        tx_timestamp: epochToJsDate(req.body.apply[0].timestamp),
        tx_id: req.body.apply[0].transactions[0].transaction_identifier.hash,
        success: req.body.apply[0].transactions[0].metadata.success, //only insert if true
        sender: req.body.apply[0].transactions[0].metadata.receipt.events[0].data.sender,
        recipient: req.body.apply[0].transactions[0].metadata.receipt.events[0].data.recipient,
        amount: req.body.apply[0].transactions[0].metadata.receipt.events[0].data.amount,
      }
    )
    
    if (req_data.success = true && req_data.amount >= 10000000000) {
      insertData(req_data)
    } else {
      console.log("Transaction failed or did not meet threshold")
    }
   
    res.status(200).json({ message: 'Hello from Next.js!' })
  }
}

