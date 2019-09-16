

// const MAX_SIZE = 20 * 1024 * 1024
export default function chooseImage() {
  let chooseImageId = document.getElementById('__chooseImage_input')
  if (chooseImageId) {
    document.body.removeChild(chooseImageId)
  }

  const obj = document.createElement('input')
  obj.setAttribute('type', 'file')
  obj.setAttribute('id', '__chooseImage_input')
  obj.setAttribute('multiple', 'multiple')
  obj.setAttribute('accept', 'image/png, image/jpeg, image/jpg')
  obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
  document.body.appendChild(obj)
  chooseImageId = document.getElementById('__chooseImage_input')

  let chooseImageCallback

  const chooseImagePromise = new Promise((resolve, reject) => {
    chooseImageCallback = resolve
  })
  const mouseEvents = document.createEvent('MouseEvents')
  mouseEvents.initEvent('click', true, true)
  chooseImageId.dispatchEvent(mouseEvents)
  chooseImageId.onchange = function (e) {
    const file = e.target.files[0]
    // if (file.size > MAX_SIZE) chooseImageCallback(null)
    chooseImageCallback(file)
  }
  return chooseImagePromise
}
