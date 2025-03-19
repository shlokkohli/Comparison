'use client'
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

interface usernameType {
  femaleUserName : string
}

const FemaleCard = ({ femaleUserName } : usernameType) => {

  return (
    <div>
      <IKImage urlEndpoint={urlEndpoint} path={`/Female/${femaleUserName}`} height={350} width={300} alt="Alt text" />
    </div>
  )
}

export default FemaleCard