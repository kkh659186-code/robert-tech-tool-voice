document.addEventListener('DOMContentLoaded', function() {
    const scriptInput = document.getElementById('scriptInput');
    const speakerList = document.getElementById('speakerList');
    const voiceMapping = document.getElementById('voiceMapping');
    const generateBtn = document.getElementById('generateAudio');
    const downloadBtn = document.getElementById('downloadAll');

    let speakers = [];
    let isGenerating = false;

    function parseScript(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const newSpeakers = [];
        lines.forEach(line => {
            const match = line.match(/^(Speaker \d+):\s*(.+)/);
            if (match) {
                const name = match[1].trim();
                const text = match[2].trim();
                if (newSpeakers.find(s => s.name === name) === undefined) {
                    newSpeakers.push({ name, text: [], id: name + '_' + newSpeakers.length });
                }
                const speaker = newSpeakers.find(s => s.name === name);
                speaker.text.push(text);
            }
        });
        return newSpeakers;
    }

    function renderSpeakers() {
        speakerList.innerHTML = '';
        speakers.forEach((speaker, index) => {
            const div = document.createElement('div');
            div.className = 'speaker-row';
            div.innerHTML = `
                <h3>${speaker.name}</h3>
                <div class="control-group">
                    <label>Text:</label>
                    <textarea>${speaker.text.join('\n')}</textarea>
                </div>
            `;
            speakerList.appendChild(div);
        });
        renderVoiceMapping();
    }

    function renderVoiceMapping() {
        voiceMapping.innerHTML = '';
        speakers.forEach((speaker, index) => {
            const div = document.createElement('div');
            div.className = 'speaker-row';
            div.innerHTML = `
                <h3>${speaker.name}</h3>
                <div class="control-group">
                    <label>Voice Model:</label>
                    <select class="voice-select">
                        <option value="female">English - Female</option>
                        <option value="male">English - Male</option>
                        <option value="japanese">Japanese - Female</option>
                        <option value="french">French - Female</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Pitch:</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="1" class="pitch-control">
                </div>
                <div class="control-group">
                    <label>Speed:</label>
                    <select class="speed-control">
                        <option value="0.8">Slow</option>
                        <option value="1">Normal</option>
                        <option value="1.2">Fast</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Volume:</label>
                    <input type="range" min="0" max="1" step="0.1" value="1" class="volume-control">
                </div>
                <div class="control-group">
                    <label>Emotion:</label>
                    <select class="emotion-control">
                        <option value="neutral">Neutral</option>
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="angry">Angry</option>
                    </select>
                </div>
                <button class="preview-btn">Preview</button>
            `;
            voiceMapping.appendChild(div);
        });
    }

    scriptInput.addEventListener('input', function() {
        const parsed = parseScript(this.value);
        speakers = parsed;
        renderSpeakers();
    });

    generateBtn.addEventListener('click', function() {
        if (speakers.length === 0) {
            alert('Please enter a script with speakers.');
            return;
        }
        if (isGenerating) return;
        isGenerating = true;
        this.disabled = true;
        this.textContent = 'Generating...';
        const statusDiv = document.createElement('div');
        statusDiv.className = 'generation-status active';
        statusDiv.textContent = 'Generating audio files...';
        this.parentElement.appendChild(statusDiv);
        setTimeout(() => {
            statusDiv.className = 'generation-status success';
            statusDiv.textContent = 'Audio generation complete! You can now download.';
            downloadBtn.disabled = false;
            isGenerating = false;
            this.disabled = false;
            this.textContent = 'Generate Audio';
        }, 2000);
    });

    downloadBtn.addEventListener('click', function() {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const filename = `Story_${date}.mp3`;
        const text = 'Generated audio content. In production, this would be binary audio data.';
        const blob = new Blob([text], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    renderVoiceMapping();
});
