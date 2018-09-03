const { webFrame } = require('electron')
const DiscordRPC = require('discord-rpc')
const clientId = '399794061059424257'

webFrame.setVisualZoomLevelLimits(1, 1)

DiscordRPC.register(clientId)
const rpc = new DiscordRPC.Client({ transport: 'ipc' })

const presenceForm = document.getElementById('presenceForm')
const presenceDiv = document.getElementById('formDiv')
const largeImageSelect = document.getElementById('largeImageSelect')
const smallImageSelect = document.getElementById('smallImageSelect')

const helpDiv = document.getElementById('helpSection')
const helpButton = document.getElementById('helpButton')
let helpOpen = false

helpButton.addEventListener('click', () => {
  if (helpOpen) {
    helpDiv.style.display = 'none'
    presenceDiv.style.display = 'block'
    helpButton.textContent = 'Help'
    helpOpen = false
    return
  }

  helpDiv.style.display = 'block'
  presenceDiv.style.display = 'none'
  helpButton.textContent = 'Back'
  helpOpen = true
})

document.getElementById('submit').addEventListener('click', () => {
  const details = presenceForm.details.value
  const state = presenceForm.state.value
  const startTimestamp = presenceForm.startTimestamp.value
  const largeImageText = presenceForm.largeImageText.value
  const smallImageText = presenceForm.smallImageText.value
  const largeImageKey = largeImageSelect.options[largeImageSelect.selectedIndex].value
  const smallImageKey = smallImageSelect.options[smallImageSelect.selectedIndex].value

  if (!details || !state || !largeImageText || !smallImageText) {
    return alert('Please fill out all fields.')
  }

  setActivity(details, state, startTimestamp, largeImageText, smallImageText, largeImageKey, smallImageKey)
})

let lastSetActivity
async function setActivity(details, state, startTimestamp, largeImageText, smallImageText, largeImageKey, smallImageKey) {
  if (!rpc) {
    return
  }

  if (!lastSetActivity || Date.now() - 15000 > lastSetActivity) {
    lastSetActivity = Date.now()

    rpc.setActivity({
      details,
      state,
      startTimestamp: startTimestamp ? parseInt(startTimestamp) : Math.floor(new Date().getTime() / 1000),
      largeImageKey: largeImageKey ? largeImageKey : 'macho',
      largeImageText,
      smallImageKey: smallImageKey ? smallImageKey : 'macho',
      smallImageText,
      instance: false,
    })
  } else {
    alert('Presences can only be updated every 15 seconds.')
  }
}

rpc.login({ clientId })
