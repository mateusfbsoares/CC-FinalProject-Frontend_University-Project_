import React, { useState } from "react";

export default function Home(props) {
  const googleColabUrl =
    "https://colab.research.google.com/drive/1npdabuO7eq8YEsT9hLecHLLLuLAzi2f6?usp=sharing";
  const [outputImageUrl, setOutputImageUrl] = useState<string>();
  const [inputColor, setInputColor] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("http://localhost:5000");

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

  // tags

  return (
    <div className="w-full h-full font-serif bg-gradient-to-br from-blue-400 to to-red-400">
      {/* título */}
      <div className="pt-3">
        <div className="w-full font-mono text-center text-4xl font-bold py-6 px-2 bg-white bg-opacity-40">
          Geração de capas de álbum e vídeoclipes - Grupo 3
        </div>
      </div>

      {/* conteúdo */}
      <div>
        {/* descrição do projeto */}
        <div className="flex justify-center pt-4 ">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-20 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
            <div className="w-full text-center font-bold mb-4">
              O que é esta ferramenta?
            </div>{" "}
            <div className="px-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est sunt
              necessitatibus molestiae neque quisquam laboriosam modi eius?
              Provident iusto placeat modi nihil harum sunt quidem, labore
              adipisci? In exercitationem sed ipsam neque incidunt sequi, qui
              cumque delectus, animi et, natus culpa facilis aliquid quia
            </div>
          </div>
        </div>

        {/* primeiro passo */}
        <div className="flex justify-center pt-32 pb-4">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">
              Primeiro passo
            </div>{" "}
            <span className="pr-1">Rode o backend no</span>
            <a className="underline" href={googleColabUrl} target="_blank">
              Google Colab
            </a>
            <span>
              , copie a url gerada (no formato xxxx.ngrok.io) e cole no campo
              abaixo
            </span>
          </div>
        </div>

        <div className="flex justify-center flex-wrap text-2xl">
          <span className="w-full text-center">Cole a url aqui</span>
          <form className="flex flex-wrap justify-center items-center">
            <label>
              <input
                type="text"
                name="name"
                className="w-full border-2 bg-white bg-opacity-40 border-black rounded-x py-2 font-bold"
                onChange={(e) => {
                  setUrl(e.target.value);
                  e.preventDefault();
                }}
              />
            </label>
          </form>
        </div>

        {/* segundo passo */}
        <div className="flex justify-center pt-32 ">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">
              Segundo passo
            </div>{" "}
            <span>
              Forneça uma lista de palavras-chave que fazem parte da letra da(s)
              sua(s) músicas
            </span>
          </div>
        </div>

        {/* card do segundo passo */}
        <div className="flex justify-center pt-4 ">
          {/* card da direita */}
          <div className="shadow-2xl flex justify-center flex-wrap bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">Input</div>{" "}
            {/* old stuff */}
            <div className="w-full">
              Digite as palavras-chave separadas por "|"
            </div>
            <div className="w-full">Ex: "|horizonte|claro|vazio|"</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoading(true);
                generateImage_and_getImageUrl();
              }}
              className="mt-2 w-10/12"
            >
              <label>
                <input
                  type="text"
                  name="name"
                  className="w-full border-3  border-black duration-100"
                  onChange={(e) => {
                    e.preventDefault();
                    setInputColor(e.target.value);
                  }}
                />
              </label>
              <div className="w-full flex justify-center my-3">
                <input
                  type="submit"
                  value="Generate Image Sequence"
                  className="text-black bg-white bg-opacity-80 border-3 border-black transform hover:scale-105 duration-150 font-bold p-1 text-xl rounded-xl cursor-pointer"
                />
              </div>
            </form>
          </div>
        </div>

        {/* output */}
        <div className="flex justify-center pt-4 pb-32">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">Output</div>{" "}
            <div className="py-2 text-2xl text-center w-full">
              {/* content */}
              <div className="flex justify-center py-4">
                {isLoading && <div>Loading...</div>}

                {!isLoading && <img src={outputImageUrl}></img>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">
              Terceiro passo
            </div>{" "}
            <span>
              Customize o seu output e configure parâmetros para a geração de
              vídeo
            </span>
          </div>
        </div>
        <div className="flex justify-center pt-4 ">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">
              Customização
            </div>{" "}
            <span>Opções...</span>
          </div>
        </div>

        {/* output */}
        <div className="flex justify-center pt-4">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">Vídeo final</div>{" "}
            <div className="py-2 text-2xl text-center w-full">
              {/* content */}
              <div className="flex justify-center py-4">
                {isLoading && <div>Loading...</div>}

                {!isLoading && <img src={outputImageUrl}></img>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-32 ">
          {/* card da direita */}
          <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <div className="w-full text-center font-bold mb-4">
              Quarto passo
            </div>{" "}
            <span>Compartilhe sua criação!</span>
          </div>
        </div>
        <div className="flex justify-center pt-4 pb-32 ">
          {/* card da direita */}
          <div className="shadow-2xl flex flex-wrap bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
            <a href={"https://google.com"} className="underline w-full">
              Compartilhar no YouTube
            </a>
            <a href={"https://google.com"} className="underline w-full">
              Compartilhar no Twitter
            </a>
            <a href={"https://google.com"} className="underline w-full">
              Compartilhar no Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
