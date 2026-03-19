# Yebails

Yebails is a high-performance, feature-rich WhatsApp Web API library for Node.js. Optimized for speed and protocol accuracy, it supports the latest features including Multi-Device, Newsletters, Communities, and Advanced Messaging Protocols.

## Features

- **Multi-Device Support**: Efficient session management.
- **MEX Protocol**: GraphQL-style queries for modern WA features.
- **Newsletters & Channels**: Full management of WhatsApp Channels.
- **Communities**: Parent-group and subgroup linking.
- **LID & PN Mapping**: Identity resolution for Logical IDs.
- **MCC Lookup**: Integrated Mobile Country Code detection.
- **Automated Updates**: Keeps its version synced with WhatsApp Web revisions.

## Installation

```bash
npm install yemo-dev/yebails
```

## Connection

### Using QR Code
```javascript
const makeWASocket = require('yebails').default;
const { useMultiFileAuthState } = require('yebails');

async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });
    sock.ev.on('creds.update', saveCreds);
}
```

### Using Pairing Code
```javascript
const sock = makeWASocket({
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
});

if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode('628xxx');
    console.log('Pairing Code:', code);
}
```

## Basic Messaging

### Send Text & Media
```javascript
// Simple Text
await sock.sendMessage(jid, { text: 'Hello!' });

// Image with Caption
await sock.sendMessage(jid, { 
    image: { url: './image.jpg' }, 
    caption: 'Behold!' 
});

// Location
await sock.sendMessage(jid, { 
    location: { degreesLatitude: -7.0, degreesLongitude: 110.0 } 
});
```

## Advanced Messaging (ctx, pay, ai)

### Interactive Context (ctx)
```javascript
await sock.sendMessage(jid, {
    text: 'Check this out!',
    contextInfo: {
        externalAdReply: {
            title: 'Yebails API',
            body: 'Advanced Baileys Fork',
            mediaType: 1,
            thumbnailUrl: 'https://example.com/icon.png',
            sourceUrl: 'https://github.com/yemo-dev/yebails'
        }
    }
});
```

### Payments (pay)
```javascript
await sock.sendMessage(jid, {
    paymentRequestMessage: {
        curr: 'USD',
        amount1000: 5000,
        status: 1,
        noteMessage: { extendedTextMessage: { text: 'Monthly Subscription' } }
    }
});
```

### AI & Specialized Icons
Yebails supports custom internal flags for AI-integrated message icons and specialized protocol markers via `additionalAttributes`.

```javascript
await sock.sendMessage(jid, { text: 'AI Response' }, { 
    additionalAttributes: { 'biz_source': 'ai_agent' } 
});
```

## Utility Functions

### MCC Lookup
Get the Mobile Country Code for any number.
```javascript
const { getMCC } = require('yebails/lib/Utils');
const mcc = getMCC('62812345678'); // Returns "510" (Indonesia)
```

### Version Tracking
```javascript
const { fetchLatestWaWebVersion } = require('yebails/lib/Utils');
const { version } = await fetchLatestWaWebVersion();
console.log('Latest WA Web Version:', version);
```

## Credits

Developed and maintained by **yemobyte**. Special thanks to the **WhiskeySockets** and **Itsukichann** communities for the foundational protocol research.

## License
MIT
