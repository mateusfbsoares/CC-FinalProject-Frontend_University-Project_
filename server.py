from flask import Flask, send_file, request
from flask_ngrok import run_with_ngrok
from PIL import Image
import os

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/generateImage")
def generateImage():
  inputColor = request.args.get('inputColor')
  width = 50
  height = 50
  color = (153, 153, 255)
  img = Image.new('RGB', (width, height), inputColor)
  os.system("rm image.png")
  img.save('image.png')
  return send_file('image.png')

@app.route("/getImage")
def getImage():
  return send_file("image.png")

if __name__ == '__main__':
    app.run()  # If address is in use, may need to terminate other sessions:
               # Runtime > Manage Sessions > Terminate Other Sessions