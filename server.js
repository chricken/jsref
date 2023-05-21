'use strict';

// Modules
const fs = require('fs');
const formidable = require('formidable');

// Server
const express = require('express');
const server = express();


// Server
server.use(express.static('public', {
    extensions: ['html']
}));

server.use(express.json());

// Variablen
const paths = {
    pages: 'public/data/pages.json',
    pageFiles: 'public/data/pages/',
}

const init = () => {
    server.listen(80, err => console.log(err || 'Server läuft'));
}

// Routen
server.post('/savePages', (request, response) => {
    // console.log(request.body);
    if (request.body) {
        fs.writeFile(
            paths.pages,
            JSON.stringify(request.body),
            err => {
                if (err) response.json({ status: 'err' })
                else response.json({ status: 'ok' })
            }
        )
    }
})

server.post('/createPageFile', (request, response) => {
    fs.writeFile(
        `${paths.pageFiles}${request.body.id}.json`,
        JSON.stringify({
            content: []
        }),
        err => {
            if (err) response.json({ status: 'err', err })
            else response.json({ status: 'ok' })
        }
    )
})

server.post('/getSinglePage', (request, response) => {
    // console.log(request.body.id);
    fs.readFile(
        `${paths.pageFiles}${request.body.id}.json`,
        (err, content) => {
            if (err) {
                console.log(err);
                response.json({
                    status: err,
                    err
                })
            } else {
                response.json({
                    status: 'ok',
                    payload: JSON.parse(content.toString())
                });
            }
        }
    )
})

server.post('/savePageFile', (request, response) => {
    // console.log(request.body);
    fs.writeFile(
        `public/data/pages/${request.body.id}.json`,
        JSON.stringify(request.body.payload),
        err => {
            if (err) {
                response.json({
                    status: 'err',
                    err
                })
            } else {
                response.json({
                    status: 'ok'
                })
            }
        }
    )
})

server.post('/uploadImg', (request, response) => {
    const myForm = formidable({
        keepExtensions: true,
        uploadDir: 'public/assets/img/uploads'
    })

    myForm.parse(request, (err, fields, files) => {
        console.log(files.upload);
        response.json({
            status:'ok',
            filename: files.upload.newFilename
        })
    })
})

init();