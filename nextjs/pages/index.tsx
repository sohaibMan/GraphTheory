import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [imgLink, setImgLink] = useState("");

  useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      nodes: [2, 3, 3, 4, 3, 4, 5],
      edges: [
        [1, 2],
        [1, 3],
        [2, 4],
        [2, 5],
      ],
    });

    let requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:9091/api/graph", requestOptions)
      .then((response) => response.json())
      .then((result: { graphUrl: string }) => {
        console.log(result);
        setImgLink(result.graphUrl);
      })
      .catch((error) => console.log("error", error));
  }, []);
  const myLoader = ({ src }: { src: String }) => {
    return `${src}`;
  };

  return (
    <div className={styles.container}>
      {/* {imgLink} */}
      {imgLink && (
        <Image
          loader={myLoader}
          width="500"
          height="500"
          src={imgLink}
          alt="graph"
        />
      )}
    </div>
  );
}
