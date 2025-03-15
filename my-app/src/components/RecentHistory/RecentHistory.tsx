"use client";
import React from 'react';
import { HistoryElem } from "@/types/history";
import Link from "next/link";

interface RecentHistoryProps {
    elems: HistoryElem[];
    setItem?: (item: HistoryElem) => void,
    withLinks?: boolean
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ elems, setItem, withLinks }) => {
    console.log('elems:', elems);
    const Component = (elem: HistoryElem) => (<div key={elem.id} onClick={() => {
        if (setItem) setItem(elem)
    }} className="bg-violet-950 h-[300px] cursor-pointer shadow-lg rounded-lg p-4 flex flex-col items-center">
        <img
            src={elem.url}
            alt={elem.body.name}
            className=" !h-[300px] !w-[300] h-full  object-cover rounded-lg"
        />

    </div>)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10 p-4">
            {elems.map((elem) => {
                return (
                    <div key={elem.id}>
                        {withLinks ? <Link href={`/pokemons/${elem.id}`}>
                            <Component {...elem} />
                        </Link> : <Component {...elem} />}
                        <div className='text-violet-100 my-[5]' > {elem.body.pokedex_code}</div>
                        <h3 className="mt-2 text-2xl text-violet-300 font-semibold">{elem.body.name || "No Pokemon"}</h3>

                        <div className='bg-violet-300 text-violet-950 rounded-full py-1 px-3 my-1 w-max  text-sm capitalize'>{elem.body.type}</div>

                    </div>
                );
            })}
        </div>
    );
};

export default RecentHistory;
