# Yebails - Advanced WhatsApp Web API

A powerful, modular WhatsApp Web API library optimized for performance and the latest beta features.

---

## Technical Credits
- **Maintained by**: yemobyte
- **Inspiration**: Based on research by **WhiskeySockets** and **Itsukichann**.

---

## Index
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Connecting with QR](#connecting-with-qr)
  - [Connecting with Pairing Code](#connecting-with-pairing-code)
- [Handling Events](#handling-events)
- [Sending Messages](#sending-messages)
  - [Text & Media](#text--media)
  - [Interactive Messages (Buttons/Lists)](#interactive-messages-buttons-lists)
  - [Native Flow Messages (V2)](#native-flow-messages-v2)
  - [Mention All Members](#mention-all-members)
- [Group Management](#group-management)
  - [Administration](#administration)
  - [Invite & Join](#invite--join)
- [Newsletters (Channels)](#newsletters-channels)
  - [Creation & Info](#creation--info)
  - [Admin Controls](#admin-controls)
  - [Subscriber Actions](#subscriber-actions)
- [Communities](#communities)
- [Privacy & Profile](#privacy--profile)
  - [Privacy Settings](#privacy-settings)
  - [Profile Updates](#profile-updates)
- [Business Features](#business-features)
- [Automated Updates](#automated-updates)
- [License](#license)

---

## Installation

```bash
yarn add yebails
# or
npm install yebails
```

---

## Quick Start

### Connecting with QR
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
connect();
```

### Connecting with Pairing Code
```javascript
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
});

if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode("628123456789");
    console.log(`Pairing code: ${code}`);
}
```

---

## Sending Messages

### Text & Media
```javascript
// Simple Text
await sock.sendMessage(jid, { text: 'Hello!' });

// Image with Caption
await sock.sendMessage(jid, { 
    image: { url: './path/to/img.png' }, 
    caption: 'Behold!' 
});

// Document
await sock.sendMessage(jid, { 
    document: { url: './doc.pdf' }, 
    mimetype: 'application/pdf', 
    fileName: 'manual.pdf' 
});
```

### Interactive Messages (Buttons/Lists)
```javascript
// Buttons Message (Native Flow)
await sock.sendMessage(jid, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: { title: "Protocol Test" },
                body: { text: "Select your option below:" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Ping",
                                id: "ping_event"
                            })
                        },
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Visit Site",
                                url: "https://github.com/yemo-dev/yebails"
                            })
                        }
                    ]
                }
            }
        }
    }
});
```

### Native Flow Messages (V2)
```javascript
// Single Select List
await sock.sendMessage(jid, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: { title: "Order Food" },
                body: { text: "Choose your meal:" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "Menu",
                                sections: [
                                    {
                                        title: "Main Course",
                                        rows: [
                                            { header: "Burger", title: "Cheese Burger", id: "bg_1" },
                                            { header: "Pizza", title: "Pepperoni", id: "pz_1" }
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
});
```

### Mention All Members
> [!TIP]
> This is a beta feature automated by Yebails.

```javascript
await sock.sendMessage(jid, { 
    text: "Urgent announcement!", 
    contextInfo: { mentionAll: true } 
});
```

---

## Group Management

### Administration
- **`groupCreate(subject, participants)`**: Creates a group with initial members.
- **`groupMetadata(jid)`**: Returns full metadata (owner, subject, participants, etc.).
- **`groupParticipantsUpdate(jid, participants, action)`**: `add` | `remove` | `promote` | `demote`.
- **`groupUpdateSubject(jid, subject)`**: Updates group title.
- **`groupUpdateDescription(jid, description)`**: Updates group description.
- **`groupSettingUpdate(jid, setting)`**: `announcement` | `locked`.
- **`groupLeave(jid)`**: Exit the group.

### Invite & Join
- **`groupInviteCode(jid)`**: Returns the unique invite string.
- **`groupRevokeInvite(jid)`**: Resets the current invite link.
- **`groupAcceptInvite(code)`**: Joins a group via the 22-character invite code.
- **`groupGetInviteInfo(code)`**: Peeks at group info without joining.

---

## Newsletters (Channels)

### Creation & Info
- **`newsletterCreate(name, description)`**: Create a public channel.
- **`newsletterMetadata(type, key)`**: Fetch info via JID or Link.
- **`newsletterSubscribers(jid)`**: Count active followers.

### Admin Controls
- **`newsletterAdminPromote(jid, userJid)`**: Grant admin privileges.
- **`newsletterAdminDemote(jid, userJid)`**: Revoke admin privileges.
- **`newsletterDelete(jid)`**: Permanently delete the channel.
- **`newsletterUpdateName(jid, name)`**: Modify channel name.
- **`newsletterUpdatePicture(jid, imagePath)`**: Update channel icon.

### Subscriber Actions
- **`newsletterFollow(jid)`**: Follow as a viewer.
- **`newsletterUnfollow(jid)`**: Stop following.
- **`newsletterMute(jid)`**: Disable notifications.
- **`newsletterReactMessage(jid, serverId, reaction)`**: React with emojis.

---

## Communities
- **`communityCreate(subject, description)`**: Create a community parent group.
- **`communityMetadata(jid)`**: Get community details.
- **`communityLinkGroup(groupJid, communityJid)`**: Add a subgroup to the community.
- **`communityUnlinkGroup(groupJid, communityJid)`**: Remove a subgroup.
- **`communityLeave(jid)`**: Leave the community.

---

## Privacy & Profile

### Privacy Settings
- **`updateLastSeenPrivacy('all' | 'contacts' | 'none')`**
- **`updateOnlinePrivacy('all' | 'match_last_seen')`**
- **`updateProfilePicturePrivacy('all' | 'contacts' | 'none')`**
- **`updateStatusPrivacy('all' | 'contacts' | 'none')`**
- **`updateReadReceiptsPrivacy('all' | 'none')`**
- **`updateGroupsAddPrivacy('all' | 'contacts' | 'contact_blacklist')`**

### Profile Updates
- **`updateProfileName(name)`**: Update display name.
- **`updateProfileStatus(status)`**: Update "About" text.
- **`onWhatsApp(jid)`**: Check if a number is registered on WhatsApp.
- **`profilePictureUrl(jid, type)`**: Fetch image URL (`image` or `preview`).

---

## Business Features
- **`getBusinessProfile(jid)`**: Get category, email, website, and description.
- **`updateBusinessProfile(updates)`**: Update multiple business fields at once.
- **`productCreate(product)`**: Add item to catalog.
- **`productUpdate(id, updates)`**: Edit existing catalog item.
- **`productDelete(id)`**: Remove catalog item.

---

## Automated Updates
Yebails is equipped with a **Proto-Extractor System** that automatically:
1.  Monitors WhatsApp Web `sw.js` for version revisions.
2.  Extracts the latest `.proto` schema from the source code.
3.  Regenerates static Protobuf types every 24 hours.

This ensures your bot is always compatible with the newest message types without manual intervention.

---

## License
MIT

---
*Maintained by yemobyte. Inspired by WhiskeySockets & Itsukichann research.*
