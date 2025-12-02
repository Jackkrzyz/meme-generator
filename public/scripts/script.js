
// todo: dynamic cards instead of selecting a card to edit
const canvas = document.getElementById('imageEditor');

// User Inputs
const loadImageButton = document.getElementById('loadImageButton');
const imageUpload = document.getElementById('imageUpload');
const imageInputDiv = document.getElementById('imageInput');

const llmImagePrompt = document.getElementById('llmImagePrompt');
const generateImageButton = document.getElementById('generateImageButton');
    
const topHeaderHeightInput = document.getElementById('topHeaderHeight');
const bottomHeaderHeightInput = document.getElementById('bottomHeaderHeight');
const topHeaderHeightValue = document.getElementById('topHeaderHeightValue');
const bottomHeaderHeightValue = document.getElementById('bottomHeaderHeightValue');

const addTextButton = document.getElementById('addTextButton');
const newTextInput = document.getElementById('newTextInput');


const selectTextDropdown = document.getElementById('selectTextDropdown');

const selectedTextInput = document.getElementById('selectedTextInput');
const textXInput = document.getElementById('textXInput');
const textYInput = document.getElementById('textYInput');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontColorInput = document.getElementById('fontColorInput');
const updateTextButton = document.getElementById('updateTextButton');
const deleteTextButton = document.getElementById('deleteTextButton');
const centerTextXButton = document.getElementById('centerTextXButton');
const centerTextYButton = document.getElementById('centerTextYButton');
const downloadMemeButton = document.getElementById('downloadMemeButton');

let imageWidth = 0;
let imageHeight = 0;
let currentImage = null;

class text {
    constructor(content, fontSize = 20, color = '#000000ff', x = 0, y = 0, fontFamily = 'Impact, Anton, sans-serif') {
        this.content = content;
        this.fontSize = fontSize;
        this.color = color;
        this.x = x;
        this.y = y;
        this.fontFamily = fontFamily;
    }
}
let texts = [];
let selectedTextIndex = -1;

function redrawLayout() {
    if (!currentImage) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const topHeaderHeight = parseInt(topHeaderHeightInput.value) || 0;
    const bottomHeaderHeight = parseInt(bottomHeaderHeightInput.value) || 0;

    let newHeight = imageHeight + topHeaderHeight + bottomHeaderHeight;
    canvas.height = newHeight;
    textXInput.max = canvas.width;
    textYInput.max = canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    const imageYOffset = topHeaderHeight;
    ctx.drawImage(currentImage, 0, imageYOffset);

    for (let textObj of texts) {
        const size = Number.isFinite(Number(textObj.fontSize)) ? textObj.fontSize : 20;
        const font = textObj.fontFamily || 'Impact, Anton, sans-serif';
        ctx.font = `${size}px ${font}`;
        ctx.fillStyle = textObj.color;
        ctx.fillText(textObj.content, textObj.x, textObj.y, canvas.width);
    }
}

function updateSelectTextDropdown() {
    selectTextDropdown.innerHTML = '<option value="" disabled selected>Select text</option>';
    texts.forEach((textObj, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = textObj.content;
        selectTextDropdown.appendChild(option);
    });
}

topHeaderHeightInput.addEventListener('input', () => {
    topHeaderHeightValue.textContent = topHeaderHeightInput.value;
    redrawLayout()
})

bottomHeaderHeightInput.addEventListener('input', () => {
    bottomHeaderHeightValue.textContent = bottomHeaderHeightInput.value;
    redrawLayout();
});

addTextButton.addEventListener('click', () => {
    const content = newTextInput.value;
    if (content.trim() === '') {
        alert('Text content cannot be empty.');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.font = '50px Impact, Anton, sans-serif';
    const textWidth = ctx.measureText(content).width;
    const centerX = (canvas.width - textWidth) / 2;

    const textObj = new text(content, 50, fontColorInput.value, centerX, 50 + texts.length * 30, 'Impact, Anton, sans-serif');
    texts.push(textObj);
    newTextInput.value = '';
    updateSelectTextDropdown();

    // Automatically select the new text
    selectedTextIndex = texts.length - 1;
    selectTextDropdown.value = selectedTextIndex;
    selectedTextInput.value = textObj.content;
    fontSizeInput.value = textObj.fontSize;
    fontColorInput.value = textObj.color;
    textXInput.value = textObj.x;
    textYInput.value = textObj.y;

    redrawLayout();
});

selectTextDropdown.addEventListener('change', () => {
    selectedTextIndex = parseInt(selectTextDropdown.value);
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        const selectedTextObj = texts[selectedTextIndex];
        selectedTextInput.value = selectedTextObj.content;
        fontSizeInput.value = selectedTextObj.fontSize;
        fontColorInput.value = selectedTextObj.color;
        textXInput.value = selectedTextObj.x;
        textYInput.value = selectedTextObj.y;
    }
});

