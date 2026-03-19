# Yebails - Next Generation WhatsApp Web API

A powerful, modular, and highly automated WhatsApp Web API library for Node.js. Optimized for performance and staying up-to-date with the latest WhatsApp features.

---

## Technical Credits
- **Maintained by**: yemobyte
- **Inspiration & Research**: Based on the groundbreaking work by the **WhiskeySockets** and **Itsukichann** teams.

---

## Key Features
- **Full Beta Support**: Newsletters (Channels), Communities, and MEX Protocol integration.
- **Advanced Messages**: Native Buttons, Interactive Lists, and Native Flow (V2) support.
- **Privacy Mastery**: Full control over Last Seen, Online Status, Profile Picture, and Read Receipts.
- **Automated Lifecycle**: Built-in Protobuf extraction and version auto-syncing.
- **Lightweight & Modular**: Chained socket architecture for easy customization.

---

## Installation

```bash
yarn add yebails
# or
npm install yebails
```

---

## Quick Start

### Basic Connection
```javascript
const makeWASocket = require('yebails').default;
const { useMultiFileAuthState } = require('yebails');

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2));
    });
}

startSock();
```

---

## API Reference

### 📧 Messaging
Primary functions for sending and managing messages.

- **`sendMessage(jid, content, options)`**: Send any type of message (text, media, interactive).
- **`relayMessage(jid, message, options)`**: Relay a raw protobuf message.
- **`readMessages(keys)`**: Mark a list of messages as read.
- **`sendReceipt(jid, participant, messageIds, type)`**: Send delivery/read receipts manually.
- **`sendPresenceUpdate(presence, jid)`**: Update your presence (composing, recording, available).
- **`presenceSubscribe(jid)`**: Subscribe to a user's presence updates.

### 👥 Group Management
Full suite of administrative and member-level group controls.

- **`groupCreate(subject, participants)`**: Create a new group.
- **`groupMetadata(jid)`**: Fetch detailed group information.
- **`groupParticipantsUpdate(jid, participants, action)`**: Add, remove, promote, or demote members.
- **`groupUpdateSubject(jid, subject)`**: Change group name.
- **`groupUpdateDescription(jid, description)`**: Change group description.
- **`groupSettingUpdate(jid, setting)`**: Update settings (announcement, locked).
- **`groupInviteCode(jid)`**: Get group invite link.
- **`groupRevokeInvite(jid)`**: Reset group invite link.
- **`groupAcceptInvite(code)`**: Join group via link.
- **`groupLeave(jid)`**: Leave a group.

### 📢 Newsletters (Channels)
State-of-the-art support for WhatsApp Channels using the MEX Protocol.

- **`newsletterCreate(name, description)`**: Create a new channel.
- **`newsletterMetadata(type, key)`**: Fetch channel info (by JID or Invite link).
- **`newsletterFollow(jid)`**: Follow a channel.
- **`newsletterUnfollow(jid)`**: Unfollow a channel.
- **`newsletterMute(jid)`**: Mute notifications.
- **`newsletterUnmute(jid)`**: Unmute notifications.
- **`newsletterAdminPromote(jid, userJid)`**: Promote a user to channel admin.
- **`newsletterAdminDemote(jid, userJid)`**: Demote a channel admin.
- **`newsletterDelete(jid)`**: Delete a channel.
- **`newsletterReactMessage(jid, serverId, reaction)`**: React to channel messages.

### 🌐 Communities
Manage WhatsApp Communities and their linked subgroups.

- **`communityCreate(subject, description)`**: Create a new community.
- **`communityMetadata(jid)`**: Fetch community details and participants.
- **`communityLinkGroup(groupJid, communityJid)`**: Add a group to a community.
- **`communityUnlinkGroup(groupJid, communityJid)`**: Remove a group from a community.
- **`communityLeave(jid)`**: Leave a community.

### 🔒 Privacy & Profile
Granular control over your account's visibility.

- **`updateProfileName(name)`**: Change your display name.
- **`updateProfileStatus(status)`**: Update your "About" text.
- **`updateProfilePicture(jid, content)`**: Update profile or group photo.
- **`fetchPrivacySettings()`**: Get current privacy configuration.
- **`updateLastSeenPrivacy(value)`**: Set who can see your "Last Seen".
- **`updateOnlinePrivacy(value)`**: Set who can see if you are "Online".
- **`updateProfilePicturePrivacy(value)`**: Set visibility for your profile picture.
- **`updateReadReceiptsPrivacy(value)`**: Toggle Blue Ticks.
- **`updateGroupsAddPrivacy(value)`**: Control who can add you to groups.

### 💼 Business Features
Essential tools for WhatsApp Business accounts.

- **`getBusinessProfile(jid)`**: Fetch business profile info.
- **`updateBusinessProfile(updates)`**: Update business details (address, email, website).
- **`productCreate(product)`**: Add a product to your catalog.
- **`productUpdate(productId, updates)`**: Modify an existing product.
- **`productDelete(productId)`**: Remove a product.

---

## Advanced Examples

### Sending Native Flow Messages (Interactive V2)
```javascript
const flowMessage = {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: { title: "Select Destination" },
                body: { text: "Click the button below to open the form." },
                footer: { text: "Yebails Automation" },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "Options",
                                sections: [
                                    {
                                        title: "Destinations",
                                        rows: [
                                            { header: "Jakarta", title: "Indonesia", id: "IDN" },
                                            { header: "Tokyo", title: "Japan", id: "JPN" }
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

await sock.sendMessage(jid, flowMessage);
```

### Mentioning Everyone in a Group
Using the latest `mentionAll` beta feature:
```javascript
await sock.sendMessage(jid, { 
    text: "Hello everyone!",
    contextInfo: { mentionAll: true } 
});
```

---

## 🤖 Automated Proto Update
Yebails includes a specialized GitHub Workflow that keeps the library always in sync with WhatsApp.

- **Frequency**: Every 24 hours.
- **Action**: Scraping `web.whatsapp.com`, extracting the latest Protobuf (`WAProto.proto`), and regenerating the internal static structures.
- **Effect**: You will always have the latest message types and beta features without any manual updates.

---

## License
MIT

---
*Powered by Yebails Ecosystem.*
