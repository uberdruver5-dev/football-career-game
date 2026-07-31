@echo off
title Football Career Mode FC
echo.
echo  ===================================
echo   FOOTBALL CAREER MODE FC
echo   Starting Game Server...
echo  ===================================
echo.
echo  Game will open in your browser automatically.
echo  DO NOT close this window while playing!
echo.
timeout /t 2 /nobreak >nul
start http://localhost:8080
node -e "const http=require('http'),fs=require('fs'),path=require('path');const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};http.createServer((req,res)=>{let f='.'+((req.url==='/'||req.url==='')?'/index.html':req.url);fs.readFile(f,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');}else{res.writeHead(200,{'Content-Type':types[path.extname(f)]||'text/plain'});res.end(data);}});}).listen(8080,()=>console.log('Server running at http://localhost:8080'));"
