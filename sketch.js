let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 1280;

const GRID_SIZE = 64;
const BASE_X = GRID_SIZE * 1;
const BASE_Y = GRID_SIZE * 0.5;
const BASE_W = GRID_SIZE * 13;
const UNIT_NUM = 16;
const UNIT_SIZE = BASE_W / UNIT_NUM;
const BUTTON_OFFSET = 0;

const MENU_BOTTUN_W = GRID_SIZE * 2;
const MENU_BUTTON_H = GRID_SIZE;
const MENU_BOTTUN_X = BUTTON_OFFSET + GRID_SIZE * 1;
const MENU_BOTTUN_Y = BUTTON_OFFSET + CANVAS_H - GRID_SIZE * 1.5;

const FILE_BUTTON_X = BUTTON_OFFSET + GRID_SIZE * 2;
const FILE_BUTTON_Y = BUTTON_OFFSET + GRID_SIZE * 10;
const SAVE_BUTTON_X = BUTTON_OFFSET + GRID_SIZE * 2;
const LOAD_BUTTON_X = BUTTON_OFFSET + GRID_SIZE * 5;
const BUTTON_Y = BUTTON_OFFSET + GRID_SIZE * 7;
const BUTTON_W = GRID_SIZE * 2.5;
const BUTTON_H = GRID_SIZE * 1;

const CURSOR_SIZE = UNIT_SIZE * 1.1;
const CURSOR_COLOR = 'orange';
const CURSOR_STROKE = 4;
const CURSOR_MIN_X = 0;
const CURSOR_MIN_Y = 0;
const CURSOR_MAX_X = UNIT_NUM - 1;
const CURSOR_MAX_Y = UNIT_NUM - 1;
const MOVE_UNIT = BASE_W / UNIT_NUM;
const CURSOR_BASE_X = BASE_X + MOVE_UNIT * 0.5;
const CURSOR_BASE_Y = BASE_Y + MOVE_UNIT * 0.5;
const MOVE_RANGE = 4;

const JOYSTICK_X = CANVAS_W - GRID_SIZE * 2;
const JOYSTICK_Y = CANVAS_H - GRID_SIZE * 2;
const JOYSTICK_SIZE = GRID_SIZE * 3;
const JOYSTICK_RANGE = GRID_SIZE * 2;
const JOYSTICK_SUM_C = 4;
let joystick;
const IMAGE_X = BASE_X;
const IMAGE_Y = BASE_Y;
const IMAGE_W = BASE_W;

const NUM_BUTTON_W = GRID_SIZE * 0.8;
const NUM_BUTTON_H = GRID_SIZE;
const NUM_BUTTON_X = GRID_SIZE * 1;
const NUM_BUTTON_Y = GRID_SIZE * 14;
const NUM_BUTTON_INT_X = GRID_SIZE * 0.84;
const NUM_BUTTON_INT_Y = GRID_SIZE * 1.2;
let numButton = [];
let tempNumButton = [];
const TEMP_MARK_POS = {
  1: { x: -1.5, y: -1.5 },
  2: { x: -0.5, y: -1.5 },
  3: { x: 0.5, y: -1.5 },
  4: { x: 1.5, y: -1.5 },
  5: { x: -1.5, y: -0.5 },
  6: { x: -0.5, y: -0.5 },
  7: { x: 0.5, y: -0.5 },
  8: { x: 1.5, y: -0.5 },
  9: { x: -1.5, y: 0.5 },
  10: { x: -0.5, y: 0.5 },
  11: { x: 0.5, y: 0.5 },
  12: { x: 1.5, y: 0.5 },
  13: { x: -1.5, y: 1.5 },
  14: { x: -0.5, y: 1.5 },
  15: { x: 0.5, y: 1.5 },
  16: { x: 1.5, y: 1.5 }
};
const TEMP_MARK_OFFSET = 10;
const TEXTSIZE_MARK = 36;
const TEXTSIZE_TEMP = 12;
const TEXTSIZE_NUM_BUTTON = '32px';

const NUM_CHECK_X = GRID_SIZE * 2;
const NUM_CHECK_Y = GRID_SIZE * 3;
let markRecord;
let markData;
let qImage;
let imageData;
let imageBr = 50;
let checkFlag = false;
let fileInput;
let menuButton, checkButton, imageBrButton;
let saveButton, loadButton, imageButton, setupButton;
let loadFileInput;
let numCheck;
const VIEW_MODE = {
  SETUP: 'SETUP',
  MAIN: 'MAIN',
  MENU: 'MENU'
};
let viewMode = VIEW_MODE.SETUP;

