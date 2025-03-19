'use client'
import axios from "axios";
import MaleCard from "./Components/MaleCard";
import { useEffect, useState } from "react";
import FemaleCard from "./Components/FemaleCard";
import Link from "next/link";

export default function Home() {

  const [names, setNames] = useState({ maleName: '', femaleName: ''});
  const [currentPairID, setCurrentPairID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  const handleVote = async (vote : number) => {

    if(voteCount === 25){
      return;
    }

    setIsLoading(true)

    try {

      const response = await axios.post(`/api/submitVote/${currentPairID}`, { vote });

      // first submit the vote, then fetch a new pair if vote submitted successfully
      if(response.status === 200){
        setVoteCount((prev) => prev + 1)
        await fetchPair();
      }
      
    } catch (error : any) {

        console.log("this is the error: ", error.response.data.error)
      
    } finally {
      setIsLoading(false);
    }

  }

  // fetch new pairs
  const fetchPair = async () => {

    try {

      const response = await axios.post(`/api/getPair`)
      const data = response.data.pair

      const femaleName = data.femaleID.name;
      const maleName = data.maleID.name;

      setNames({ maleName, femaleName })
      setCurrentPairID(data._id)
      
    } catch (error) {
      console.log("This is the fetch error: ", error)
    }

  }

  useEffect(() => {
    fetchPair();
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-10 pb-32">

      <div className="flex gap-20">
        <MaleCard maleUserName={names.maleName} />
        <FemaleCard femaleUserName={names.femaleName} />
      </div>
      
      <div className="flex gap-4 mt-4">

          <button
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => handleVote(0)}
            disabled={isLoading}
          >
            Pass
          </button>

          <button
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={() => handleVote(1)}
            disabled={isLoading}
          >
            Smash
          </button>

      </div>
    </div>
  );
}