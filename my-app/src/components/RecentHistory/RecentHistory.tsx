"use client";
import React from 'react';
import { HistoryElem } from "@/types/history";
import Link from "next/link";

interface RecentHistoryProps {
    elems: HistoryElem[];
    setItem?:(item:HistoryElem)=>void,
    withLinks?:boolean
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ elems,setItem,withLinks }) => {
    console.log('elems:',elems);
    const Component=(elem:HistoryElem)=>(  <div key={elem.id} onClick={()=>{
        if(setItem) setItem(elem)
    }} className="bg-white cursor-pointer shadow-lg rounded-lg p-4 flex flex-col items-center">
        <img
            src={elem.url}
            alt={elem.body.name}
            className="w-[250px] h-[250px] object-cover rounded-lg"
        />
        <h3 className="mt-2 text-lg font-semibold">{ elem.body.name || "No Pokemon"}</h3>
    </div>)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {elems.map((elem) => {
                return (
                    <div key={elem.id}>
                        {withLinks ? <Link href={`/pokemons/${elem.id}`}>
                            <Component {...elem} />
                        </Link>:<Component {...elem} />}
                    </div>
                );
            })}
        </div>
    );
};

export default RecentHistory;
