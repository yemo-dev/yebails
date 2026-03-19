"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCommunityMetadata = exports.makeCommunitiesSocket = void 0;
const Utils_1 = require("../Utils");
const WABinary_1 = require("../WABinary");
const newsletter_1 = require("./newsletter");
const makeCommunitiesSocket = (config) => {
    const sock = (0, newsletter_1.makeNewsletterSocket)(config);
    const { authState, ev, query, upsertMessage, generateMessageTag } = sock;
    const communityQuery = async (jid, type, content) => (query({
        tag: 'iq',
        attrs: {
            type,
            xmlns: 'w:g2',
            to: jid
        },
        content
    }));

    const communityMetadata = async (jid) => {
        const result = await communityQuery(jid, 'get', [{ tag: 'query', attrs: { request: 'interactive' } }]);
        return (0, exports.extractCommunityMetadata)(result);
    };

    const communityFetchAllParticipating = async () => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: '@g.us',
                xmlns: 'w:g2',
                type: 'get'
            },
            content: [
                {
                    tag: 'participating',
                    attrs: {},
                    content: [
                        { tag: 'participants', attrs: {} },
                        { tag: 'description', attrs: {} }
                    ]
                }
            ]
        });
        const data = {};
        const communitiesChild = (0, WABinary_1.getBinaryNodeChild)(result, 'communities');
        if (communitiesChild) {
            const communities = (0, WABinary_1.getBinaryNodeChildren)(communitiesChild, 'community');
            for (const communityNode of communities) {
                const meta = (0, exports.extractCommunityMetadata)({
                    tag: 'result',
                    attrs: {},
                    content: [communityNode]
                });
                data[meta.id] = meta;
            }
        }
        sock.ev.emit('groups.update', Object.values(data));
        return data;
    };

    return {
        ...sock,
        communityMetadata,
        communityCreate: async (subject, body) => {
            const descriptionId = (0, Utils_1.generateMessageID)().substring(0, 12);
            const result = await communityQuery('@g.us', 'set', [
                {
                    tag: 'create',
                    attrs: { subject },
                    content: [
                        {
                            tag: 'description',
                            attrs: { id: descriptionId },
                            content: [
                                {
                                    tag: 'body',
                                    attrs: {},
                                    content: Buffer.from(body || '', 'utf-8')
                                }
                            ]
                        },
                        {
                            tag: 'parent',
                            attrs: { default_membership_approval_mode: 'request_required' }
                        },
                        {
                            tag: 'allow_non_admin_sub_group_creation',
                            attrs: {}
                        },
                        {
                            tag: 'create_general_chat',
                            attrs: {}
                        }
                    ]
                }
            ]);
            return result;
        },
        communityLeave: async (id) => {
            await communityQuery('@g.us', 'set', [
                {
                    tag: 'leave',
                    attrs: {},
                    content: [{ tag: 'community', attrs: { id } }]
                }
            ]);
        },
        communityLinkGroup: async (groupJid, parentCommunityJid) => {
            await communityQuery(parentCommunityJid, 'set', [
                {
                    tag: 'links',
                    attrs: {},
                    content: [
                        {
                            tag: 'link',
                            attrs: { link_type: 'sub_group' },
                            content: [{ tag: 'group', attrs: { jid: groupJid } }]
                        }
                    ]
                }
            ]);
        },
        communityUnlinkGroup: async (groupJid, parentCommunityJid) => {
            await communityQuery(parentCommunityJid, 'set', [
                {
                    tag: 'unlink',
                    attrs: { unlink_type: 'sub_group' },
                    content: [{ tag: 'group', attrs: { jid: groupJid } }]
                }
            ]);
        },
        communityFetchAllParticipating
    };
};
exports.makeCommunitiesSocket = makeCommunitiesSocket;

const extractCommunityMetadata = (result) => {
    const community = (0, WABinary_1.getBinaryNodeChild)(result, 'community');
    const descChild = (0, WABinary_1.getBinaryNodeChild)(community, 'description');
    let desc;
    let descId;
    if (descChild) {
        desc = (0, WABinary_1.getBinaryNodeChildString)(descChild, 'body');
        descId = descChild.attrs.id;
    }
    const communityId = community.attrs.id.includes('@')
        ? community.attrs.id
        : (0, WABinary_1.jidEncode)(community.attrs.id || '', 'g.us');
    return {
        id: communityId,
        subject: community.attrs.subject || '',
        creation: Number(community.attrs.creation || 0),
        desc,
        descId,
        isCommunity: !!(0, WABinary_1.getBinaryNodeChild)(community, 'parent'),
        participants: (0, WABinary_1.getBinaryNodeChildren)(community, 'participant').map(({ attrs }) => ({
            id: attrs.jid,
            admin: attrs.type || null
        }))
    };
};
exports.extractCommunityMetadata = extractCommunityMetadata;