textXInput.addEventListener('change', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        texts[selectedTextIndex].x = parseInt(textXInput.value);
        redrawLayout();
    }
});
textYInput.addEventListener('change', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        texts[selectedTextIndex].y = parseInt(textYInput.value);
        redrawLayout();
    }
});
fontSizeInput.addEventListener('change', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        texts[selectedTextIndex].fontSize = parseInt(fontSizeInput.value);
        redrawLayout();
    }
});
fontColorInput.addEventListener('change', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        texts[selectedTextIndex].color = fontColorInput.value;
        redrawLayout();
    }
});

centerTextXButton.addEventListener('click', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        const textObj = texts[selectedTextIndex];
        const ctx = canvas.getContext('2d');
        ctx.font = `${textObj.fontSize}px impact`;
        const textWidth = ctx.measureText(textObj.content).width;
        textObj.x = (canvas.width - textWidth) / 2;
        textXInput.value = textObj.x;
        redrawLayout();
    }
});

centerTextYButton.addEventListener('click', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        const textObj = texts[selectedTextIndex];
        // Approximate vertical centering
        textObj.y = (canvas.height / 2) + (textObj.fontSize / 3);
        textYInput.value = textObj.y;
        redrawLayout();
    }
});

deleteTextButton.addEventListener('click', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        texts.splice(selectedTextIndex, 1);
        selectedTextIndex = -1;
        selectedTextInput.value = '';
        updateSelectTextDropdown();
        redrawLayout();
    }
});
loadImageButton.addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = "Anonymous"; 
    image.onload = () => {
        imageInputDiv.style.border = '2px solid green';
        canvas.width = image.width;
        canvas.height = image.height;
        imageWidth = image.width;
        imageHeight = image.height;
        currentImage = image;
        redrawLayout();
        updateSelectTextDropdown();
    };
    image.onerror = () => {
        imageInputDiv.style.border = '2px solid red';
        alert('Failed to load image. Please check the URL and try again.');
    };
    image.src = imageUrl;
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
            imageInputDiv.style.border = '2px solid green';
            canvas.width = image.width;
            canvas.height = image.height;
            imageWidth = image.width;
            imageHeight = image.height;
            currentImage = image;
            redrawLayout();
            updateSelectTextDropdown();
        };
        image.onerror = () => {
            imageInputDiv.style.border = '2px solid red';
            alert('Failed to load uploaded image.');
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

const loadingOverlay = document.getElementById('loadingOverlay');

generateImageButton.addEventListener('click', async () => {
    const prompt = llmImagePrompt.value;
    loadingOverlay.style.display = 'flex';
    try {
        const response = await fetch('/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        const imageUrl = data.imageUrl;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = () => {
            imageInputDiv.style.border = '2px solid green';
            canvas.width = image.width;
            canvas.height = image.height;
            imageWidth = image.width;
            imageHeight = image.height;
            currentImage = image;
            redrawLayout();
            updateSelectTextDropdown();
            loadingOverlay.style.display = 'none';
        };
        image.onerror = () => {
            imageInputDiv.style.border = '2px solid red';
            alert('Failed to load generated image.');
            loadingOverlay.style.display = 'none';
        };
        image.src = imageUrl;
    } catch (error) {
        imageInputDiv.style.border = '2px solid red';
        alert('Error: ' + error.message);
        loadingOverlay.style.display = 'none';
    }
});

downloadMemeButton.addEventListener('click', () => {
    if (!currentImage) {
        alert('No image to download! Load or generate an image first.');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});



