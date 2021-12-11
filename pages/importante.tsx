import React, { useState } from "react";

const url = "http://localhost:5000";

export default function Home() {
  const [outputImageUrls, setOutputImageUrls] = useState<string[]>();

  const fetchApi = async () => {
    console.log(`${url}/generateImage`);

    const response = await fetch(`${url}/generateImage`)
      .then((response) => response.blob())
      .then((imageBlob) => {
        const imageObjectUrl = URL.createObjectURL(imageBlob);

        if (outputImageUrls === undefined) {
          setOutputImageUrls([imageObjectUrl]);
        } else {
          setOutputImageUrls((currentArray) => [
            ...currentArray,
            imageObjectUrl,
          ]);
        }
      });
  };

  function generateImage_and_getImageUrl() {
    fetchApi();
  }

  return (
    <div>
      <div
        className="cursor-pointer select-none"
        onClick={generateImage_and_getImageUrl}
      >
        Get one image
      </div>

      {outputImageUrls !== undefined && (
        <div>
          {outputImageUrls.map((imageUrl, index) => {
            return <img key={index} src={imageUrl} />;
          })}
        </div>
      )}
    </div>
  );
}
