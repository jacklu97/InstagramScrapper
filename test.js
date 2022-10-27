const followers = require('./followers.json')
const following = require('./following.json')

const getUsernames = () => {    
    let followerSet = new Set(followers.users.map(user => [user.pk, user.username]))
    const followingSet = new Set(following.users.map(user => user.pk))
    
    followerSet = [...followerSet].filter(user => followingSet.has(user[0])).map(user => `@${user[1]}`)
    followerSet = sliceIntoChunks(followerSet, 2).map(element => element.reduce((acc, element) => `${acc} ${element}`))

    return followerSet
}

const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

module.exports = getUsernames;