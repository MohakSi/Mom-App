import React, { useState } from 'react';
import axios from 'axios';
import image from './logo.jpg'
function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [momResult, setMomResult] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const transcribeAudio = async () => {
    const formData = new FormData();
    formData.append('audio_file', file);

    try {
      const response = await axios.post('http://localhost:5002/transcribe', formData);
      setTranscript(response.data.transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const generateMoM = async () => {
    try {
      const response = await axios.post('http://localhost:5002/generate_mom', { transcript });
      setMomResult(response.data.result);
    } catch (error) {
      console.error('Error generating MoM:', error);
    }
  };

  return (
    <div className="App" style={{ display:'flex', justifyContent:'space-between',alignItems:'center',flexDirection:'column',height: '100vh', textAlign: 'center' }}>
      <h1 style={{ textAlign: 'center' , color:'blue', fontSize: '40px'}}> MINUTES OF THE MEETING APPLICATION</h1>
      <img
       src={image}
      style={{textAlign:'center', width: '300px', height: 'auto', borderRadius: '20px', border: '10px solid #3f00ff', display: 'inline-block', margin: '50 auto'}} />
      <input type="file" accept="audio/*" onChange={handleFileChange} style={{ fontSize: '20px', color:'#00008B',width: '50%', padding: '10px', border: '2px solid #436eee', marginTop: '10px', borderRadius: '4px' }}/>
      <button onClick={transcribeAudio} style={{ marginTop:'20px',background: '#007bff', color: '#fff', padding: '5px', borderRadius: '2px', width: '50%', cursor: 'pointer' }}>Transcribe Audio</button>
      <div>
        <h3>Transcript:</h3>
        <p style={ {color: 'blue',fontWeight:'bold',
                fontSize: '20px',
                lineHeight: '1.5'}}>{transcript}</p>
      </div>
      <button onClick={generateMoM} style={{ marginTop:'20px',background: '#007bff', color: '#fff', padding: '5px', borderRadius: '2px', width: '50%', cursor: 'pointer' }}>Generate MoM</button>
      <div>
        <h3>MoM Result:</h3>
        <p style={ {color: 'green',fontWeight:'bold',
                fontSize: '20px',
                lineHeight: '1.5'}}>{momResult}</p>
      </div>
    </div>
  );
}

export default App;