let backButton, skipButton, spaceButton, skipBlockButton;
const SETUP_BUTTON_W = GRID_SIZE * 2;
const SETUP_BUTTON_H = GRID_SIZE * 1;
const SETUP_BUTTON_X = GRID_SIZE * 1;
const SETUP_BUTTON_Y = NUM_BUTTON_Y + GRID_SIZE * 1.5;
const SETUP_BUTTON_INT = SETUP_BUTTON_W + GRID_SIZE * 0.5;
const SETUP_ORDER_16 = [];
const BLOCK_SIZE = 16;
const BLOCK_X = 4;
let orderIndex = 0;
function generateSetupOrder16() {
  for (let blockRow = 0; blockRow < 4; blockRow++) {
    for (let blockCol = 0; blockCol < 4; blockCol++) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          SETUP_ORDER_16.push({
            y: blockRow * 4 + r,
            x: blockCol * 4 + c
          });
        }
      }
    }
  }
}
const DEBUG = true;
const DEBUG_VIEW_X = 40;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}
function handleFile(file) {
  if (file.type == 'image') {
    qImage = loadImage(file.data);
    imageData = file.data;
  }
}
function setupModeInit() {
  backButton = buttonInit('back', SETUP_BUTTON_W, SETUP_BUTTON_H, SETUP_BUTTON_X, SETUP_BUTTON_Y);
  backButton.mousePressed(backFn);
  skipButton = buttonInit('skip', SETUP_BUTTON_W, SETUP_BUTTON_H, SETUP_BUTTON_X + SETUP_BUTTON_INT * 1, SETUP_BUTTON_Y);
  skipButton.mousePressed(skipFn);
  spaceButton = buttonInit('space', SETUP_BUTTON_W, SETUP_BUTTON_H, SETUP_BUTTON_X + SETUP_BUTTON_INT * 2, SETUP_BUTTON_Y);
  spaceButton.mousePressed(spaceFn);
  skipBlockButton = buttonInit('skip block', SETUP_BUTTON_W, SETUP_BUTTON_H, SETUP_BUTTON_X + SETUP_BUTTON_INT * 3, SETUP_BUTTON_Y);
  skipBlockButton.mousePressed(skipBlockFn);
}
function backFn() {
  if (orderIndex > 0) {
    orderIndex--;
  }
  cursor.pos.x = SETUP_ORDER_16[orderIndex].x;
  cursor.pos.y = SETUP_ORDER_16[orderIndex].y;
}
function skipFn() {
  if (orderIndex < SETUP_ORDER_16.length - 1) {
    orderIndex++;
  }
  cursor.pos.x = SETUP_ORDER_16[orderIndex].x;
  cursor.pos.y = SETUP_ORDER_16[orderIndex].y;
}
function spaceFn() {
  const mark = {
    x: cursor.pos.x, y: cursor.pos.y,
    num: 0, temp: false
  }
  addMarkDataFix(mark);
  skipFn();
}
function skipBlockFn() {
  let currentBlock = Math.floor(orderIndex / BLOCK_SIZE);
  let nextBlockStart = (currentBlock + 1) * BLOCK_SIZE;
  if (nextBlockStart < SETUP_ORDER_16.length) {
    orderIndex = nextBlockStart;
  } else {
    orderIndex = SETUP_ORDER_16.length - 1;
  }
  cursor.pos.x = SETUP_ORDER_16[orderIndex].x;
  cursor.pos.y = SETUP_ORDER_16[orderIndex].y;
}
function checkFn() {
  checkFlag = !checkFlag;
}
function imageBrFn() {
  imageBr -= 50;
  if (imageBr < 0){
    imageBr = 250;
  }
}
function modeSelect(mode) {
  switch (mode) {
    case VIEW_MODE.MAIN:
      for (let i = 0; i < numButton.length; i++) {
        if (!numCheck[i].checked) {
          numButton[i].show();
        }
      }
      for (let i = 0; i < tempNumButton.length; i++) {
        tempNumButton[i].show();
      }
      backButton.hide();
      skipButton.hide();
      spaceButton.hide();
      skipBlockButton.hide();
      for (let i = 0; i < numCheck.length; i++) {
        numCheck[i].button.hide();
      }
      menuButton.html('menu');
      imageButton.hide();
      saveButton.hide();
      loadButton.hide();
      setupButton.hide();
      break;
    case VIEW_MODE.MENU:
      for (let i = 0; i < numButton.length; i++) {
        numButton[i].hide();
      }
      for (let i = 0; i < tempNumButton.length; i++) {
        tempNumButton[i].hide();
      }
      backButton.hide();
      skipButton.hide();
      spaceButton.hide();
      skipBlockButton.hide();
      for (let i = 0; i < numCheck.length; i++) {
        numCheck[i].button.show();
      }
      menuButton.html('main');
      imageButton.show();
      saveButton.show();
      loadButton.show();
      setupButton.show();
      break;
    case VIEW_MODE.SETUP:
      for (let i = 0; i < numButton.length; i++) {
        numButton[i].show();
      }
      for (let i = 0; i < tempNumButton.length; i++) {
        tempNumButton[i].hide();
      }
      backButton.show();
      skipButton.show();
      spaceButton.show();
      skipBlockButton.show();
      for (let i = 0; i < numCheck.length; i++) {
        numCheck[i].button.hide();
      }
      menuButton.html('menu');
      imageButton.hide();
      saveButton.hide();
      loadButton.hide();
      setupButton.hide();
      break;
  }
}
function menuFn() {
  switch (viewMode) {
    case VIEW_MODE.MAIN:
      viewMode = VIEW_MODE.MENU;
      break;
    case VIEW_MODE.MENU:
      viewMode = VIEW_MODE.MAIN;
      break;
    case VIEW_MODE.SETUP:
      viewMode = VIEW_MODE.MENU;
      break;
  }
  modeSelect(viewMode);
  /*
    if (viewMode == VIEW_MODE.MAIN) {
      viewMode = VIEW_MODE.MENU;
      for (let i = 0; i < numButton.length; i++) {
        numButton[i].hide();
      }
      for (let i = 0; i < tempNumButton.length; i++) {
        tempNumButton[i].hide();
      }
      for (let i = 0; i < numCheck.length; i++) {
        numCheck[i].button.show();
      }
      menuButton.html('main');
      imageButton.show();
      saveButton.show();
      loadButton.show();
    } else {
      viewMode = VIEW_MODE.MAIN;
      for (let i = 0; i < numButton.length; i++) {
        if (!numCheck[i].checked) {
          numButton[i].show();
        }
      }
      for (let i = 0; i < tempNumButton.length; i++) {
        tempNumButton[i].show();
      }
      for (let i = 0; i < numCheck.length; i++) {
        numCheck[i].button.hide();
      }
      menuButton.html('menu');
      imageButton.hide();
      saveButton.hide();
      loadButton.hide();
    }
  */
}
function saveFn() {
  let jsonObj = {
    'record': markRecord,
    'mark': markData,
    'img': imageData
  }
  const fileName = 'npdata_' + year() + month() + day() + hour() + minute() + second() + '.json';
  save(jsonObj, fileName);
}
function loadFn(file) {
  let jdata = file.data;
  if (jdata.record !== null) {
    markRecord = jdata.record;
//    for (let i = 0; i < jdata.record.length; i++) {
//      markRecord.push(jdata.record[i]);
//      addMarkData(jdata.record[i]);
//    }
  }
  if (jdata.mark !== null){
    markData = jdata.mark;
  }
//  if (jdata.img !== null) {
  if ('img' in jdata){
    qImage = loadImage(jdata.img);
  }
}
function setupFn() {
  viewMode = VIEW_MODE.SETUP;
  modeSelect(viewMode);
}
function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  time = millis();
  rectMode(CENTER);

  textAlign(CENTER, CENTER);
  joystickInit();
  numButtonInit();
  cursorInit();
  //  markData = [];
  markRecord = [];
  fileInput = createFileInput(handleFile);
  fileInput.hide();
  imageButton = buttonInit('ImageFile', BUTTON_W, BUTTON_H, FILE_BUTTON_X, FILE_BUTTON_Y);
  imageButton.mousePressed(function () {
    fileInput.elt.click();
  });
  setupButton = buttonInit('setup', BUTTON_W, BUTTON_H, FILE_BUTTON_X + BUTTON_W + GRID_SIZE * 0.5, FILE_BUTTON_Y);
  setupButton.mousePressed(setupFn);
  menuButton = buttonInit('menu', MENU_BOTTUN_W, MENU_BUTTON_H, MENU_BOTTUN_X, MENU_BOTTUN_Y);
  menuButton.mousePressed(menuFn);
  imageBrButton = buttonInit('imageBr', MENU_BOTTUN_W, MENU_BUTTON_H, MENU_BOTTUN_X+(MENU_BOTTUN_W+GRID_SIZE)*1, MENU_BOTTUN_Y);
  imageBrButton.mousePressed(imageBrFn);
  checkButton = buttonInit('check', MENU_BOTTUN_W, MENU_BUTTON_H, MENU_BOTTUN_X+(MENU_BOTTUN_W+GRID_SIZE)*2, MENU_BOTTUN_Y);
  checkButton.mousePressed(checkFn);
  saveButton = buttonInit('save', BUTTON_W, BUTTON_H, SAVE_BUTTON_X, BUTTON_Y);
  saveButton.mousePressed(saveFn);
  loadFileInput = createFileInput(loadFn);
  loadFileInput.hide();
  loadButton = buttonInit('open', BUTTON_W, BUTTON_H, LOAD_BUTTON_X, BUTTON_Y);
  loadButton.mousePressed(function () {
    loadFileInput.elt.click();
  });
  numCheckInit();
  setupModeInit();
  viewMode = VIEW_MODE.SETUP;
  modeSelect(viewMode);
  generateSetupOrder16();

  initMarkData();
}
function buttonInit(text, w, h, x, y) {
  let button = createButton(text);
  button.size(w, h);
  button.position(x, y);
  button.style('font-size', '16px');
  return button;
}
function numCheckInit() {
  numCheck = [];
  for (let i = 0; i < UNIT_NUM; i++) {
    let nc = {};
    nc.checked = false;
    nc.pos = {};
    let button = createButton(i + 1);
    button.size(NUM_BUTTON_W, NUM_BUTTON_H);
    button.position(NUM_BUTTON_X + NUM_BUTTON_INT_X * i, NUM_CHECK_Y);
    button.style('font-size', TEXTSIZE_NUM_BUTTON);
    button.mousePressed(function () {
      nc.checked = !nc.checked;
    });
    button.hide();
    nc.button = button;
    numCheck.push(nc);
  }
}
function cursorInit() {
  cursor = {};
  cursor.pos = {};
  cursor.pos.x = CURSOR_MIN_X;
  cursor.pos.y = CURSOR_MIN_Y;
  cursor.tPos = {};
}
function numButtonInit() {
  for (let i = 0; i < UNIT_NUM; i++) {
    let button = createButton(i + 1);
    button.size(NUM_BUTTON_W, NUM_BUTTON_H);
    button.position(NUM_BUTTON_X + NUM_BUTTON_INT_X * i, NUM_BUTTON_Y);
    button.style('font-size', TEXTSIZE_NUM_BUTTON);
    button.mousePressed(function () {
      numButtonFn(i + 1);
    });
    numButton.push(button);
    let tButton = createButton(i + 1);
    tButton.size(NUM_BUTTON_W, NUM_BUTTON_H);
    tButton.position(NUM_BUTTON_X + NUM_BUTTON_INT_X * i, NUM_BUTTON_Y + NUM_BUTTON_INT_Y);
    tButton.style('color', 'gray');
    tButton.style('font-size', TEXTSIZE_NUM_BUTTON);
    tButton.mousePressed(function () {
      tempNumButtonFn(i + 1);
    });
    tempNumButton.push(tButton);
  }
}
function numButtonFn(n) {
  const mark = {
    x: cursor.pos.x, y: cursor.pos.y,
    num: n, temp: false
  };
  if (viewMode===VIEW_MODE.MAIN){
    markRecord.push(mark);
    addMarkData(mark);
  }else if (viewMode===VIEW_MODE.SETUP){
    addMarkDataFix(mark);
    skipFn();
  }
}
function tempNumButtonFn(n) {
  const mark = {
    x: cursor.pos.x, y: cursor.pos.y,
    num: n, temp: true
  };
  markRecord.push(mark);
  addMarkData(mark);
}
function initMarkData() {
  markData = [];
  for (let y = 0; y < UNIT_NUM; y++) {
    for (let x = 0; x < UNIT_NUM; x++) {
      let mark = {
        x: x, y: y,
        num: 0,
        tempNum: [],
        fix: false
      }
      markData.push(mark);
    }
  }
  markData.push()
}
function addMarkData(mark) {
  const r = mark.y * UNIT_NUM + mark.x;
  if (markData[r].fix) {
    return;
  }
  if (mark.temp) {
    const l = markData[r].tempNum.length;
    for (let i = 0; i < markData[r].tempNum.length; i++) {
      if (mark.num === markData[r].tempNum[i]) {
        markData[r].tempNum.splice(i, 1);
        break;
      }
    }
    if (l === markData[r].tempNum.length) {
      markData[r].tempNum.push(mark.num);
    }
  } else {
    if (markData[r].num === mark.num) {
      markData[r].num = 0;
    } else {
      markData[r].num = mark.num;
    }
  }
}
function addMarkDataFix(mark) {
  const r = mark.y * UNIT_NUM + mark.x;
  markData[r].num = mark.num;
  if (mark.num===0){
    markData[r].fix = false;
  }else{
    markData[r].fix = true;
  }
}
/*
function searchMarkData(x, y) {
  for (let i = 0; i < markData.length; i++) {
    if ((x == markData[i].x) && (y == markData[i].y)) {
      return i;
    }
  }
  return -1;
}
*/
function joystickInit() {
  joystick = {};
  joystick.pos = {};
  joystick.pos.x = JOYSTICK_X;
  joystick.pos.y = JOYSTICK_Y;
  joystick.offset = {};
  joystick.offset.x = 0;
  joystick.offset.y = 0;
  joystick.sum = {};
  joystick.sum.x = 0;
  joystick.sum.y = 0;
  joystick.control = false;
}
function cursorMove(x, y) {
  cursor.pos.x += x;
  if (cursor.pos.x >= CURSOR_MAX_X) {
    cursor.pos.x = CURSOR_MAX_X;
  } else if (cursor.pos.x <= CURSOR_MIN_X) {
    cursor.pos.x = CURSOR_MIN_X;
  }
  cursor.pos.y += y;
  if (cursor.pos.y >= CURSOR_MAX_Y) {
    cursor.pos.y = CURSOR_MAX_Y;
  } else if (cursor.pos.y <= CURSOR_MIN_Y) {
    cursor.pos.y = CURSOR_MIN_Y;
  }
}
function drawBackImage() {
    fill(255);
    rect(IMAGE_X + IMAGE_W / 2, IMAGE_Y + IMAGE_W / 2, IMAGE_W, IMAGE_W);
  if (qImage != null) {
    image(qImage, IMAGE_X, IMAGE_Y, IMAGE_W, IMAGE_W);
    fill(255,255,255,255-imageBr);
    rect(IMAGE_X + IMAGE_W / 2, IMAGE_Y + IMAGE_W / 2, IMAGE_W, IMAGE_W);    
  }
}
function drawMainView() {
  stroke(160);
//  strokeWeight(1);
  for (let i = 0; i < UNIT_NUM + 1; i++) {
    if (i % BLOCK_X === 0){
      strokeWeight(3);
    }else{
      strokeWeight(1);
    }
    line(BASE_X, BASE_Y + UNIT_SIZE * i, BASE_X + UNIT_SIZE * UNIT_NUM, BASE_Y + UNIT_SIZE * i);
    line(BASE_X + UNIT_SIZE * i, BASE_Y, BASE_X + UNIT_SIZE * i, BASE_Y + UNIT_SIZE * UNIT_NUM);
  }
  noStroke();
  for (let i = 0; i < markData.length; i++) {
    const cx = CURSOR_BASE_X + MOVE_UNIT * markData[i].x;
    const cy = CURSOR_BASE_Y + MOVE_UNIT * markData[i].y;
    if (markData[i].num === 0) {
      fill(48);
      textSize(TEXTSIZE_TEMP);
      for (let j = 0; j < markData[i].tempNum.length; j++) {
        const tx = cx + TEMP_MARK_OFFSET * TEMP_MARK_POS[markData[i].tempNum[j]].x;
        const ty = cy + TEMP_MARK_OFFSET * TEMP_MARK_POS[markData[i].tempNum[j]].y;
        text(markData[i].tempNum[j], tx, ty);
      }
    } else {
      if (markData[i].fix){
        fill('blue');
      }else{
      fill(0);
      }
      textSize(TEXTSIZE_MARK);
      text(markData[i].num, cx, cy);
    }
  }
}
function drawCursor() {
  noFill();
  stroke(CURSOR_COLOR);
  strokeWeight(CURSOR_STROKE);
  rect(CURSOR_BASE_X + MOVE_UNIT * cursor.pos.x, CURSOR_BASE_Y + MOVE_UNIT * cursor.pos.y, CURSOR_SIZE);
}
function draw() {
  background(64);
  let current = millis();
  if ((current - time) >= 1000) {
    time += 1000;
    fps = frameCount - frameCountBuffer;
    frameCountBuffer = frameCount;
  }
  if (DEBUG) {
    stroke(128);
    strokeWeight(1);
    for (let i = 0; i < CANVAS_H / GRID_SIZE; i++) {
      line(0, i * GRID_SIZE, CANVAS_W, i * GRID_SIZE);
    }
    for (let i = 0; i < CANVAS_W / GRID_SIZE; i++) {
      line(i * GRID_SIZE, 0, i * GRID_SIZE, CANVAS_H);
    }
  }
  switch (viewMode) {
    case VIEW_MODE.MAIN:
      drawBackImage();
      if (!checkFlag){
        drawMainView();
      }
      if (joystick.control) {
        if (joystick.pos.x >= JOYSTICK_X + JOYSTICK_RANGE) {
          joystick.pos.x = JOYSTICK_X + JOYSTICK_RANGE;
        } else if (joystick.pos.x <= JOYSTICK_X - JOYSTICK_RANGE) {
          joystick.pos.x = JOYSTICK_X - JOYSTICK_RANGE;
        }
        if (joystick.pos.y >= JOYSTICK_Y + JOYSTICK_RANGE) {
          joystick.pos.y = JOYSTICK_Y + JOYSTICK_RANGE;
        } else if (joystick.pos.y <= JOYSTICK_Y - JOYSTICK_RANGE) {
          joystick.pos.y = JOYSTICK_Y - JOYSTICK_RANGE;
        }
      } else {
        joystick.pos.x = JOYSTICK_X;
        joystick.pos.y = JOYSTICK_Y;
      }
      joystick.x = (joystick.pos.x - JOYSTICK_X) / JOYSTICK_RANGE;
      joystick.y = (joystick.pos.y - JOYSTICK_Y) / JOYSTICK_RANGE;
      if (joystick.control) {
        cursor.pos.x = cursor.tPos.x;
        cursor.pos.y = cursor.tPos.y;
        cursorMove(int(joystick.x * MOVE_RANGE), int(joystick.y * MOVE_RANGE));
      } else {
        cursor.tPos.x = cursor.pos.x;
        cursor.tPos.y = cursor.pos.y;
      }
      drawCursor();
      fill(200);
      noStroke();
      circle(joystick.pos.x, joystick.pos.y, JOYSTICK_SIZE);
      break;
    case VIEW_MODE.MENU:
      noStroke();
      fill(200);
      textSize(48);
      for (let i = 0; i < numCheck.length; i++) {
        if (numCheck[i].checked) {
          text('x', numCheck[i].button.x + NUM_BUTTON_W / 2 - BUTTON_OFFSET, numCheck[i].button.y - NUM_BUTTON_H / 2);
        }
      }
      break;
    case VIEW_MODE.SETUP:
      drawBackImage();
      if (!checkFlag){
        drawMainView();
      }
      drawCursor();
      break;
  }

  fill(255);
  stroke(255);
  textSize(16);
  strokeWeight(1);
  let debugY = DEBUG_VIEW_Y;
  text('fps:' + fps, DEBUG_VIEW_X, debugY);
}
function touchStarted() {
  let tp = [];
  for (let i = 0; i < touches.length; i++) {
    if (tp[i] == null) {
      tp[i] = [];
    }
    tp[i].x = touches[i].x;
    tp[i].y = touches[i].y;
  }
  let tx, ty;
  if (tp[0] != null) {
    tx = tp[0].x;
    ty = tp[0].y;
  } else {
    tx = mouseX;
    ty = mouseY;
  }
  const d = dist(tx, ty, joystick.pos.x, joystick.pos.y);
  if (d <= JOYSTICK_SIZE / 2) {
    joystick.control = true;
    joystick.offset.x = joystick.pos.x - tx;
    joystick.offset.y = joystick.pos.y - ty;
  }
}
function touchEnded() {
  joystick.control = false;
}
function touchMoved() {
  let tp = [];
  for (let i = 0; i < touches.length; i++) {
    if (tp[i] == null) {
      tp[i] = [];
    }
    tp[i].x = touches[i].x;
    tp[i].y = touches[i].y;
  }
  let tx, ty;
  if (tp[0] != null) {
    tx = tp[0].x;
    ty = tp[0].y;
  } else {
    tx = mouseX;
    ty = mouseY;
  }
  if (joystick.control) {
    joystick.pos.x = tx + joystick.offset.x;
    joystick.pos.y = ty + joystick.offset.y;
  }
  return false;
}