import React from 'react'
import { useState } from 'react';

const Request = () => {
    const [qrImage, setQRImage] = useState();
    const [qrID, setQRID] = useState();

    const generateQR = async()=>{
        const payload = {
            name: "Justice",
            email: "jataujustice200@gmail.com",
            age:21
        };

        const res = await fetch("http://localhost:5000/api/generate-qr", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(payload)
        })

        const data = await res.json()
        console.log(data)

        setQRImage(data.qr)
    }

    const checkQr = async(e)=>{
        e.preventDefault()
        
        const res = await fetch(`http://localhost:5000/api/check-qr/${qrID}`)
        const data = await res.json()
        console.log(data)
    }

    return (
    <div className='flex flex-col gap-2 justify-center items-center w-screen h-screen'>
        <div>
            <div className="grid place-items-center border border-[#ffffff] rounded-lg w-70 h-70">
                <img src={qrImage} alt="QR Code Image" />
            </div>
            <button
                onClick={generateQR}
                className='flex justify-center items-center bg-[#0077ff] text-[#ffffff] p-4 rounded-lg'
            >
                Generate QR
            </button>
        </div>
        <form onSubmit={checkQr} className='flex'>
            <input 
                type="text" 
                name="qr_id"
                placeholder='Enter QR id to check'
                value={qrID}
                onChange={(e) => setQRID(e.target.value)}
                className="w-full bg-[#051837] border border-[#12315D] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1678FF]"
            />
            <button className='flex justify-center items-center bg-[#0077ff] text-[#ffffff] p-4 rounded-lg'>Check QR</button>
        </form>
    </div>
    )
}

export default Request
