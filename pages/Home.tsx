import React, { useState } from "react";

export default function Home(props) {
  const googleColabUrl =
    "https://colab.research.google.com/drive/1npdabuO7eq8YEsT9hLecHLLLuLAzi2f6?usp=sharing";
  const [outputImageUrl, setOutputImageUrl] = useState<string>();
  const [inputColor, setInputColor] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>();

  function generateImage_and_getImageUrl() {
    const fetchApi = async () => {
      const response = await fetch(
        `${url}/generateImage?inputColor=${inputColor}`
      ).then((response) => {
        setOutputImageUrl(response.url);
        setIsLoading(false);
      });
    };
    fetchApi();
  }

  return (
    <div className="font-serif">
      {/* título */}
      <div className="w-full text-center text-3xl font-bold pt-8">
        React Next.js ~ Google Colab
      </div>

      {/* conteúdo */}
      <div className="px-12">
        {/* descrição (cards do topo) */}
        <div className="flex justify-center py-12 ">
          {/* card da direita */}
          <div className="bg-gray-200 w-7/12 text-center mr-2 text-black text-xl p-2">
            <div className="w-full text-center font-bold mb-4">
              How to connect with Google Colab
            </div>{" "}
            <span className="pr-1">Run the backend on</span>
            <a className="underline" href={googleColabUrl} target="_blank">
              Google Colab
            </a>
            <span>
              , copy the generated url (xxxx.ngrok.io) and paste it below{" "}
            </span>
          </div>
        </div>

        <div className="mb-12 py-2 text-2xl text-center w-full border-r-2 border-dashed border-gray-300">
          <span className="w-full text-center"></span>
          <form className="flex flex-wrap justify-center items-center">
            <label>
              Paste the ngrok url here
              <input
                type="text"
                name="name"
                className="w-full border-2 border-black bg-gray-200 rounded-xl p-2 ml-3 mr-1 font-bold"
                onChange={(e) => {
                  setUrl(e.target.value);
                  e.preventDefault();
                }}
              />
            </label>
          </form>
        </div>

        {/* card central */}
        <div className="w-full flex bg-gray-200">
          {/* inputs */}
          <div className="py-2 text-2xl text-center w-full border-r-2 border-dashed border-gray-300">
            <div>Input: CSS colors like "red" or "blue"</div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoading(true);
                generateImage_and_getImageUrl();
              }}
              className="flex flex-wrap justify-center items-center"
            >
              <label>
                <input
                  type="text"
                  name="name"
                  className="w-full border-2  border-black duration-100  rounded-xl p-2 ml-3 mr-1 font-bold"
                  onChange={(e) => {
                    e.preventDefault();
                    setInputColor(e.target.value);
                  }}
                />
              </label>
              <div className="w-full my-2">
                <input
                  type="submit"
                  value="Generate Image"
                  className="text-black bg-white border-2 border-black transform hover:scale-105 duration-150 font-bold p-1 text-xl rounded-xl cursor-pointer"
                />
              </div>
            </form>
          </div>

          {/* outpu */}
          <div className="py-2 text-2xl text-center w-full">
            {/* title */}
            <div>Output</div>
            {/* content */}
            <div className="flex justify-center py-4">
              {isLoading && <div>Loading...</div>}

              {!isLoading && <img src={outputImageUrl}></img>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
