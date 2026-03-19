# Yebails

Yebails is a high-performance, feature-rich WhatsApp Web API library for Node.js. Optimized for protocol accuracy and speed, it is the most complete fork for modern WhatsApp features.

## Table of Contents
- [Installation](#installation)
- [Connection](#connection)
- [Messaging Basics](#messaging-basics)
- [Advanced Messaging](#advanced-messaging)
  - [Buttons & Interactive](#buttons--interactive)
  - [Mention All](#mention-all)
- [Privacy Settings](#privacy-settings)
- [Newsletters (Channels)](#newsletters)
- [Communities](#communities)
- [Utilities](#utilities)

---

## Installation

```bash
npm install yemo-dev/yebails
```

## Connection

### Multi-Device Auth
```javascript
const makeWASocket = require('yebails').default;
const { useMultiFileAuthState } = require('yebails');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        // Latest Beta Version
        version: [2, 3000, 1035465378] 
    });
    sock.ev.on('creds.update', saveCreds);
}
```

## Messaging Basics

### Simple Text & Media
```javascript
// Text
await sock.sendMessage(jid, { text: 'Hello!' });

// Image/Video/Audio
await sock.sendMessage(jid, { 
    image: { url: './img.jpg' }, 
    caption: 'Caption here' 
});

// Delete Message
await sock.sendMessage(jid, { delete: key });
```

---

## Advanced Messaging

### Buttons (Interactive)
Yebails supports native buttons and list messages.

```javascript
const buttons = [
  { buttonId: 'id1', buttonText: { displayText: 'Button 1' }, type: 1 },
  { buttonId: 'id2', buttonText: { displayText: 'Button 2' }, type: 1 }
];

const buttonMessage = {
    text: "Pilih menu di bawah:",
    footer: 'Yebails Multi-Device',
    buttons: buttons,
    headerType: 1
};

await sock.sendMessage(jid, buttonMessage);
```

### Native Flow (Interactive V2)
```javascript
const interactiveMessage = {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: { title: "Title" },
                body: { text: "Body Text" },
                footer: { text: "Footer Text" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "Pilih Item",
                                sections: [
                                    {
                                        title: "Section 1",
                                        rows: [
                                            { header: "H1", title: "T1", description: "D1", id: "ID1" }
                                        ]
                                    }
                                ]
                            })
                        }
                    ]
                }
            }
        }
    }
};

await sock.sendMessage(jid, interactiveMessage);
```

### Mention All (Beta)
Tag every group member instantly.
```javascript
await sock.sendMessage(jid, { 
    text: 'Halo Semuanya!',
    contextInfo: { mentionAll: true } 
});
```

---

## Privacy Settings

Control your account privacy programmatically.

```javascript
// Fetch all current settings
const settings = await sock.fetchPrivacySettings();

// Update specific settings
await sock.updateLastSeenPrivacy('contacts'); 
await sock.updateOnlinePrivacy('all');
await sock.updateProfilePicturePrivacy('everyone');
await sock.updateStatusPrivacy('contacts');
await sock.updateReadReceiptsPrivacy('none');
await sock.updateGroupsAddPrivacy('contacts_blacklist');
await sock.updateDefaultDisappearingMode(86400); // 24 hours
```

---

## Newsletters (Channels)

Yebails uses the **MEX Protocol** for stable Newsletter management.

| Function | Description |
| :--- | :--- |
| `newsletterCreate(name)` | Create a new channel. |
| `newsletterMetadata('jid', id)` | Fetch channel details via MEX. |
| `newsletterFollow(id)` | Follow a channel. |
| `newsletterUnfollow(id)` | Unfollow a channel. |
| `newsletterMute(id)` | Mute channel notifications. |
| `newsletterReactMessage(id, sid, code)` | React to a channel post. |

---

## Communities

Full support for Parent Groups and Subgroup linking.

```javascript
// Create a Community
const comm = await sock.communityCreate('Work Hub', 'Centralized group');

// Link group to community
await sock.communityLinkGroup(parentJid, subgroupJid);
```

---

## Utilities

### MCC Lookup (Mobile Country Code)
Detect the MCC of any number for identity verification.
```javascript
const { getMCC } = require('yebails/lib/Utils');
const mcc = getMCC('628xxx'); // Returns "510"
```

### Version Auto-Update
Yebails automatically tracks the latest WhatsApp Web revisions.
```javascript
const { fetchLatestWaWebVersion } = require('yebails/lib/Utils');
const { version } = await fetchLatestWaWebVersion();
```

---

## Credits
Maintained by **yemobyte**. Inspired by the excellent research in **WhiskeySockets** and **Itsukichann**.

## License
MIT
