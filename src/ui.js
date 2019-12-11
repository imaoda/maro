/**
 * loading
 */

var loadingDOM = null;
var spinner = null;
var loadingStyle =
  'z-index:3000;position:fixed;left:0;top:0;height:100%;width:100%;background:rgba(255,255,255,0.3);display:flex;justify-content:center;align-items:center;user-select:none;';
var hideStyle = 'display:none;';
var spinnerBaseStyle = 'transition: all 100s linear;font-size:30px;color:rgba(0,0,0,0.5)';
var spinnerAdd =
  'transition: all 100s linear;font-size:30px;color:rgba(0,0,0,0.5);transform: rotate(18000deg);';

if (typeof window !== 'undefined') {
  // 说明是在 浏览器中
  loadingDOM = document.createElement('div');
  spinner = document.createElement('div');
  loadingDOM.appendChild(spinner);
  spinner.setAttribute('style', spinnerBaseStyle);
  spinner.innerHTML = '❄';
  loadingDOM.setAttribute('style', hideStyle);
  document.documentElement.appendChild(loadingDOM);
}

export function showLoading() {
  if (!loadingDOM) return;
  loadingDOM.setAttribute('style', loadingStyle);
  setTimeout(() => {
    if (spinner.getAttribute('style') === spinnerBaseStyle) {
      spinner.setAttribute('style', spinnerAdd);
    } else {
      spinner.setAttribute('style', spinnerBaseStyle);
    }
  }, 10);
}

export function hideLoading() {
  if (!loadingDOM) return;
  loadingDOM.setAttribute('style', hideStyle);
  setTimeout(() => {
    spinner.setAttribute('style', spinnerBaseStyle);
  }, 10);
}

/**
 * toast
 */

var toastContainer = null;
var toastSize = 'height:30px;width:200px;';
var toastHide = 'display:none;';
var toastContainerStyle =
  'z-index:3001;position:fixed;top:20px;left:50%;transform:translate(-50%,0);background:white;overflow:hidden;filter:drop-shadow(0 0 10px rgba(0,0,0,0.2));border-radius:5px;';
var toastContentStyle =
  'position:absolute;top:0;left:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:white;' +
  toastSize;

if (typeof window !== 'undefined') {
  // 说明是在 浏览器中
  toastContainer = document.createElement('div');
  toastContainer.setAttribute('style', toastHide);
  document.documentElement.appendChild(toastContainer);
}

export function showToast(msg, color, delay) {
  if (!toastContainer) return;
  toastContainer.setAttribute('style', toastContainerStyle + toastSize);
  if (typeof msg !== 'string') return;
  var text = document.createTextNode(msg);
  var dom = document.createElement('div');
  dom.appendChild(text);
  toastContainer.appendChild(dom);
  if (!delay) delay = 3000;
  var style = toastContentStyle;
  if (color) style = toastContentStyle + 'color:' + color;
  dom.setAttribute('style', style);
  setTimeout(() => {
    toastContainer.removeChild(dom);
    if (toastContainer.children.length === 0) {
      toastContainer.setAttribute('style', toastHide);
    }
  }, delay);
}
