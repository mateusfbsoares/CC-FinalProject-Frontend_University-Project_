import React, { useState, useCallback, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UseInterval from "../hooks/useInterval";
import { useDropzone } from "react-dropzone";
import { AiFillFileAdd, AiOutlineLoading } from "react-icons/ai";

const googleColabUrl =
  "https://colab.research.google.com/drive/1vluvzbwNTMSbTvi1_h2rIA1Au_7NkWrs?usp=sharing";

export default function Home() {
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [option, setOption] = useState<number>(0);
  const [passo2TextInput, setPasso2TextInput] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [selectedLyrics, setSelectedLyrics] = useState<boolean>(false);
  const [isImageGenerationHappening, setIsImageGenerationHappening] =
    useState<boolean>();
  const [isNewImageAvailable, setIsNewImageAvailable] = useState<boolean>();
  const [outputImagesUrls, setOutputImagesUrls] = useState<string[]>();
  const [outputImagesUrlsStyleTransfer, setOutputImagesUrlsStyleTransfer] =
    useState<string[]>();
  const [outputImagesVerses, setOutputImagesVerses] = useState<string[]>();
  const [hasImageGenerationFinished, setHasImageGenerationFinished] =
    useState<boolean>(false);
  const [conectadoComColab, setConectadoComColab] = useState<boolean>(false);
  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [audio, setAudio] = useState<any>();
  const [isSearchingLyrics, setIsSearchingLyrics] = useState<boolean>(false);
  const [isVideoGenerated, setIsVideoGenerated] = useState<boolean>(false);
  const [hasVideoGenerationStarted, setHasVideoGenerationStarted] =
    useState<boolean>(false);
  const [hasStyleTransferFinished, setHasStyleTransferFinished] =
    useState<boolean>(false);
  const [hasStyleTransferStarted, setHasStyleTransferStarted] =
    useState<boolean>(false);
  const [styleUrl, setStyleUrl] = useState<string>("");
  const [
    doesUserWantsToApplyStyleTransfer,
    setDoesUserWantsToApplyStyleTransfer,
  ] = useState<boolean>(false);
  const [ignoreStyleTransfer, setIgnoreStyleTransfer] =
    useState<boolean>(false);

  // definição de funções
  function searchSong() {
    setIsSearchingLyrics(true);
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
          setIsSearchingLyrics(false);
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

  function startDummyImageGeneration() {
    setHasImageGenerationFinished(false);

    const startGeneration = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }startDummyImageGeneration`,
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
    setHasImageGenerationFinished(false);

    const fetchPollGetGeneratedImage = async () => {
      const response = await fetch(`${backendUrl}getGeneratedImage`)
        .then((response) => response.blob())
        .then((imageBlob) => {
          if (!doesUserWantsToApplyStyleTransfer) {
            const imageObjectUrl = URL.createObjectURL(imageBlob);

            if (outputImagesUrls === undefined) {
              setOutputImagesUrls([imageObjectUrl]);
            } else {
              setOutputImagesUrls((currentArray) => [
                ...currentArray,
                imageObjectUrl,
              ]);
            }
          } else {
            const imageObjectUrl = URL.createObjectURL(imageBlob);

            if (outputImagesUrlsStyleTransfer === undefined) {
              setOutputImagesUrlsStyleTransfer([imageObjectUrl]);
            } else {
              setOutputImagesUrlsStyleTransfer((currentArray) => [
                ...currentArray,
                imageObjectUrl,
              ]);
            }
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
          console.log("hasFinished: ", ResponseJSON);
        });
    };
    if (backendUrl !== "") {
      pollImageGenerationFinishedStatus();
    }
  }

  // function sendAudioToBackend() {
  //   setHasAudio(true);
  // }

  function startVideoGeneration() {
    console.log("#### Starting Video Generation ####");

    const start = async () => {
      const response = await fetch(
        `${backendUrl}generateVideo?isFamous=${option == 1 ? true : false}`,
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
      );
    };
    start();
  }

  function pollHasVideoBeenGenerated() {
    const pollVideoGenerationFinishedStatus = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }isVideoFinished`,
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
          setIsVideoGenerated(ResponseJSON);
        });
    };
    if (backendUrl !== "") {
      pollVideoGenerationFinishedStatus();
    }
  }

  function startStyleTransfer() {
    const start = async () => {
      const response = await fetch(
        `${backendUrl}style_transfer?url=${styleUrl}`,
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
      );
    };
    start();
  }

  function pollHasStyleTransferFinished() {
    const pollStyleTransfer = async () => {
      const response = await fetch(
        `${backendUrl}${
          backendUrl.slice(backendUrl.length - 1) == "/" ? "" : "/"
        }isStyleTransferFinished`,
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
          setHasStyleTransferFinished(ResponseJSON);
        });
    };
    if (backendUrl !== "") {
      pollStyleTransfer();
    }
  }

  useEffect(() => {}, [hasImageGenerationFinished, isImageGenerationHappening]);

  // poll backend
  UseInterval(() => {
    pollHasImageGenerationFinished();
    if (!hasImageGenerationFinished) {
      pollIsNewImageAvailable();
    } else {
      if (hasStyleTransferFinished) {
        if (
          !hasVideoGenerationStarted &&
          hasImageGenerationFinished == true &&
          (option == 1 || hasAudio == true)
        ) {
          console.log("###### Starting Video Generation #####");
          startVideoGeneration();
          setHasVideoGenerationStarted(true);
        } else {
          pollHasVideoBeenGenerated();
          console.log("--- checking if video was generated ---");
        }
      } else {
        pollHasStyleTransferFinished();
      }
    }
  }, 1000);

  // JSX
  return (
    <div
      className={`
overflow-x-hidden
      ${
        // backendUrl !== "" && conectadoComColab
        // ? "h-full"
        // : "h-screen overflow-y-hidden"
        "h-full"
      }
       bg-gradient-to-br from-gray-400 to-blue-600 flex flex-wrap justify-center items-start pb-32`}
    >
      <div className="w-full font-mono text-center text-4xl font-bold py-6 px-2 bg-white bg-opacity-40">
        Geração de arte para músicas - Grupo 3
      </div>

      <div className="w-full flex justify-center items-center mt-12">
        <a
          className="font-bold underline text-xl bg-white opacity-40 p-1 animate-bounce"
          href="https://colab.research.google.com/drive/1uLzE8CEQnORV1hgAiU8GKBYUc8pfNmg3?usp=sharing"
        >
          Colab Standalone de emergência
        </a>
      </div>

      {/* Descrição da ferramenta */}
      <div className="my-12 shadow-2xl bg-white bg-opacity-20 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
        <div className="w-full text-center font-bold mb-4">
          O que é esta ferramenta?
        </div>{" "}
        <div className="px-4">
          Esta ferramenta permite gerar imagens a partir de letras de músicas,
          aplicar style transfer e gerar um vídeo com o áudio da música de fundo
        </div>
      </div>

      {/* Passo 1 */}
      <div className="mb-12  shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
        {/* título */}
        <div className="w-full text-center font-bold mb-4">
          Primeiro passo - Conectando com o Google Colab
        </div>{" "}
        {/* descrição */}
        <span className="pr-1">Rode o backend no</span>
        <a className="underline" href={googleColabUrl} target="_blank">
          Google Colab
        </a>
        <span>
          , copie a url gerada (no formato xxxx.jprq.io) e cole no campo abaixo
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
              className={`p-2 hover:scale-105 duration-100 rounded-xl cursor-pointer ${
                conectadoComColab == true
                  ? "text-black font-bold border-2 bg-white"
                  : "bg-white opacity-50"
              }
              } `}
            >
              {conectadoComColab
                ? "Conexão estabelecida"
                : "Conectar com o Google Colab"}
            </div>
          </div>
        </div>
      </div>

      {/* Passo 2 */}
      {conectadoComColab && backendUrl !== "" && (
        <div className="mb-12 shadow-2xl bg-white bg-opacity-60 w-10/12 laptop-L:w-8/12 rounded-xl text-center mr-2 text-black text-xl pt-2 pb-4 px-2">
          {/* título */}
          <div className="w-full text-center font-bold mb-4">
            Segundo Passo - Escolhendo a letra de uma música
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
              className={`p-2 ${
                option == 1
                  ? "text-black font-bold border-2 bg-white"
                  : "bg-white opacity-50"
              } my-1 transform hover:scale-105 rounded-xl cursor-pointer w-full mx-2 duration-100`}
            >
              Escolher uma música que já existe
            </div>
            <div
              onClick={() => {
                setOption(2);
                setPasso2TextInput("");
              }}
              className={`p-2 bg-white ${
                option == 2
                  ? "text-black font-bold border-2 bg-white"
                  : "bg-white opacity-50"
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
                setSelectedLyrics(true);
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
            <div className="w-full flex flex-wrap justify-center my-3">
              <input
                type="submit"
                value={option == 1 ? "Pesquisar música" : "Enviar letra"}
                className="text-black bg-white bg-opacity-80 border-3 border-black transform hover:scale-105 duration-150 font-bold p-1 text-xl rounded-xl cursor-pointer"
              />

              <div className="w-full mt-8">
                {isSearchingLyrics ? "Procurando música..." : ""}
              </div>
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
                      setSelectedLyrics(true);
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
              <div className="grid grid-cols-1  tablet:grid-cols-3 4k:grid-cols-5 w-full justify-center">
                {outputImagesUrls.map((imageUrl, index) => {
                  return (
                    <div key={index} className="m-1 flex justify-center">
                      <img src={imageUrl} />
                      {/* <div>{outputImagesVerses[index]}</div> */}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedLyrics && lyrics != "" && (
              <div>
                {!hasImageGenerationFinished && (
                  <div className="w-full mt-4 flex flex-wrap justify-center items-center">
                    <div className="w-full">
                      {doesUserWantsToApplyStyleTransfer
                        ? "Aplicando style transfer"
                        : "Gerando imagens..."}
                    </div>
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!ignoreStyleTransfer &&
        !hasStyleTransferFinished &&
        hasImageGenerationFinished &&
        lyrics != "" && (
          <div className="bg-white bg-opacity-50 w-10/12 rounded-xl p-2 flex flex-wrap justify-center items-center mb-12">
            <div>Deseja aplicar style transfer nas imagens?</div>
            <div className="w-full flex justify-center">
              <div
                className="text-center my-2 mx-6 bg-green-500 w-min p-1 rounded-md hover:scale-105 duration-150 cursor-pointer "
                onClick={() => setDoesUserWantsToApplyStyleTransfer(true)}
              >
                Sim
              </div>
              <div
                className="my-2 mx-6 text-center bg-red-500 w-min p-1 rounded-md hover:scale-105 duration-150 cursor-pointer "
                onClick={() => {
                  setDoesUserWantsToApplyStyleTransfer(false);
                  setIgnoreStyleTransfer(true);
                  setHasStyleTransferFinished(true);
                }}
              >
                Não
              </div>
            </div>
            {doesUserWantsToApplyStyleTransfer && (
              <div>
                <div>
                  Cole abaixo a url de uma imagem para ser utilizada como style
                  do transfer
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    startStyleTransfer();
                    setHasStyleTransferStarted(true);
                    setHasImageGenerationFinished(false);
                    startDummyImageGeneration();
                  }}
                  className="w-full"
                >
                  <label className="w-full flex justify-center">
                    <div>
                      <input
                        className="w-full p-2"
                        value={styleUrl}
                        onChange={(e) => setStyleUrl(e.target.value)}
                      ></input>
                    </div>
                  </label>
                  <div className="w-full flex flex-wrap justify-center my-3">
                    <input
                      type="submit"
                      value="Começar Style transfer"
                      className="text-black bg-white bg-opacity-80 border-3 border-black transform hover:scale-105 duration-150 font-bold p-1 text-xl rounded-xl cursor-pointer"
                    />

                    <div className="w-full flex justify-center mt-8">
                      {hasStyleTransferStarted
                        ? "Realizando style transfer..."
                        : ""}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      {false && hasStyleTransferFinished && doesUserWantsToApplyStyleTransfer && (
        <div className="w-10/12 flex flex-wrap justify-center pt-4 bg-white bg-opacity-50">
          {outputImagesUrlsStyleTransfer !== undefined && (
            <div className="mb-3 text-2xl w-full text-center font-bold">
              Imagens Geradas com aplicação de style transfer
            </div>
          )}
          <div className="w-full flex flex-wrap justify-center items-center">
            <div className="text-2xl w-full text-center">Style Image:</div>
            <img style={{ maxWidth: "45%" }} src={styleUrl} />
          </div>
          {outputImagesUrlsStyleTransfer !== undefined && (
            <div className="grid grid-cols-1 mt-4  tablet:grid-cols-3 4k:grid-cols-5 w-full justify-center">
              {outputImagesUrlsStyleTransfer.map((imageUrl, index) => {
                return (
                  <div key={index} className="m-1 flex justify-center">
                    <img src={imageUrl} />
                    {/* <div>{outputImagesVerses[index]}</div> */}
                  </div>
                );
              })}
            </div>
          )}
          {
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
                  <div className="w-full">Todas as imagens foram geradas.</div>
                </div>
              )}
            </div>
          }
        </div>
      )}

      {(hasStyleTransferFinished || ignoreStyleTransfer) && (
        <div className="w-full flex flex-wrap justify-center">
          {/* Passo 3 */}
          {option == 2 && hasImageGenerationFinished && lyrics != "" && (
            <div className="rounded-xl my-12 flex flex-wrap justify-center items-center shadow-2xl bg-white bg-opacity-60 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
              <div className="w-full text-center font-bold mb-2">
                Terceiro Passo - Fazendo upload de sua música autoral
              </div>{" "}
              <div>Forneça um arquivo .mp3 com o áudio da música</div>
              <div className="w-9/12 m-2 h-72 flex justify-center">
                <Dropzone
                  setDataObject={setAudio}
                  backendUrl={backendUrl}
                  hasAudio={hasAudio}
                  setHasAudio={setHasAudio}
                />
              </div>
            </div>
          )}

          {/* Video */}
          {(option == 1 || hasAudio) &&
            hasImageGenerationFinished &&
            lyrics != "" && (
              <div className="rounded-xl my-12 shadow-2xl bg-white bg-opacity-60 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
                <div className="w-full text-center font-bold my-4">
                  Vídeo de espaço latente
                </div>{" "}
                <div className="w-full h-72 flex justify-center">
                  {!isVideoGenerated && (
                    <div className="w-full h-full flex justify-center items-center text-7xl">
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    </div>
                  )}
                  {isVideoGenerated && (
                    <iframe
                      className="w-min h-full"
                      src={`${backendUrl}getGeneratedVideo`}
                    />
                  )}
                </div>
              </div>
            )}

          {/* footer */}

          <div className="rounded-xl items-center justify-center my-12 shadow-2xl bg-white bg-opacity-60 h-min w-10/12 text-center text-black text-xl pt-2 pb-4">
            <div className="mt-4 text-gray-700">
              Para rodar novamente, reinicie esta página e refaça os passos
            </div>
            <div className=" font-bold mt-12">Créditos:</div>
            {[
              { name: "Mateus", link: "https://mateusfbsoares.com" },
              { name: "Gabriel", link: "https://google.com:" },
              { name: "Maria Luísa", link: "https://google.com:" },
              { name: "Thiago", link: "https://google.com:" },
              { name: "Maria Eduarda", link: "https://google.com:" },
              { name: "Pedro", link: "https://google.com:" },
              { name: "Marcos Lira", link: "https://google.com:" },
            ].map((person, index) => {
              return (
                <a
                  target={"_blank"}
                  className="w-full block underline"
                  href={person.link}
                >
                  {person.name}
                </a>
              );
            })}
          </div>

          <div className="w-full h-2 mt-32"></div>
        </div>
      )}
    </div>
  );
}

function Dropzone(props: {
  setDataObject: any;
  backendUrl: string;
  hasAudio: boolean;
  setHasAudio: Function;
}) {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles) => {
    setIsUploading(true);
    async function sendFileAndGetResponse() {
      var formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);
      const response = await fetch(`${props.backendUrl}uploadAudio`, {
        method: "POST",
        headers: new Headers({
          // "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        }),
        // body: JSON.stringify(formdata),
        body: formdata,
        mode: "cors",
      });
      const jsonResponse = await response.json();
      props.setDataObject(jsonResponse);
      console.log(jsonResponse);
      setIsUploading(false);
      props.setHasAudio(true);
    }
    sendFileAndGetResponse();
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer w-full h-full text-base tablet:text-xl 4k:text-4xl flex flex-col justify-center items-center p-4 tablet:px-2 text-gray-700 bg-white opacity-80"
    >
      {isUploading ? (
        <div className="flex flex-wrap justify-center">
          <div className="w-full">Fazendo Upload</div>
          <AiOutlineLoading className="text-3xl mt-6 animate-spin" />
        </div>
      ) : (
        <div>
          <input {...getInputProps()} />
          <div className="flex flex-wrap justify-center">
            {isDragActive ? (
              <p className="w-full">Arraste o .mp3 aqui ...</p>
            ) : props.hasAudio ? (
              <div className="w-full">
                <div className="w-full">Audio Carregado.</div>
                <div className="w-full">Veja abaixo o vídeo gerado</div>
              </div>
            ) : (
              <p className="w-full flex flex-wrap justify-center">
                Arraste um arquivo de mp3 aqui, ou clique para selecionar um
                <AiFillFileAdd className="text-6xl mt-4 text-gray-600 transform hover:scale-105 duration-300 cursor-pointer" />
                <div>TAMANHO MÁXIMO: 1MB (limitação do jprq)</div>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
