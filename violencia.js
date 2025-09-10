// Variáveis globais
let map;
let videoElement = document.getElementById('video');
let panicButton = document.getElementById('panicButton');
let statusText = document.getElementById('status');
let mediaRecorder;
let audioChunks = [];

// Função para inicializar o Google Maps
function initMap() {
  // Localização inicial (Exemplo: São Paulo, Brasil)
  const initialLocation = { lat: -23.5505, lng: -46.6333 };
  
  map = new google.maps.Map(document.getElementById("map"), {
    center: initialLocation,
    zoom: 14,
  });

  // Mostrar a localização atual
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.setCenter(userLocation);

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Sua localização",
      });
    });
  }
}

// Função para iniciar a gravação de áudio e vídeo quando o botão de pânico for pressionado
async function startRecording() {
  panicButton.disabled = true;  // Desabilitar o botão enquanto grava
  statusText.textContent = "Gravando...";

  try {
    // Captura de áudio e vídeo
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoElement.srcObject = stream;

    // Gravação de mídia
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const videoBlob = new Blob(audioChunks, { type: 'video/webm' });
      
      // Aqui você pode enviar os blobs para o servidor para processamento (exemplo: Firebase, API de emergência)
      console.log('Gravação pronta:', audioBlob, videoBlob);

      // Resetar os dados após envio
      audioChunks = [];
    };

    mediaRecorder.start();

    // Aguardar 10 segundos para a gravação (exemplo), depois para a gravação
    setTimeout(() => {
      mediaRecorder.stop();
      statusText.textContent = "Gravação finalizada. Enviando...";

      // Simulação de envio para a polícia (pode ser substituído por uma chamada real à API da polícia)
      setTimeout(() => {
        statusText.textContent = "Ajuda enviada!";
        panicButton.disabled = false;  // Reabilitar o botão
      }, 3000);

    }, 10000); // Grava por 10 segundos antes de parar a gravação
  } catch (err) {
    statusText.textContent = "Erro ao iniciar a gravação: " + err.message;
    panicButton.disabled = false;
  }
}

