var path = require("path");
const datastore = require('@google-cloud/datastore')({
  projectId: 'senior-project-database',
  keyFilename: path.join(__dirname, '../../configs/senior-project-database-3c6084e20ea3.json')
});
const Promise = require("bluebird");

exports.create = function(params){
    console.log("Create Post..");
    console.log("with params", params);
    
    let postKey = datastore.key('Post');
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
                name: "caption",
                value: caption,
                excludeFromIndexes: true
            },
            {
                name: "image_blob",
                value: image,
                excludeFromIndexes: true
            },
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
            resolve(postKey);
            
        })
        .catch((err) => {
            console.log("my err");
            console.log(err);
        })
    })
}

exports.list = function(page){
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

            console.log(`List result: ${posts}`);
            posts.forEach((post) => console.log(post));
            resolve(posts);
        }).catch((err) => {
            console.log(err);
        });
    }) 
}