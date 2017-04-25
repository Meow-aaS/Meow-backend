var path = require("path");
const datastore = require('@google-cloud/datastore')({
  projectId: 'senior-project-database',
  keyFilename: path.join(__dirname, '../../configs/senior-project-database-3c6084e20ea3.json')
});
const Promise = require("bluebird");
const crypto = require("crypto");

var getUID = function() {
    return crypto.randomBytes(16).toString("hex");
}

var getPost = function(postID) {
    console.log(postID)
    const postKey = datastore.key([
        'Post',
        postID
    ]);

    return new Promise((resolve, reject) => {
        datastore.get(postKey)
        .then((results) => {
            if(results.length){
                resolve(results[0]);
            } else {
                reject("Not found.");
            }
        })
        .catch(console.log)
    })

}

exports.create = function(params) {
    console.log("Create Post..");

    let postID = getUID();
    let postKey = datastore.key(['Post', postID]);
    let caption = params.caption;
    let image = params.image_blob;
    let liked_count = 0;
    let comments = [];
    let bboxes = params.bboxes;
    let owner_name = params.owner_name;
    let created_at = Date.now();
    let updated_at = Date.now();
    let entity = {
        key: postKey,
        data: [
            {
                name: "postID",
                value: postID
            },
            {
                name: "caption",
                value: caption,
                excludeFromIndexes: true
            },
            // {
            //     name: "image_blob",
            //     value: image,
            //     excludeFromIndexes: true
            // },
            {
                name: "liked_count",
                value: liked_count,
                excludeFromIndexes: true
            },
            {
                name: "comments",
                value: comments,
                excludeFromIndexes: true
            },
            {
                name: "bboxes",
                value: bboxes,
                excludeFromIndexes: true
            },
            {
                name: "owner_name",
                value: owner_name
            },
            {
                name: "created_at",
                value: created_at
            },
            {
                name: "updated_at",
                value: updated_at
            }
        ]
    };

    console.log("datastore.save");
    
    return new Promise((resolve, reject) => {
        datastore.save(entity)
        .then((data) => {
            console.log("saved", data);
            console.log(`Post ${postKey.id} created successfully.`);
            resolve(postID)
        })
        .catch((err) => {
            console.log("=== my err ===");
            console.log(err);
        })
    })
}

exports.list = function(page) {
    console.log("List post...");
    console.log("page...", page);

    var query = datastore.createQuery('Post').filter("updated_at", "<", Number(page))
    .limit(5)
    .order("updated_at", {
        descending: true
    });

    return new Promise((resolve, reject) => {
        datastore.runQuery(query)
        .then((results) => {
            var posts = results[0];
            resolve(posts);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    }) 
}

exports.like = function(postID) {
    var postKey = datastore.key([
        'Post',
        postID
    ]);

    return new Promise((resolve, reject) => {
        getPost(postID).then((post) => {
            if(!post) return reject("Post not found");
            post.liked_count++;
            var entity = {
                key: postKey,
                data: post
            }
            datastore.update(entity)
            .then(() => {
                console.log("Post updated successfully.");
                resolve();
            })
            .catch(() => {
                reject();
            });
        })
    });
}

exports.delete = function(postID) {
    var postKey = datastore.key([
        'Post',
        postID
    ]);

    return new Promise((resolve, reject) => {
        datastore.delete(postKey)
        .then(() => {
            resolve();
        })
        .catch(() => {
            reject();
        })
    });
}

exports.comment = function(postID, text) {
    var postKey = datastore.key([
        'Post',
        postID
    ]);

    return new Promise((resolve, reject) => {
        getPost(postID).then((post) => {
            if(!post) return reject("Post not found");
            post.comments.push(text);
            var entity = {
                key: postKey,
                data: post
            }
            datastore.update(entity)
            .then(() => {
                console.log("Post updated successfully.");
                resolve();
            })
            .catch(() => {
                reject();
            });
        })
    });
}