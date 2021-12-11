from flask import Flask, send_file, request
from flask_ngrok import run_with_ngrok
from PIL import Image
import os

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

colors = ["red","blue","yellow","green"]
index = 0

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/generateImage")
def generateImage():
  print("generateImage foi invocado")

  global index
  if index == len(colors):
    return "None"

  inputColor = colors[index]
  index+=1

  width = 50
  height = 50
  img = Image.new('RGB', (width, height), inputColor)
  os.system("rm image.png")
  img.save('image.png')

  return send_file('image.png')

# @app.route("/getImage")
# def getImage():
#   return send_file("image.png")

if __name__ == '__main__':
    app.run()  # If address is in use, may need to terminate other sessions:
               # Runtime > Manage Sessions > Terminate Other Sessions