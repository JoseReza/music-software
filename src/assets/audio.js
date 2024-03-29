// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// Create an audio listener
const listener = new THREE.AudioListener();
camera.add(listener);

// Access the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        // Create a THREE.Audio object from the microphone stream
        const audio = new THREE.Audio(listener).setMediaStreamSource(stream);
        cube.add(audio);

        // Create an analyser node
        const analyser = new THREE.AudioAnalyser(audio, 32); // You can change the parameters as needed

        // Animate the cube based on the audio data
        function animate() {
            requestAnimationFrame(animate);

            // Update the frequency data
            const frequencyData = analyser.getFrequencyData();

            // Use the frequency data for visualization or other purposes
            cube.scale.set(frequencyData[0] / 128, frequencyData[1] / 128, frequencyData[2] / 128);

            // Rotate the cube
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            // Update the renderer
            renderer.render(scene, camera);
        }

        animate();
    })
    .catch(function (err) {
        console.error('Error accessing microphone:', err);
    });
