browser.runtime.onMessage.addListener((message, sender, response) => {
    location.href = message.link;
})
