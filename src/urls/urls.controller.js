const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function list(req, res){
    res.json({data : urls});
}

function read(req,res,next){
  res.json({data: res.locals.url});
}

function hasHref(req,res,next) {
    const { data : { href } = {}} = req.body;
    if(href){
        return next();
    }
    next({
        status : 400,
        message: "A 'href' property is required.",
    });
}

function urlExists(req,res,next) {
    const urlId = Number(req.params.urlId);
    const foundUrl = urls.find((url) => url.id === urlId);

    if(foundUrl){
        res.locals.url = foundUrl;
        return next();
    }
    next({
        status: 404,
        message: `Url id not found: ${urlId}`,
    })
}


function create(req, res) {
    const {data : { href } = {}} = req.body;
    const newUrl = {
        id: urls.length + 1,
        href
    };
    urls.push(newUrl);
    res.status(201).json({data : newUrl});
}

function recordUse(req,res,next) {
  uses.push({
    id: uses.length+1,
    urlId: res.locals.url.id,
    time: Date.now()
  })
  next()
}


function update(req, res){
    const urlId = Number(req.params.urlId);
    const foundUrl = urls.find((url) => url.id === urlId);
    const {data : {href} = {}} = req.body;
    foundUrl.href = href;
    res.json({data: foundUrl});
}

module.exports = {
    list,
    urlExists,
    read: [urlExists, recordUse, read],
    create: [hasHref, create],
    update: [urlExists, hasHref, update],
}