# Yebails

Yebails is a high-performance, feature-rich WhatsApp Web API library for Node.js. It is a specialized fork of Baileys, optimized for speed, stability, and protocol accuracy. This library supports the latest WhatsApp Web features, including Multi-Device, Newsletters (Channels), Communities, and MEX protocol queries.

## Key Features

- **Full Multi-Device Support**: Efficient session management and synchronization.
- **MEX Protocol**: Support for GraphQL-style Message Exchange queries used in modern WA features.
- **Newsletters & Channels**: Complete API for creating, managing, and subscribing to newsletters.
- **Communities**: Robust support for managing communities and parent-linked groups.
- **LID & PN Mapping**: Advanced handling of Lid (Logical Identity) and Phone Number resolutions.
- **Automated Version Updates**: Integrated mechanism to fetch and update the latest WhatsApp Web client revision.

## Installation

```bash
npm install yemo-dev/yebails
```

## Basic Usage

### Connection

```javascript
const makeWASocket = require('yebails').default;
const { useMultiFileAuthState } = require('yebails');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== 401;
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Opened connection');
        }
    });

    return sock;
}
```

## Messaging Examples

### Sending a Simple Text Message

```javascript
await sock.sendMessage(jid, { text: 'Hello from Yebails!' });
```

### Context and Mentions (ctx)

```javascript
await sock.sendMessage(jid, { 
    text: 'Hello @1234567890', 
    mentions: ['1234567890@s.whatsapp.net'],
    contextInfo: {
        externalAdReply: {
            title: 'Yebails API',
            body: 'Modern WhatsApp Library',
            mediaType: 2,
            thumbnailUrl: 'https://example.com/thumb.jpg',
            sourceUrl: 'https://github.com/yemo-dev/yebails'
        }
    }
});
```

### Sending a Payment Request (pay)

```javascript
const { proto } = require('yebails');

await sock.sendMessage(jid, {
    paymentRequestMessage: {
        curr: 'USD',
        amount1000: 10000, // $10.00
        receiverJid: jid,
        status: proto.Message.PaymentRequestMessage.Status.PENDING,
        noteMessage: { extendedTextMessage: { text: 'Payment for services' } }
    }
});
```

## Advanced Features

### Newsletters (Channels)

```javascript
// Creating a newsletter
const metadata = await sock.newsletterCreate('My Channel', 'Description of the channel');
console.log('Created Newsletter:', metadata.id);

// Subscribing/Unsubscribing
await sock.newsletterSubscribe(newsletterJid);
await sock.newsletterUnsubscribe(newsletterJid);

// Fetching metadata via MEX
const info = await sock.newsletterMetadata('jid', newsletterJid);
```

### Communities

```javascript
// Creating a community
const result = await sock.communityCreate('Work Community', 'Discussion for all work subgroups');

// Linking a group to a community
await sock.communityLinkGroup(subGroupJid, communityJid);

// Fetching participating communities
const communities = await sock.communityFetchAllParticipating();
```

### Identity Resolution (LID/PN)

```javascript
// Mapping phone numbers to LIDs
const mapping = await sock.getLIDsForPNs(['628123456789@s.whatsapp.net']);
console.log('LID Mapping:', mapping);
```

## Credits

Yebails is developed and maintained by **yemobyte**. It is built upon the foundation of the WhiskeySockets/Baileys project and incorporates various improvements and beta features from the WhatsApp Web protocol.

## License

This project is licensed under the MIT License.
