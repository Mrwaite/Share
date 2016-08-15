.jshintrc ： JSHint是一种JS代码检查工具，这个文件是其个性化的配置文件
.gitinore : 是git配置需要忽略文件的配置文件
.travis.yml : travis是一个持续集成的平台，这是其配置文件

nodeclub 以 express + mongodb + mongoose 作为基本框架, 典型的 MVC 应用
Model: 对应mongoose orm， models目录
view： ejs模板， views目录
controler：express middleware , contollers目录

### 使用的模块

#### bcryptjs

bcrypt是一个跨平台的文件加密工具，How To Safely Store A Password

#### bytes

bytes(1024);
// output: '1kB' 
 
bytes(1000);
// output: '1000B' 
 
bytes(1000, {thousandsSeparator: ' '});
// output: '1 000B' 
 
bytes(1024 * 1.7, {decimalPlaces: 0});
// output: '2kB' 
 
bytes(1024, {unitSeparator: ' '});
// output: '1 kB' 

#### colors

让你的console.log呈现颜色

var colors = require('colors');
 
console.log('hello'.green); // outputs green text 
console.log('i like cake and pies'.underline.red) // outputs red underlined text 

#### compression

代码压缩中间件
支持：deflate，gzip

#### connect-redis

connect-redis is a Redis session store backed by node_redis
connect-radis 是一个Radis的会话缓存，被node_redis支持‘

#### cookie-parser

Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
Optionally you may enable signed cookie support by passing a secret string, 
which assigns req.secret so it may be used by other middleware.

解析Cookie头部并通过cookie名称键入一个对象填充req.cookies
你可以传递一个私密的字符串来登记cookie的支持，其中分配req.secret来被其他中间件使用。

#### cors

CORS是一个提供一个Connect/Express中间件的node.js包，他可以被用作启用CORS（Cross-Origin Resource Sharing 跨源资源共享）并附带好些参数

#### csurf

Node.js CSRF（Cross-Site Request Forgery 跨站请求伪造） 保护中间件

要求一个session中间件或者cookie-parser首先被初始化

+ 如果你正设置"cookie" 参数为非假值，之后你必须在这个模块之前使用'cookie-parser'
+ 除此之外，你逆序使用一个session中间件在这个模块之前，比如：
 + express-session
 + cookie-session
 
 https://github.com/pillarjs/understanding-csrf
 
#### data2xml

转换数据为xml

#### ejs-mate

Express 4.x layout,局部,块状的模板功能forEJS模板引擎
先前支持 include 但是已必须使用EJS1.0.x版本


#### eventproxy

事件订阅型的异步模式

##### express-session

Simple session middleware for Express,express session 设置

#### helmet
Helmet helps you secure your Express apps by setting various HTTP headers.
设置各种各样的http头部,一些安全方面的头部

#### ioredis

A robust, performance-focused and full-featured Redis client for Node and io.js.
为Node和io.js提供的redis客户端


#### jpush-sdk
极光推送sdk

#### loader-builder

感觉和webpack功能差不多,就是提供一系列的编译,压缩,合并

#### loader
Node静态资源加载器。

#### lodash

Lodash makes JavaScript easier by taking the hassle out of working with arrays,
numbers, objects, strings, etc. Lodash’s modular methods are great for:

好像是提供一系列的数组,对象,字符串,函数的方法的封装（很强大）

#### log4js

好像是对于原来console.log()功能的加强

#### markdown-it

扩展性的markdown语法.速度快,安全,自定义插件

#### memory-cache

一个简单的内存缓存

#### method-override

复写方法,让你在客户端不能用http某些方法的地方,使用如put,delete等方法

比如form只支持get,post方法,使用这个模块就可以使用其他的方法了

#### moment
一个轻量的JavaScript时间库
各种开发环境都可以用,包括前端

#### mongoose

mongodb orm 用于把mongodb数据库里面的数据抽象成对象,然后供node操作

#### multiline

处理多行字符串,原先是要使用+来连接换行的字符串,用这个可以在函数内随意编写多行字符串

#### node-uuid

生成通用唯一标识码(uuid),v1(time-based),v(random)

#### nodemailer

非常方便从你的Node.js发送email

#### nodemailer-smtp-transport

基于nodemailer,使用SMTP传输

#### passport

社交媒体的认证,github之类

#### pm2

生产应用进程管理器for Node.js 应用,内置负载均衡

#### qn

七牛api客户端

#### ready

混入题那几一次性ready一次性时间回调处理

#### request

简化的http请求客户端,用户量比superagent大,而且支持流操作pipe,更强大

#### response-time

这个模块创建一个中间件取记录请求在HTTP服务中的相应时间,这个相应时间是从一个请求进入这个中间件到头部被创建并出客户端的时间

#### superagent
服务端的http请求

#### utility

有用的工具集合
md5,sha1,sha256,hamc,decode & encode,getParamNames,randomString,has,noop,Date utils,Number utils,Timers and more

#### validator

字符串验证器,消毒器,有node端,还有浏览器端
主要是正则匹配是不是符合要求的字符串

#### xmlbuilder

一个xml构造器,类似于java-xmlbuilder

#### xss

根据白名单过滤HTML,防止xss攻击,通过白名单中来控制允许的标签和相关的标签属性,提供一系列接口以供拓展

