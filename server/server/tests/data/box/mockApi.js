const nock = require('nock');

const FILE_ID = '5000948880';

const createShareLinkResponse = {
    type: 'file',
    id: '10559150999',
    file_version: {
        type: 'file_version',
        id: '7326581117',
        sha1: '8bd844fdbcd3e143d88eaff977bb211120501e07',
    },
    sequence_id: '1',
    etag: '1',
    sha1: '8bd844fdbcd3e143d88eaff977bb211120501e07',
    name: 'Metadata blog image.png',
    description: '',
    size: 86680,
    path_collection: {
        total_count: 2,
        entries: [
            {
                type: 'folder',
                id: '0',
                sequence_id: null,
                etag: null,
                name: 'All Files',
            },
            {
                type: 'folder',
                id: '848123342',
                sequence_id: '0',
                etag: '0',
                name: 'Test',
            },
        ],
    },
    created_at: '2013-09-22T22:59:19-07:00',
    modified_at: '2013-09-22T22:59:20-07:00',
    trashed_at: null,
    purged_at: null,
    content_created_at: '2013-09-22T22:59:19-07:00',
    content_modified_at: '2013-09-22T22:59:19-07:00',
    created_by: {
        type: 'user',
        id: '10523870',
        name: 'Ted Blosser',
        login: 'ted+demo@box.com',
    },
    modified_by: {
        type: 'user',
        id: '10523870',
        name: 'Ted Blosser',
        login: 'ted+demo@box.com',
    },
    owned_by: {
        type: 'user',
        id: '10523870',
        name: 'Ted Blosser',
        login: 'ted+demo@box.com',
    },
    shared_link: {
        url: 'https://blosserdemoaccount.box.com/s/7mcmdlavtye5o5i0ue8xmtwh2sx5bv8p',
        download_url: 'https://blosserdemoaccount.box.com/shared/static/7mcmdlavtye5o5i0ue8xmtwh2sx5bv8p.png',
        vanity_url: null,
        effective_access: 'open',
        is_password_enabled: true,
        unshared_at: null,
        download_count: 0,
        preview_count: 0,
        access: 'open',
        permissions: {
            can_download: true,
            can_preview: true,
        },
    },
    parent: {
        type: 'folder',
        id: '848123342',
        sequence_id: '0',
        etag: '0',
        name: 'Test',
    },
    item_status: 'active',
};

const folderItems = {
    total_count: 24,
    entries: [
        {
            type: 'folder',
            id: '192429928',
            sequence_id: '1',
            etag: '1',
            name: 'Stephen Curry Three Pointers',
        },
        {
            type: 'file',
            id: '818853862',
            sequence_id: '0',
            etag: '0',
            name: 'Warriors.jpg',
        },
    ],
    offset: 0,
    limit: 2,
    order: [
        {
            by: 'type',
            direction: 'ASC',
        },
        {
            by: 'name',
            direction: 'ASC',
        },
    ],
};
const uploadSuccessfull = {
    total_count: 1,
    entries: [
        {
            type: 'file',
            id: FILE_ID,
            sequence_id: '3',
            etag: '3',
            sha1: '134b65991ed521fcfe4724b7d814ab8ded5185dc',
            name: 'tigers.jpeg',
            description: 'a picture of tigers',
            size: 629644,
            path_collection: {
                total_count: 2,
                entries: [
                    {
                        type: 'folder',
                        id: '0',
                        sequence_id: null,
                        etag: null,
                        name: 'All Files',
                    },
                    {
                        type: 'folder',
                        id: '11446498',
                        sequence_id: '1',
                        etag: '1',
                        name: 'Pictures',
                    },
                ],
            },
            created_at: '2012-12-12T10:55:30-08:00',
            modified_at: '2012-12-12T11:04:26-08:00',
            trashed_at: null,
            purged_at: null,
            content_created_at: '2013-02-04T16:57:52-08:00',
            content_modified_at: '2013-02-04T16:57:52-08:00',
            created_by: {
                type: 'user',
                id: '17738362',
                name: 'sean rose',
                login: 'sean@box.com',
            },
            modified_by: {
                type: 'user',
                id: '17738362',
                name: 'sean rose',
                login: 'sean@box.com',
            },
            owned_by: {
                type: 'user',
                id: '17738362',
                name: 'sean rose',
                login: 'sean@box.com',
            },
            shared_link: null,
            parent: {
                type: 'folder',
                id: '11446498',
                sequence_id: '1',
                etag: '1',
                name: 'Pictures',
            },
            item_status: 'active',
        },
    ],
};

function mock() {
    nock('https://api.box.com')
        .put(`/2.0/files/${FILE_ID}`, {
            shared_link: {
                access: 'open',
                permissions: {
                    can_download: true,
                },
            },
        }).reply(200, createShareLinkResponse);
    nock('https://upload.box.com')
        .post('/api/2.0/files/content')
        .reply(201, uploadSuccessfull);
    nock('https://api.box.com')
      .get('/2.0/folders/0/items')
      .query(true)
      .reply(200, folderItems);
    nock('https://api.box.com')
        .post('/oauth2/token')
        .reply(200, {
          access_token: 'T9cE5asGnuyYCCqIZFoWjFHvNbvVqHjl',
          expires_in: 3600,
          restricted_to: [],
          token_type: 'bearer',
          refresh_token: 'J7rxTiWOHMoSC1isKZKBZWizoRXjkQzig5C6jFgCVJ9bUnsUfGMinKBDLZWP9BgR',
      });
}

module.exports = {
  mock,
};
