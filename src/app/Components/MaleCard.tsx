'use client'
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

interface usernameType {
  maleUserName : string
}

const MaleCard = ({ maleUserName } : usernameType) => {

  return (
    <div>
      <IKImage urlEndpoint={urlEndpoint} path={`/Male/${maleUserName}`} height={350} width={300} alt="Alt text" />
    </div>
  )
}

export default MaleCard