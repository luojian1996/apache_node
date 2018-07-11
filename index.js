// 引入http模块
let http = require('http');

// 引入文件模块
let fs = require('fs');

// 引入路径模块
let path = require('path');

// 设置根目录
let rootPath = path.join(__dirname,'www');
// console.log(rootPath);

// 引入字符串模块
let querrystring = require('querystring');

// 引入第三方模块mime
let mime = require('mime');

http.createServer((request,response)=> {

    let filePath = path.join(rootPath,querrystring.unescape(request.url));
    // console.log(filePath);

    //判断该路径是否存在
    let isExist =  fs.existsSync(filePath);

    // 路径存在
    if (isExist) {
        
        // 判断是文件还是文件夹
        fs.readdir(filePath,(err,files)=>{

            //文件
            if (err) {
                fs.readFile(filePath,(err,data)=>{
                    if (err) {
                        console.log(err);                        
                    }
                    else {
                        response.writeHead(200,{
                            'content-type':mime.getType(filePath),
                        })
                        response.end(data);
                    }
                })
            }
            // 文件夹
            else{
                // console.log(files);

                // 判断当前文件夹是否有index.html
                if (files.indexOf('index.html')!=-1) {
                    // 有index.html
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        if (err) {
                            console.log(err);
                        }
                        else{
                            response.end(data);
                        }
                    })
                }
                // 没有index.html
                else{
                    // 列出文件列表
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8',
                    })

                    let backData="";

                    for(var i=0;i<files.length;i++) {

                        backData+=`<h2><a href="${request.url=="/"?"":request.url}/${files[i]}">${files[i]}</a></h2>`;
                    }
                    // console.log(backData);
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8',
                    })
                    response.end(backData);
                }

            }
        })
    }
    // 路径不存在
    else {
        
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8',
        })
        response.end(`<h2>404 not found</h2>`);
    }
    // console.log(isExist);
    // response.end('11');

}).listen(80,'127.0.0.1',()=>{

    console.log('listen to 127.0.0.1 success');

})