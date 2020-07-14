const Koa = require('koa');
const proxy = require('koa2-proxy-middleware');
const bodyparser = require('koa-bodyparser');

const app = new Koa();

const options = {
    targets: {
        '/hlj-platform/(.*)': {
            target: 'http://192.168.1.85:8090',
            changeOrigin: true,
        },
    },
    onError: function (err, req, res) {
        console.log(err, 'err')
        console.log(req, 'req')
        console.log(res, 'res')
    }
}

app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
})

app.use(proxy(options));


app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));



/* 代理配置 end */


// log request URL:
app.use(async (ctx, next) => {
    //
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});


app.listen(3006);
console.log('app started at port 3006...')