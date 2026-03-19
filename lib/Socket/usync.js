"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUSyncSocket = void 0;
const boom_1 = require("@hapi/boom");
const WABinary_1 = require("../WABinary");
const socket_1 = require("./socket");
const WAUSync_1 = require("../WAUSync");
const makeUSyncSocket = (config) => {
    const sock = (0, socket_1.makeSocket)(config);
    const { generateMessageTag, query, } = sock;
    const executeUSyncQuery = async (usyncQuery) => {
        if (usyncQuery.protocols.length === 0) {
            throw new boom_1.Boom('USyncQuery must have at least one protocol');
        }


        const validUsers = usyncQuery.users;
        const userNodes = validUsers.map((user) => {
            return {
                tag: 'user',
                attrs: {
                    jid: !user.phone ? user.id : undefined,
                },
                content: usyncQuery.protocols
                    .map((a) => a.getUserElement(user))
                    .filter(a => a !== null)
            };
        });
        const listNode = {
            tag: 'list',
            attrs: {},
            content: userNodes
        };
        const queryNode = {
            tag: 'query',
            attrs: {},
            content: usyncQuery.protocols.map((a) => a.getQueryElement())
        };
        const iq = {
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'usync',
            },
            content: [
                {
                    tag: 'usync',
                    attrs: {
                        context: usyncQuery.context,
                        mode: usyncQuery.mode,
                        sid: generateMessageTag(),
                        last: 'true',
                        index: '0',
                    },
                    content: [
                        queryNode,
                        listNode
                    ]
                }
            ],
        };
        const result = await query(iq);
        return usyncQuery.parseUSyncQueryResult(result);
    };
    return {
        ...sock,
        executeUSyncQuery,
        getLIDsForPNs: async (pns) => {
            const query = new WAUSync_1.USyncQuery().withContext('contact').withLIDProtocol();
            for (const pn of pns) {
                query.withUser(new WAUSync_1.USyncUser().withId(pn));
            }
            const result = await executeUSyncQuery(query);
            return result.list.map(u => ({ pn: u.id, lid: u.lid }));
        },
        getPNsForLIDs: async (lids) => {
            const query = new WAUSync_1.USyncQuery().withContext('contact').withContactProtocol();
            for (const lid of lids) {
                query.withUser(new WAUSync_1.USyncUser().withId(lid));
            }
            const result = await executeUSyncQuery(query);
            return result.list.map(u => ({ lid: u.id, pn: u.phone }));
        }
    };
};
exports.makeUSyncSocket = makeUSyncSocket;
