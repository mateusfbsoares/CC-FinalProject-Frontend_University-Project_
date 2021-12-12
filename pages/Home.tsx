import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UseInterval from "../hooks/useInterval";

const googleColabUrl =
  "https://colab.research.google.com/drive/13Gaknk-wCokQm52_eBUb6xJca9CvEYIe?usp=sharing";

export default function Home() {
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [option, setOption] = useState<number>(0);
  const [passo2TextInput, setPasso2TextInput] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [isImageGenerationHappening, setIsImageGenerationHappening] =
    useState<boolean>();
  const [isNewImageAvailable, setIsNewImageAvailable] = useState<boolean>();
  const [outputImagesUrls, setOutputImagesUrls] = useState<string[]>();
  const [outputImagesVerses, setOutputImagesVerses] = useState<string[]>();
  const [hasImageGenerationFinished, setHasImageGenerationFinished] =
    useState<boolean>(false);
  const [conectadoComColab, setConectadoComColab] = useState<boolean>(false);

  // definição de funções
  function searchSong() {
    const search = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }search_song?search_text=${passo2TextInput}`,
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

          setLyrics(arr.join("\n"));
        });
    };
    search();
  }

  function handleStartImageGeneration() {
    setHasImageGenerationFinished(false);

    let finalLyrics = option == 1 ? lyrics : passo2TextInput;

    finalLyrics = finalLyrics.replaceAll("\n", "_");

    const startGeneration = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }startImageGeneration?lyrics=${finalLyrics}`,
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

  function pollIsNewImageAvailable() {
    console.log("&&&  pollIsNewImageAvailable &&&");
    const fetchPollNewImageAvailable = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
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
          setIsNewImageAvailable(ResponseJSON);
          if (ResponseJSON == true) {
            getGeneratedImage();
            getLastImageLyrics();
          }
        });
    };

    if (backendUrl !== "") {
      fetchPollNewImageAvailable();
    }
  }

  function getGeneratedImage() {
    console.log("### getGeneratedImage ###");

    setHasImageGenerationFinished(false);

    const fetchPollGetGeneratedImage = async () => {
      const response = await fetch(`${backendUrl}getGeneratedImage`)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageObjectUrl = URL.createObjectURL(imageBlob);

          if (outputImagesUrls === undefined) {
            setOutputImagesUrls([imageObjectUrl]);
          } else {
            setOutputImagesUrls((currentArray) => [
              ...currentArray,
              imageObjectUrl,
            ]);
          }
        });
    };
    if (backendUrl !== "") {
      fetchPollGetGeneratedImage();
    }
  }

  function getLastImageLyrics() {
    const fetchGetLastImageLyrics = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }getLastImageLyrics`,
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
          if (outputImagesVerses === undefined) {
            setOutputImagesVerses([ResponseJSON]);
          } else {
            setOutputImagesVerses((currentArray) => [
              ...currentArray,
              ResponseJSON,
            ]);
          }
        });
    };
    if (backendUrl !== "") {
      fetchGetLastImageLyrics();
    }
  }

  function pollHasImageGenerationFinished() {
    const pollImageGenerationFinishedStatus = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }hasFinished`,
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
          setHasImageGenerationFinished(ResponseJSON);
        });
    };
    if (backendUrl !== "") {
      pollImageGenerationFinishedStatus();
    }
  }

  // poll backend
  UseInterval(() => {
    if (isImageGenerationHappening) {
      pollIsNewImageAvailable();
      pollHasImageGenerationFinished();
    }
  }, 1000);

  // JSX
  return (
    <div
      className={`
overflow-x-hidden
      ${
        backendUrl !== "" ? "h-full" : "h-screen overflow-y-hidden"
      } bg-gradient-to-br from-red-100 to-red-300 flex flex-wrap justify-center items-start`}
    >
      <div className="w-full font-mono text-center text-4xl font-bold py-6 px-2 bg-white bg-opacity-40">
        Geração de arte para músicas - Grupo 3
      </div>

      {/* Descrição da ferramenta */}
      <div className="my-12 shadow-2xl bg-white bg-opacity-20 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
        <div className="w-full text-center font-bold mb-4">
          O que é esta ferramenta?
        </div>{" "}
        <div className="px-4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est sunt
          necessitatibus molestiae neque quisquam laboriosam modi eius?
          Provident iusto placeat modi nihil harum sunt quidem, labore adipisci?
          In exercitationem sed ipsam neque incidunt sequi, qui cumque delectus,
          animi et, natus culpa facilis aliquid quia
        </div>
      </div>

      {/* Passo 1 */}
      <div className="mb-12  shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
        {/* título */}
        <div className="w-full text-center font-bold mb-4">
          Primeiro passo
        </div>{" "}
        {/* descrição */}
        <span className="pr-1">Rode o backend no</span>
        <a className="underline" href={googleColabUrl} target="_blank">
          Google Colab
        </a>
        <span>
          , copie a url gerada (no formato xxxx.ngrok.io) e cole no campo abaixo
        </span>
        {/* Input */}
        <div className="flex justify-center flex-wrap text-2xl">
          <span className="w-full text-center text-xl mt-2">
            Cole a url aqui:
          </span>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-wrap justify-center items-center"
          >
            <input
              type="text"
              name="name"
              className="w-full border-2 bg-white bg-opacity-40 border-black rounded-x py-2 font-bold"
              onChange={(e) => {
                e.preventDefault();
                setBackendUrl(e.target.value);
              }}
            />
          </form>
          <div className="w-full my-4 flex justify-center">
            <div
              onClick={() => {
                setConectadoComColab(true);
                fetch(
                  `${backendUrl}${
                    backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
                  }clear`,
                  {
                    method: "get",
                    headers: new Headers({
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                      "Access-Control-Allow-Methods":
                        "DELETE, POST, GET, OPTIONS",
                      "Access-Control-Allow-Headers":
                        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                    }),
                    mode: "cors",
                  }
                );
              }}
              className=" bg-gray-300 p-1 hover:scale-105 duration-100 rounded-xl cursor-pointer"
            >
              Conectar com o Google Colab
            </div>
          </div>
          {conectadoComColab && (
            <div className="w-full">Conexão estabelecida.</div>
          )}
        </div>
      </div>

      {/* Passo 2 */}
      {conectadoComColab && backendUrl !== "" && (
        <div className="mb-12 shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
          {/* título */}
          <div className="w-full text-center font-bold mb-4">
            Segundo Passo
          </div>{" "}
          {/* descrição */}
          <div>
            Você que escolher uma música que já existe ou uma música autoral?
          </div>
          <div className="w-full flex justify-center my-4">
            <div
              onClick={() => {
                setOption(1);
                setPasso2TextInput("");
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
                setPasso2TextInput("");
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
          {/* Input */}
          {option != 1 && option != 2 && (
            <div className="w-full">(Aguardando escolha acima)...</div>
          )}
          {option == 1 && (
            <div className="font-bold">Digite o nome da música e artista</div>
          )}
          {option == 2 && (
            <div className="font-bold">Digite a letra da sua música</div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (option == 1) {
                searchSong();
              } else if (option == 2) {
                setLyrics(passo2TextInput);
                handleStartImageGeneration();
              }
            }}
            className="w-full"
          >
            <label className="w-full flex justify-center">
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
                      setPasso2TextInput(e.target.value);
                    }}
                  />
                </div>
              )}

              {option == 2 && (
                <div>
                  <div className="mb-4 text-base">
                    (Apertar ENTER irá inserir uma nova linha. Para enviar a
                    letra, clique no botão "Enviar letra")
                  </div>

                  <textarea
                    className="w-full h-32 p-2"
                    value={passo2TextInput}
                    onChange={(e) => setPasso2TextInput(e.target.value)}
                  ></textarea>
                </div>
              )}
            </label>
            <div className="w-full flex justify-center my-3">
              <input
                type="submit"
                value={option == 1 ? "Pesquisar música" : "Enviar letra"}
                className="text-black bg-white bg-opacity-80 border-3 border-black transform hover:scale-105 duration-150 font-bold p-1 text-xl rounded-xl cursor-pointer"
              />
            </div>
          </form>
          {!isImageGenerationHappening && (
            <div>
              {option == 1 && lyrics != "" && (
                <div className=" pb-4 mt-12">
                  <div className="font-bold">
                    As letras abaixo estão corretas?
                  </div>
                  <div className="text-gray-600">
                    Se não estiverem, tente fazer outra busca{" "}
                  </div>
                </div>
              )}
              {option == 1 && lyrics != "" && (
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
                  lyrics != "" &&
                  lyrics.split("\n").map((line, index) => {
                    return (
                      <div className="w-full" key={index}>
                        {line}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="w-ful flex flex-wrap justify-center pt-4">
            {outputImagesUrls !== undefined && (
              <div className="mb-3 text-2xl font-bold w-full">
                Imagens Geradas
              </div>
            )}
            {outputImagesUrls !== undefined && (
              <div className="flex w-full">
                {outputImagesUrls.map((imageUrl, index) => {
                  return (
                    <div key={index} className="m-1">
                      <img src={imageUrl} />
                      {/* <div>{outputImagesVerses[index]}</div> */}
                    </div>
                  );
                })}
              </div>
            )}
            {lyrics != "" && (
              <div>
                {!hasImageGenerationFinished && (
                  <div className="w-full mt-4 flex flex-wrap justify-center items-center">
                    <div className="w-full">Gerando imagens...</div>
                    <div>
                      <AiOutlineLoading3Quarters className="animate-spin w-full" />
                    </div>
                  </div>
                )}
                {hasImageGenerationFinished && (
                  <div>
                    <div className="w-full">
                      Todas as imagens foram geradas.
                    </div>
                    {/* <div>
                      Para rodar novamente, reinicie esta página e refaça os
                      passos
                    </div> */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Passo 3 */}
      {hasImageGenerationFinished && lyrics != "" && (
        <div className="my-12 shadow-2xl bg-white bg-opacity-60 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
          <div className="w-full text-center font-bold mb-4">
            Vídeo de espaço latente
          </div>{" "}
          <div className="w-full h-72 flex justify-center">
            <iframe
              className="w-min h-full"
              src={`${backendUrl}/generateVideo`}
            />
          </div>
        </div>
      )}

      {/* footer */}
      <div className="w-full h-2 mt-32"></div>
    </div>
  );
}
