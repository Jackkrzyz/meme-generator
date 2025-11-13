// todo: dynamic cards instead of selecting a card to edit

const canvas = document.getElementById('imageEditor');

// User Inputs
const loadImageButton = document.getElementById('loadImageButton');
const imageInputDiv = document.getElementById('imageInput');
const includeTopHeaderCheckbox = document.getElementById('includeTopHeader');
const includeBottomHeaderCheckbox = document.getElementById('includeBottomHeader');

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

let imageWidth = 0;
let imageHeight = 0;
let currentImage = null;

class text {
    constructor(content, fontSize = 20, color = '#000000ff', x = 0, y = 0) {
        this.content = content;
        this.fontSize = fontSize;
        this.color = color;
        this.x = x;
        this.y = y;
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

    let headerCount = (includeTopHeaderCheckbox.checked ? 1 : 0) + (includeBottomHeaderCheckbox.checked ? 1 : 0);
    let newHeight = imageHeight + headerCount * 50;
    canvas.height = newHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    const imageYOffset = includeTopHeaderCheckbox.checked ? 50 : 0;
    ctx.drawImage(currentImage, 0, imageYOffset);

    for (let textObj of texts) {
        const size = Number.isFinite(Number(textObj.fontSize)) ? textObj.fontSize : 20;
        ctx.font = `${size}px impact`;
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

includeTopHeaderCheckbox.addEventListener('change', () => {
    redrawLayout()
})

includeBottomHeaderCheckbox.addEventListener('change', () => {
    redrawLayout();
});

addTextButton.addEventListener('click', () => {
    const content = newTextInput.value;
    if (content.trim() === '') {
        alert('Text content cannot be empty.');
        return;
    }
    const startX = 10;
    const startY = 10 + texts.length * 30;
    const textObj = new text(content, 50, fontColorInput.value, 0, 50 + texts.length * 30);
    texts.push(textObj);
    newTextInput.value = '';
    updateSelectTextDropdown();
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

updateTextButton.addEventListener('click', () => {
    if (selectedTextIndex >= 0 && selectedTextIndex < texts.length) {
        const selectedTextObj = texts[selectedTextIndex];
        selectedTextObj.content = selectedTextInput.value;
        selectedTextObj.fontSize = parseInt(fontSizeInput.value);
        selectedTextObj.color = fontColorInput.value;
        selectedTextObj.x = parseInt(textXInput.value);
        selectedTextObj.y = parseInt(textYInput.value);
        updateSelectTextDropdown();
        selectTextDropdown.value = String(selectedTextIndex);
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