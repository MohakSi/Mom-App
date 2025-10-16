from flask import Flask, request, jsonify
import openai
import whisper
from werkzeug.utils import secure_filename
import os 
from flask_cors import CORS
app = Flask(__name__)

CORS(app)

openai.api_key = ""

model = whisper.load_model("base")

# Specify the allowed file extensions
ALLOWED_EXTENSIONS = {'mp3', 'wav'}

# Check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    # Check if the POST request has a file part
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No file part'})

    audio_file = request.files['audio_file']

    # Check if the file has a valid extension
    if audio_file and allowed_file(audio_file.filename):
        # Save the file to a temporary location
        filename = secure_filename(audio_file.filename)
        print(filename)
        #temp_file_path = os.path.join('flask',filename) 
        #print(temp_file_path) # You might want to change the temporary path
        tfp=os.path.abspath(filename)
        print(tfp)
        audio_file.save(tfp)

        # Load the temporary file and transcribe
        with open(filename, "rb") as audio_file:
            transcript = openai.Audio.transcribe(
            file = audio_file,
            model = "whisper-1",
            response_format="text",
            language="en"
    )
        

        # Delete the temporary file after use
        #os.remove(temp_file_path)

        return jsonify({'transcript': transcript})
    else:
        return jsonify({'error': 'Invalid file extension'})

# ... (rest of your code)


@app.route('/generate_mom', methods=['POST'])
def generate_mom():
    prompt = request.json['transcript']
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Can you generate the Minute of Meeting in the form of bullet points for the below transcript?\n" + prompt,
        temperature=0,
        max_tokens=600,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    mom_result = response['choices'][0]['text']
    return jsonify({'result': mom_result})

if __name__ == '__main__':
    app.run(port=5002,debug=True)

