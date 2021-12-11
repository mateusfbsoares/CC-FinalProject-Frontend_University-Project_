import React, { useEffect, useState } from "react";

export default function Home(props) {
  const googleColabUrl =
    "https://colab.research.google.com/drive/1npdabuO7eq8YEsT9hLecHLLLuLAzi2f6?usp=sharing";

  // const [outputImageUrl, setOutputImageUrl] = useState<string>(null);
  const [outputImageUrls, setOutputImageUrls] = useState<string[]>();
  const [outputImageLyrics, setOutputImageLyrics] = useState<string[]>();
  const [inputColor, setInputColor] = useState<string>();
  const [textInput, setTextInput] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [option, setOption] = useState<number>();
  const [lyrics, setlyrics] = useState<string[]>(null);
  const [lyricsString, setLyricsString] = useState<string>();
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isThirdStepFinished, setIsThirdStepFinished] =
    useState<boolean>(false);

  const [hasImageGenerationFinished, setHasImageGenerationFinished] =
    useState<boolean>(false);

  const [isNewImageAvailable, setIsNewImageAvailable] =
    useState<boolean>(false);

  const [isImageGenerationHappening, setIsImageGenerationHappening] =
    useState<boolean>();

  // setInterval(() => {
  //   pollIsNewImageAvailable();
  //   if (isNewImageAvailable) {
  //     getGeneratedImage();
  //     getLastImageLyrics();
  //   }
  //   pollHasImageGenerationFinished();
  // }, 5000);

  // setInterval(() => {
  //   console.log("------------------");
  //   console.log("outputImageUrls!==undefined", outputImageUrls !== undefined);
  //   console.log("------------------");
  // }, 1000);

  function pollIsNewImageAvailable() {
    const fetchPollNewImageAvailable = async () => {
      const response = await fetch(
        `${url}${
          url.slice(url.length - 1) == "/" ? "" : "/"
        }isNewImageAvailable`,
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
          }),
          mode: "cors",
        }
      )
        .then((response) => response.json())
        .then((ResponseJSON) => {
          setIsNewImageAvailable(ResponseJSON == "true" ? true : false);
        });
    };

    if (url !== undefined) {
      fetchPollNewImageAvailable();
    }
  }

  function getGeneratedImage() {
    const fetchPollGetGeneratedImage = async () => {
      const response = await fetch(`${url}getGeneratedImage`)
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
    fetchPollGetGeneratedImage();
  }

  function getLastImageLyrics() {
    const fetchGetLastImageLyrics = async () => {
      const response = await fetch(
        `${url}${
          url.slice(url.length - 1) == "/" ? "" : "/"
        }search_song?search_text=${textInput}`,
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
          }),
          mode: "cors",
        }
      )
        .then((response) => response.json())
        .then((ResponseJSON) => {});
    };
    fetchGetLastImageLyrics();
  }

  function pollHasImageGenerationFinished() {
    const pollImageGenerationFinishedStatus = async () => {
      const response = await fetch(
        `${url}${url.slice(url.length - 1) == "/" ? "" : "/"}hasFinished`,
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
          }),
          mode: "cors",
        }
      )
        .then((response) => response.json())
        .then((ResponseJSON) => {
          setHasImageGenerationFinished(ResponseJSON == "true" ? true : false);
        });
    };
    if (url !== undefined) {
      pollImageGenerationFinishedStatus();
    }
  }

  function handleStartImageGeneration() {
    const finalLyricsString = option === 1 ? lyricsString : textInput;
    console.log("final lyrics string:\n", finalLyricsString);

    const startGeneration = async () => {
      const response = await fetch(
        `${url}${
          url.slice(url.length - 1) == "/" ? "" : "/"
        }startImageGeneration?lyrics=${finalLyricsString}`,
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
          }),
          mode: "cors",
        }
      ).then(() => setIsImageGenerationHappening(true));
    };
    startGeneration();
  }

  function searchSong() {
    console.log(
      "#################### SEARCH SONG (true) #######################"
    );

    const search = async () => {
      const response = await fetch(
        `${url}${
          url.slice(url.length - 1) == "/" ? "" : "/"
        }search_song?search_text=${textInput}`,
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
          }),
          mode: "cors",
        }
      )
        .then((response) => response.json())
        .then((ResponseJSON) => {
          let arr = ResponseJSON.replace(
            "EmbedShare URLCopyEmbedCopy",
            ""
          ).split("\n");

          arr = arr.filter(function (item) {
            return item.indexOf("[") !== 0;
          });

          setlyrics(arr);
          setLyricsString(arr.join("\n"));

          console.log(
            "#################### SEARCH SONG (false) #######################"
          );
        });
    };
    search();
  }

  // tags
  return (
    <div
      className={`w-full ${
        url == null || url == "" ? "h-screen" : "h-full"
      }  font-serif bg-gradient-to-br from-blue-400 to to-red-400`}
    >
      {/* título */}
      <div className="pt-3">
        <div className="w-full font-mono text-center text-4xl font-bold py-6 px-2 bg-white bg-opacity-40">
          Geração de capas de single - Grupo 3
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

        {/* PRIMEIRO PASSO */}
        <div>
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
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-wrap justify-center items-center"
            >
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
        </div>

        {url != null && url != "" && (
          <div>
            {/* SEGUNDO PASSO */}
            <div>
              <div className="flex justify-center pt-32 ">
                {/* card da direita */}
                <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
                  <div className="w-full text-center font-bold mb-4">
                    Segundo passo
                  </div>{" "}
                </div>
              </div>

              {/* card do segundo passo */}
              <div className="flex justify-center pt-4 ">
                {/* card da direita */}
                <div className="shadow-2xl flex flex-wrap justify-center bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
                  <div className="w-full text-center font-bold mb-2">Input</div>{" "}
                  <div>
                    Você que escolher uma música que já existe ou uma música
                    autoral?
                  </div>
                  <div className="w-full flex justify-center my-4">
                    <div
                      onClick={() => {
                        setOption(1);
                        setTextInput("");
                      }}
                      className={` ${
                        option == 1
                          ? "bg-gray-500 text-white border-2 border-red-600"
                          : "bg-white"
                      } my-1 transform hover:scale-105 rounded-xl cursor-pointer w-full mx-2 duration-100`}
                    >
                      Escolher uma música que já existe
                    </div>
                    <div
                      onClick={() => {
                        setOption(2);
                        setTextInput("");
                      }}
                      className={`bg-white ${
                        option == 2
                          ? "bg-gray-500 text-white border-2 border-red-600"
                          : "bg-white"
                      } my-1 transform hover:scale-105 rounded-xl cursor-pointer w-full mx-2 duration-100`}
                    >
                      Fornecer a letra da minha música autoral
                    </div>
                  </div>
                  {option != 1 && option != 2 && (
                    <div className="w-full">(Aguardando escolha acima)...</div>
                  )}
                  {option == 1 && (
                    <div className="font-bold">
                      Digite o nome da música e artista
                    </div>
                  )}
                  {option == 2 && (
                    <div className="font-bold">
                      Digite a letra da sua música
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      if (option == 1) {
                        searchSong();
                      } else if (option == 2) {
                        setLyricsString(textInput);
                      }
                    }}
                    className="w-10/12"
                  >
                    <label>
                      {option == 1 && (
                        <div>
                          <div className="mb-4 text-base">
                            (Apertar ENTER irá pesquisar a música)
                          </div>
                          <input
                            type="text"
                            name="name"
                            className="w-full border-3  border-black duration-100"
                            onChange={(e) => {
                              e.preventDefault();
                              setTextInput(e.target.value);
                            }}
                          />
                        </div>
                      )}

                      {option == 2 && (
                        <div>
                          <div className="mb-4 text-base">
                            (Apertar ENTER irá inserir uma nova linha. Para
                            enviar a letra, clique no botão "Enviar letra")
                          </div>

                          <textarea
                            className="w-full h-32 p-2"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                          ></textarea>
                        </div>
                      )}
                    </label>
                    <div className="w-full flex justify-center my-3">
                      <input
                        type="submit"
                        value={
                          option == 1 ? "Pesquisar música" : "Enviar letra"
                        }
                        className="text-black bg-white bg-opacity-80 border-3 border-black transform hover:scale-105 duration-150 font-bold p-1 text-xl rounded-xl cursor-pointer"
                      />
                    </div>
                  </form>
                  {option == 1 && lyrics != null && (
                    <div className=" pb-4">
                      <div className="font-bold">
                        As letras abaixo estão corretas?
                      </div>
                      <div className="text-gray-600">
                        Se não estiverem, tente fazer outra busca{" "}
                      </div>
                    </div>
                  )}
                  {option == 1 && lyrics != null && (
                    <div className="flex justify-center items-center">
                      <div
                        onClick={() => {
                          handleStartImageGeneration();
                        }}
                        className="mx-2 mb-4 bg-green-800 font-bold text-white rounded-lg px-1 hover:scale-105 duration-100 cursor-pointer"
                      >
                        Sim, gerar imagens
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap w-full">
                    {option == 1 &&
                      lyrics != null &&
                      lyrics.map((line, index) => {
                        return (
                          <div className="w-full" key={index}>
                            {line}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* output */}
              <div className="flex justify-center pt-4 pb-32">
                {/* card da direita */}
                <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
                  <div className="w-full text-center font-bold mb-4">
                    Output
                  </div>{" "}
                  {isImageGenerationHappening && (
                    <div>Generating images...</div>
                  )}
                  {!isImageLoaded && isImageLoading && <div>Loading...</div>}
                  {isImageLoaded && (
                    <div>
                      {!isImageLoaded && !isImageLoading && (
                        <div>Imagem gerada.</div>
                      )}
                      {
                        <div className="py-2 text-2xl text-center w-full">
                          {/* content */}
                          <div className="flex justify-center py-4">
                            {outputImageUrls !== undefined && (
                              // <img src={outputImageUrl}></img>
                              <div>
                                {outputImageUrls.map((imageUrl, index) => {
                                  return (
                                    <div>
                                      {" "}
                                      <img key={index} src={imageUrl} />
                                      <div>{outputImageLyrics[index]}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {hasImageGenerationFinished && (
              <div className={isThirdStepFinished ? "" : "pb-32"}>
                {/* TERCEIRO PASSO */}
                <div>
                  <div className="flex justify-center">
                    {/* card da direita */}
                    <div className="shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
                      <div className="w-full text-center font-bold mb-4">
                        Terceiro passo
                      </div>{" "}
                      <span>
                        Customize o seu output e configure parâmetros para a
                        geração de vídeo
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
                      <div className="w-full text-center font-bold mb-4">
                        Vídeo final
                      </div>{" "}
                      <div className="py-2 text-2xl text-center w-full">
                        {/* content */}
                        <div className="flex justify-center py-4">
                          {<div>Loading...</div>}

                          {/* {!isLyricsLoading && <img src={outputImageUrl}></img>} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isThirdStepFinished && (
                  // QUARTO PASSO
                  <div>
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
                        <a
                          href={"https://google.com"}
                          className="underline w-full"
                        >
                          Compartilhar no YouTube
                        </a>
                        <a
                          href={"https://google.com"}
                          className="underline w-full"
                        >
                          Compartilhar no Twitter
                        </a>
                        <a
                          href={"https://google.com"}
                          className="underline w-full"
                        >
                          Compartilhar no Instagram
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
