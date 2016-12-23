# 前端性能清单 2017

@(By Vitaly Friedman 译 陈威特)[前端, 性能]

[原文](https://www.smashingmagazine.com/2016/12/front-end-performance-checklist-2017-pdf-pages/)

你已经在使用渐进式启动了吗？那么React 和 Angular中的`tree-shaking`和`code-splitting`呢？你是否设置了 [Brotli](https://zh.wikipedia.org/wiki/Brotli) 或  [Zopfli](https://zh.wikipedia.org/wiki/Zopfli) 压缩,   [OCSP](https://zh.wikipedia.org/wiki/OCSP%E8%A3%85%E8%AE%A2) stapling,  [HPACK](https://http2.github.io/http2-spec/compression.html) 压缩呢？ 那么 [Resource Hints](https://www.keycdn.com/blog/resource-hints/),  [Client Hints](http://httpwg.org/http-extensions/client-hints.html) 和 [CSS Containment ](https://developers.google.com/web/updates/2016/06/css-containment) 呢？就更不用说 IPV6, HTTP/2,  [Server Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API) 了。

早些时候，性能问题往往都是项目完成之后考虑的。经常被推迟到项目末期，它将会被归结为压缩， 合并， 资源优化以及对服务器的一些配置文件做细微的调整。
现在回头想想， 事情似乎已经发生了很大的变化。

性能并不只是技术上的考量，重要的是，当其融入到工作流当中时，设计理念往往通过性能的优劣来更好的展现。性能必须持续的测试，监控，优化。日益复杂的 Web 环境给我们带来了新的挑战，我们非常困难去检测具体的性能指标，因为性能指标的检测是非常依赖于终端设备， 浏览器，协议，网络类型以及潜在的一些东西（CDNs， ISPs， 缓存， 代理，防火墙，负载均衡和服务器，它们都在性能问题上扮演非常重要的角色）。

所以，如果我们实际环境中已经涉及到了上述的东西，那么从开始到网站最终的发布提升性能时这些的东西都应该考虑进去。这篇性能清单看上去如何？下面你将会得到一份（希望是公正的客观的）前端2017性能清单——上述问题你可能需要去考虑，以便确保网页响应时间够快，够流畅。


----------------
[TOC]

微优化对于让性能保持正常状态是很有效的，但是关键是有清晰的目标——可行的目标将影响整个过程中做的任何决定。下面有一些不同的模型，每一个谈论的都是比较之后评价——确保早点设置自己的优先级。

文章提到一些性能指标名词：
1. start rendering time ：用户在页面上看到的第一个内容的时间
2. first meaningful paint：页面展示其主要内容所需的时间
3. time to interactive： 一个页面——主要是单页面应用，加载充分，用户可以与其互动的时间线 


###  准备和设置目标

#### 1. 比你的最快的竞争对手快 20% 。
根据[心理研究](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/#the-need-for-performance-optimization-the-20-rule)，如果你想要用户感觉你的网站比其他的网站快，你至少需要快 **20%**。
 整页加载时间与像是` start rendering time`( 用户在页面上看到的第一个内容的时间 )等指标不相关，而与[ first meaningful paint](https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint)（即页面展示其主要内容所需的时间）和 [time to interactive](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive) (即 一个页面——主要是单页面应用，加载充分，用户可以与其互动的时间线) 有关。

在 一部 Moto G ，一部中档三星设备和一部像是 Nexus 4 这样的比较好的中档设备，优先在开放设备实验室（常规的 3G， 4G 和 WIFI）中，测试` start rendering time`（使用 [WebPagetest](http://www.webpagetest.org/)） 和  `first meaningful paint times` （使用 [Lighthouse](https://github.com/GoogleChrome/lighthouse)）。
![enter image description here](https://www.smashingmagazine.com/wp-content/uploads/2016/12/lighthouse_ykpzcd_c_scalew_546-opt.png)

*Lighthouse, a new performance auditing tool by Google.*

查看你的分析数据，了解你的用户的所处的位置，之后你可以测试模拟 90% 的情况。 收集数据，建立一个[spreadsheet](http://danielmall.com/articles/how-to-make-a-performance-budget/), 剔除 20% ，通过这样的方法设定你的目标（即 性能预算）。 现在你有些可以测试的东西。如果你保持预算，尝试压缩脚本，去得到一个比较快的`time-to-interactive` 值，那你就在一个合理的优化路径上。

![Performance budget builder by Brad Frost.](https://www.smashingmagazine.com/wp-content/uploads/2016/12/performance-budget_lbp9l7_c_scalew_1241-opt.png)

*[Performance budget](http://bradfrost.com/blog/post/performance-budget-builder/) builder by Brad Frost.*

与你的同事分享这份清单。确保你的团队的每一位成员都熟悉它，以免带来不必要的误解。如果项目的每一个决策都有性能的考量，那概念，UX和视觉设计方案决定时，项目将会从积极参与的前端开发者上收获巨大。所以，对每一个设计决策，都要考虑性能预算和其在清单中定义的优先级。

#### 2. 100毫秒的响应时间，每秒60帧。
[RAIL performance model](https://www.smashingmagazine.com/2015/10/rail-user-centric-model-performance/)给我们一些合理的目标：在初始输入之后，反馈时间应尽量少于100毫秒。为了实现小于100毫秒的响应时间，页面必须在50毫秒的时间内让主线程得到控制权。对于像动画一样需要频繁点击的，对于做不到小于100毫秒相应时间的地方，要做绝对的压缩！

而且，动画的每一帧应该在小于16毫秒的时间内完成，从而实现每秒60帧（1 秒 / 60 = 16.6 毫秒），最好小于10毫秒。因为在到达下一个16.6毫秒时间点之前你的代码应该被执行，这样浏览器才有时间去渲染新的帧。客户端应[Be optimistic](http://info.meteor.com/blog/optimistic-ui-with-meteor-latency-compensation)( 个人理解：客户端直接响应用户的交互,在客户端离线对用户行为进行推测 ) 以及聪明的利用空闲的时间。显而易见，这些目标适用于运行性能优化，对于加载性能优化不那么适用。

#### 3.  `First meaningful paint`时间小于1.25秒， SpeedIndex 小于 1000
虽然上面的要求可能很难实现，你的最终目标应该是在良好的网络连接状况下，` start rendering time`小于1秒以及[SpeedIndex](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)(显示页面的可见部分的平均时间)值应该小于1000。
对于移动端，在3G网络下，一个小于3秒的` start rendering time`才是可以被接受的。稍高于上面指标也是可以的，但是应当尽可能的低。

### 明确环境

#### 4.  选择和设置构建工具
不要太过于关注这段时间感觉很酷的构建工具。构建工具依照于你当前的环境，选择 Grunt, Gulp, Webpack, PostCSS或者是一个组合工具。当你在上面选择中得出结果足够快，在维护构建过程中也没有出现问题的时候，那么这方面就做的不错了。

#### 5.  渐进增强
保持渐进增强作为你前端体系结构的指导原则，那部署就是一个安全的赌注。首先设计和制定核心体验是什么，然后通过一些高级特性为功能强大的浏览器增强用户体验，创造弹性体验感。如果你的网站在比较差的屏幕，浏览器，网络和设备上运行的十分流畅，那在比较好的环境中只会运行更加流畅！

#### 6.  Angular， React， Ember 和 co
喜欢能支持服务器端渲染的框架。在选择框架之前，确保测试服务器端渲染和客户端渲染在移动端的启动时间（因为改变框架之后， 测试性能问题将是比较困难的一件事）。如果你将要使用一个JavaScript框架，确保你的选择是经过[比较](https://www.youtube.com/watch?v=6I_GwgoGm1w)的和[深思熟虑](https://medium.com/@ZombieCodeKill/choosing-a-javascript-framework-535745d0ab90#.h0r9v08lr)。不同的框架在性能上将会有不同的效果，当然会要求不同的优化策略，所以你必须清楚你将会依赖的框架的所有的细节组成。当构建一个web app， 可以看看 [ PRPL pattern ](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) 和   [application shell architecture](https://developers.google.com/web/updates/2015/11/app-shell).

![PRPL](https://www.smashingmagazine.com/wp-content/uploads/2016/12/app-build-components_dibweb_c_scalew_1408-opt.png)

*PRPL 表示推送关键资源， 渲染初始路由， 预缓存剩余路由 和  按需懒加载剩余路由.*

![ application shell ](https://www.smashingmagazine.com/wp-content/uploads/2016/12/appshell-1_o0t8qd_c_scalew_1249-opt.jpg)

*一个应用程序shell，是用最小的HTML， CSS， JavaScript提供一个用户界面*

#### 7. AMP or Instant Articles

取决于你团体的优先级和战略，你或许想要使用 Google 的 [AMP](https://www.ampproject.org/)  或者  Facebook 的  [Instant Articles](https://instantarticles.fb.com/)。没有它们，你也可以实现良好的性能展现。但是 `AMP` 通过免费的 `CDN` ，确实提供稳定的性能方案，而 `Instant Articles` 将会提高在Facebook上的性能表现。当然你也可以构建  [progressive web AMPs](https://www.smashingmagazine.com/2016/12/progressive-web-amps/) 。

#### 8.  选择CDN

根据你拥有多少动态数据，你可以将内容的一部分放到一个[ static site generator](https://www.smashingmagazine.com/2015/11/static-website-generators-jekyll-middleman-roots-hugo-review/)上, 推送到CDN上，生成一个静态的资源版本，来减少数据库的请求。你甚至可以选择一个基于CDN的 [static-hosting platform](https://www.smashingmagazine.com/2015/11/modern-static-website-generators-next-big-thing/) ， 使用交互式组件增强你的页面（[JAMStack](https://jamstack.org/)）.

### 构建优化
#### 9.  设置资源优先级
这是一个好的方法让你知道你首先需要解决的是什么。盘点你全部的资源（JavaScript, images, fonts, 第三方脚本和页面中“昂贵”的模块，像是轮播，复杂的信息图表，多媒体内容），并给它们分组。

建立一个电子表格。对旧版的浏览器定义最基本的核心体验（即 完全可以访问的核心内容），增强哪些功能更强大的浏览器的体验（即 更加丰富的体验）还有 额外的（资源并不需要第一时间全部加载，可以懒加载，像是web fonts，不必要的样式，轮播脚本，媒体播放器， 社交媒体按钮相关的， 大图片）。我们发布过一篇文章 " [Improving Smashing Magazine’s Performance](https://www.smashingmagazine.com/2014/09/improving-smashing-magazine-performance-case-study/) ", 里面讨论了这个优化方法的一些细节。

#### 10. 使用 “`cutting-the-mustard`” 技术

使用 [cutting-the-mustard technique](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard) 向旧版浏览器传递核心体验，向现代浏览器传递增强之后的体验方案。严格加载你的资源： 立即加载核心体验的代码，把增强部分加入到 `DomContentLoaded` 事件中，把 附加部分加入到 `load` 事件中。

值得注意的是该技术可以从浏览器版本推断设备能力的强弱，但是现在我们不能再这么干了。举个例子，廉价的安卓手机在发展中国家主要运行Chrome，虽然这些设备只拥有有限的内存和 CPU 能力，但也会使用 `cut the mustard` 技术。注意，当我们有没有别的选择时，使用该技术的局限性会越来越大。

#### 11. 考虑微优化和渐进式启动

有些app在开始渲染页面之前需要先初始化app，可以渲染[ skeleton screens](https://twitter.com/lukew/status/665288063195594752)去代替加载指示器。因为大多数的性能问题源于启动app的初始解析时间，所以需要找到一些模块和技术去加速初始渲染的时间（ex：[tree-shaking](https://medium.com/@richavyas/aha-moments-from-ngconf-2016-part-1-angular-2-0-compile-cycle-6f462f68632e#.8b9afnsub) and [code-splitting](https://webpack.github.io/docs/code-splitting.html)）。也可以，使用[ahead-of-time compiler ](https://www.lucidchart.com/techblog/2016/09/26/improving-angular-2-load-times/)将客户端渲染的负担分担到服务端，快速产生解析结果。最后，使用 [ Optimize.js](https://github.com/nolanlawson/optimize-js)包装急需调用的函数来加快初始加载（虽然，现在这点 [不再是必须](https://twitter.com/tverwaes/status/809788255243739136) 的了）。

![Progressive booting](https://www.smashingmagazine.com/wp-content/uploads/2016/12/fmp-and-tti-opt.jpeg)

*[Progressive booting](https://aerotwist.com/blog/when-everything-is-important-nothing-is/)指的是使用服务器端渲染去得到一个快速的 `first meaningful paint` ,也包括使用一些最小的JavaScript脚本去让 ` time-to-interactive` 时间接近 ` first meaningful paint` 时间。*

客户端渲染 or 服务器端渲染？不管什么场景，我么的目标都是建立[Progressive booting](https://aerotwist.com/blog/when-everything-is-important-nothing-is/)方案：使用服务器端渲染去得到一个理想的 ` first meaningful paint` 时间，也包括使用一些最小的JavaScript脚本去让 ` time-to-interactive` 时间接近 ` first meaningful paint` 时间。我们也可以在需求或者时间允许的情况下，启动一些app非必要的部分。不幸的是，正如[Paul Lewis 注意到的](https://aerotwist.com/blog/when-everything-is-important-nothing-is/#which-to-use-progressive-booting)，框架通常没有优化的概念，这些都抛给了开发者。因此渐进式启动对于大部分的库和框架来说是很难实行的。如果你有时间和资源，使用这个方案去促进性能优化。


#### 12. 正确设置HTTP cache头部
再次检查一遍 `expires`, `cache-control`, `max-age` 和其他 HTTP cache 头部事都设置正确吗。通常，资源应该是可缓存的不管是短时间的（如果它们很可能改变），还是无限期的（如果它们是静态的）——你可以在需要更新的时候， 改变 URL 中它们的版本即可。

如果可能， 使用 `Cache-control: immutable`， 该头部为被打上指纹的静态资源设计，避免资源被重新验证（截至 2016年12月，只有 [FireFox 在 HTTPS 中支持](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) ）。你也可以使用 [Heroku 的 HTTP 缓存头部](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers)，Jake Archibald 的 [ "Caching Best Practices" ](https://jakearchibald.com/2016/caching-best-practices/)，以及  Ilya Grigorik 的 [HTTP caching primer](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=en) 作为指导。

#### 13. 限制第三方库和异步加载的JavaScript

当用户请求一个界面， 浏览器提取 HTML 文档创建 DOM 树，然后提取 CSS 样式表创建 CSSOM 树， 最后通过匹配 DOM 树上的节点和 CSSOM 树上对应的节点合并生成一棵渲染树。如果途中有任何的 JavaScript 需要执行， 浏览器会停止渲染直到该 JavaScript 执行完毕， 因此延缓页面的渲染（阻塞 DOM 构建）。作为开发者，我们必须明确的告诉浏览器不要再等待了，应当抓紧渲染页面。解决方案就是设置为 scripts 设置 `defer` 和 `async` 属性。

#### 14. 正确的图片优化
尽可能的使用 `srcset`， `sizes` 和 `<picture>` 标签来实现 [ responsive images](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/)。你也可以在 `<picture>` 标签和 一张JPEG图片作为后备（ Andreas Bovens的 [ code snippet](https://dev.opera.com/articles/responsive-images/#different-image-types-use-case)）来加载[ WebP 格式](https://www.smashingmagazine.com/2015/10/webp-images-and-performance/)图片。
或者使用 `Accrpt` 头部来和服务器交流。`Sketch ` 支持 WebP格式， WebP图片在Photoshop中可以使用 [ WebP plugin for Photoshop](http://telegraphics.com.au/sw/product/WebPFormat#webpformat)  来导出。[Other options are available](https://developers.google.com/speed/webp/docs/using)

![](https://www.smashingmagazine.com/wp-content/uploads/2016/12/responsive-image-breakpoints-generator-750w-opt.jpeg)

*[Responsive Image Breakpoints Generator ](http://www.responsivebreakpoints.com/) 可以自动化图像和标记的生成*

你也可以使用  [client hints](https://www.smashingmagazine.com/2016/01/leaner-responsive-images-client-hints/) , 目前还在获得 [浏览器的支持](http://caniuse.com/#search=client-hints) 。没有足够的资源来支持响应式图片的复杂标记？使用 [ Responsive Image Breakpoints Generator ](http://www.responsivebreakpoints.com/) 或者像是[Cloudinary](http://cloudinary.com/documentation/api_and_access_identifiers)这样的服务来自动化图片的优化。此外，在许多情况下，单独使用 `srcset` 或 `sizes` 将会收获显著。 在Smashing杂志中，我们使用 后缀`-opt` 作为图像名称 - 例如， `brotli-compression-opt.png`, 这样只要图像包含这样的后缀，团队中的每个人都知道该图像被优化过了。


#### 15. 让图像优化提高到下一个水平
当在你着手的一个登录页面中，非常紧急的需要一个特定的图像加载的足够的快，这时候你需要确保 JPEGs 通过 [ mozJPEG](https://github.com/mozilla/mozjpeg) （mozJPEG可以提高图片的初始渲染时间，通过操纵扫描级别）来优化 和 压缩，PNG 使用 [Pingo](http://css-ig.net/pingo) , GIF 使用 [ Lossy GIF](https://kornel.ski/lossygif), SVG 使用 [SVGOMG](https://jakearchibald.github.io/svgomg/)。模糊图片不必要的部分（通过应用高斯模糊过滤它们）来减少文件的体积，最终你甚至可以通过着手删除颜色或用黑白呈现图片进一步减少体积。对于背景图片，从Photoshop导出时候减少 0 ~ 10% 的质量也是完全可以接受的。

还不够？那好，也可以通过[multiple](http://csswizardry.com/2016/10/improving-perceived-performance-with-multiple-background-images/) [background](https://jmperezperez.com/medium-image-progressive-loading-placeholder/) [images](https://manu.ninja/dominant-colors-for-lazy-loading-images#tiny-thumbnails) [technique](https://css-tricks.com/the-blur-up-technique-for-loading-background-images/)（这里面每个单词都是一个链接）来提高图像的感觉性能。


#### 16. web fonts 优化

你是用的web fonts很可能包含未使用的字形和额外的功能。如果你用的是 open-source fonts ，你可以向你的类型产生工厂要求一个web fonts子集或者自己[产生一个](https://www.fontsquirrel.com/tools/webfont-generator)来减少文件的体积。能支持WOFF2最好，对不支持的浏览器你也可以使用 WOFF 和OTF 作为降级处理的方案。另外，从Zach Leatherman’s [Comprehensive Guide to Font-Loading Strategies](https://www.zachleat.com/web/comprehensive-webfonts/) 方案 和 [service worker](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjB26L3i4jRAhVnxFQKHQ1RAB4QFggcMAA&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FService_Worker_API&usg=AFQjCNGcFYqcUoZIpTlw41JzGxE8aGJntw&sig2=HCdwMGD6vwAe8s0o2SAzFw)来永久缓存字体，来选择一种方案。需要快速的效果？Pixel Ambacht 有一个[快速的教程和案例分析](https://pixelambacht.nl/2016/font-awesome-fixed/)去获取指定的字体。

![](https://www.smashingmagazine.com/wp-content/uploads/2016/12/zach-web-fonts_c8nq74_c_scalew_1528-opt.png)

*Zach Leatherman’s Comprehensive Guide to Font-Loading Strategies 为web fonts交付提供了十几个的选项*

如果你不能从自己的服务上使用字体，而是依赖第三方，那就确保使用[ Web Font Loader](https://github.com/typekit/webfontloader)。 [FOUT 比 FOIT 好](https://www.filamentgroup.com/lab/font-events.html); 降级处理中，首先渲染文本，后异步加载字体——你也可以使用 [loadCSS](https://github.com/filamentgroup/loadCSS)。
你也应该[远离本地安装的系统字体](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)。


#### 17. 快速推送 critical CSS 样式

为了确保浏览器尽可能快的渲染你的页面，收集渲染页面第一个可见部分需的CSS（“critical CSS” or  “above-the-fold CSS”）以及把他添加到 `<head>` 标签的中来减少请求往返 ，已经变成通常做法。因为在 TCP 慢启动阶段交换的数据包大小有限制，所以你对于 critical CSS 大小的预算是 大约 14 KB。如果超过了这个预算，浏览器需要额外的 HTTP 往返去获取 critical CSS 样式。[CriticalCSS](https://github.com/filamentgroup/criticalCSS) 和 [Critical](https://github.com/addyosmani/critical) 可以确保你在预算之内。在每一个你使用的模版当中你都应该去做这件事。如果可能， 考虑使用 [conditional inlining approach](https://www.filamentgroup.com/lab/performance-rwd.html) ，其已被 the Filament Group 使用。

在 HTTP/2中，为了避免一个产生臃肿的HTML文件, critical CSS应该被存储在一个分离的CSS 文件中并通过服务器推送。但是服务器端推送支持并不一致，而且还有一些还存放方面的问题（查看  [Hooman Beheshti’s presentation](http://www.slideshare.net/Fastly/http2-what-no-one-is-telling-you)）。事实上，这影响是负面的，会膨胀网络的缓冲区，导致文档当中真正的帧无法被递送。因为 TCP 的慢启动，服务器端推送 [在热连接上更加高效](https://docs.google.com/document/d/1K0NykTXBbbbTlv60t5MyJvXjqKGsCVNYHyLEXIxYMv0/edit)。 记住，`cache-digest` 这个高速缓存的新规范将会否定手动创建 `"cache-aware"` 服务的需求。

#### 18.  使用 tree-shaking 和 code-splitting 减少有效负载
[tree-shaking](https://medium.com/@roman01la/dead-code-elimination-and-tree-shaking-in-javascript-build-systems-fb8512c86edf) 是一种，通过只加载生产中确实被使用的代码，来整理你构建过程的方法。你可以使用 [Webpack2中清除未使用的部分](http://www.2ality.com/2015/12/webpack-tree-shaking.html), 也可以使用[UnCSS](https://github.com/giakki/uncss) 或者 [Helium](https://github.com/geuis/helium-css) 去删除未使用CSS样式。另外， 你可能会考虑怎么去 书写 [高效的 CSS 选择器](http://csswizardry.com/2011/09/writing-efficient-css-selectors/) 或是怎么[避免 冗长 低效的样式](https://benfrain.com/css-performance-revisited-selectors-bloat-expensive-styles/)。

[Code-splitting ](https://webpack.github.io/docs/code-splitting.html) 是另一种Webpack特性，可以基于“chunks”分割你的代码然后按需加载这些代码块。一旦你在你的代码中确定了分割点，Webpack会全全负责这些依赖关系和输出文件。在应用发送请求的时候，这样基本上确保初始的下载足够小并且实现按需加载。

值得注意的是相比于 Browserify 输出结果  [ Rollup](http://rollupjs.org/)展现的更加优秀。当使用 Rollup时，我们会想要查看 [ Rollupify](https://github.com/nolanlawson/rollupify)，它可以转化 ECMAScript 2015 modules 为一个大的 CommonJS module——因为取决于打包工具和模块加载系统的选择，小的模块会有[令人惊讶的高性能开销](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)。

#### 19. 提高渲染性能
使用[ CSS containment](http://caniuse.com/#search=contain) 隔离高代价的组件,比如限制一些画布外导航的布局 绘制的样式 或者第三方窗口小部件的样式的范围。确保在页面滚动或元素执行动画效果的时候，页面是没有滞后的，这样你就可以让页面每秒60帧一直保持一致。如果上面实现还是很困难，但至少让每秒的帧数保持在60 ~ 15的混合范围内。
使用 CSS 的 [will-change](http://caniuse.com/#feat=will-change) 去通知浏览器哪个元素或属性将要改变。

另外， 测试 [运行渲染性能](https://aerotwist.com/blog/my-performance-audit-workflow/#runtime-performance) （例如， [in DevTools](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/)）。在开始之前，请浏览 Paul Lewis 免费的 [ Udacity 课程对于浏览器渲染优化](https://www.udacity.com/course/browser-rendering-optimization--ud860) 的建议。我们还有一篇由  Sergey Chikuyonok 撰写的关于 如何[正确获取 GPU 动画](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)的文章。

#### 20.  通过预热连接加速传输
使用 `skeleton  screens`， 懒加载所有的高代价的组件，像是字体， JavaScript， 轮播， 媒体和 iframes。使用 [ resource hints](https://w3c.github.io/resource-hints) 中一些方法节约加载时间：  [dns-prefetch ](http://caniuse.com/#search=dns-prefetch)（在后台执行 DNS 查找） ,[preconnect](http://www.caniuse.com/#search=preconnect) (告知浏览器在后台开始一些握手协议（DNS， TCP， TLS）的连接)， [prefetch](http://caniuse.com/#search=prefetch) （要求浏览器去预取指定资源，是资源加载更快速）， [ prerender](http://caniuse.com/#search=prerender) （告知浏览器在后台渲染特定的页面）和 [preload](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/) （预取一些尚未开始执行的资源，包括一些其他东西）。值得注意的是实践当中，因为取决于浏览器的支持情况， 推荐 `dns-prefetch` 而不是 `preconnect`，而且应当谨慎的使用 `prefetch` 和 `prerender` ——后者只能在你对用户下一步将会浏览什么很自信时候才去使用（例如，在一个购买流程当中的时候）。

### HTTP/2
#### 21.  准备好迎接 HTTP/2
随着 Google 一直向着[更加安全的 web](https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html) 发展 ，最终在 Chrome 中所有的 HTTP 网页将会被认为是“不安全”的，你将会需要去衡量是否继续在 HTTP/1.1 上做赌注，还是建立 [HTTP/2 环境](https://http2.github.io/faq/) 。 HTTP/2 已经被[很好的支持](http://caniuse.com/#search=http2)了。在大多数情况下，你最好使用它，这将是意义重大的，你迟早会把方向转移到 HTTP/2 的。最重要的是，通过 `service workers` 和 `server push` （至少长期）[性能将会有巨大的的飞跃](https://www.youtube.com/watch?v=RWLzUnESylc&t=1s&list=PLNYkxOF6rcIBTs2KPy1E6tIYaWoFcG3uj&index=25)。

![](https://www.smashingmagazine.com/wp-content/uploads/2016/12/http-pages-chrome-opt.png) 

*最终， Google 计划标记所有的 HTTP 页面为不安全的，改变 HTTP 网页原有的安全标志为红色的警告，示意为损坏的 HTTPS。*

缺点就是你需要去迁移到 HTTP/2 ，取决于使用 HTTP/1.1 用户数量有多大（就是使用旧版操作体统或使用旧版浏览器的用户），需要你发送不同的构建文件，这将要求你适应[不同的构建流程](https://rmurphey.com/blog/2015/11/25/building-for-http2) 。注意： 迁移和建立新的构建流程将会是棘手和费时的。文章剩余的部分，我将会假设你是正在切换或已经切换到 HTTP/2 了。

#### 22. 正确部署 HTTP/2
其次，通过 [HTTP/2 提供资源](https://www.youtube.com/watch?v=yURLTwZ3ehk) 
将是一次巨大的翻新，与以往获取资源的方式相去胜远。你需要在模块打包和并行加载好多小模块中做出比较好的权衡。

一方面，你也许想要避免一次获取全部的资源，而是将整个界面拆分成好多小模块，把他们作为构建过程的一部分压缩，可以参考 [ “scout” approach](https://rmurphey.com/blog/2015/11/25/building-for-http2) 和 并行加载。其中一个文件有改动的时候不用重新下载整个样式表或者JavaScript文件。

另一方面，打包依旧很重要，因为向浏览器发送很多小 JavaScript 文件将会存在很多问题。首先，压缩是受损的。使用 字符重用 （相关：LZW压缩算法）有利于 大 包 的压缩。而不利于分离的小 包 的压缩。这方面的标准也有一些标准，但现在离我们还是太远了。其次，浏览器并未对这方面的工作流进行优化。举个例子，Chrome 将会根据资源数触发相应数量的[inter-process communications](https://www.chromium.org/developers/design-documents/inter-process-communication)(IPCs) ,， 所以包含数百个资源将会有浏览器的运行成本。

![](https://www.smashingmagazine.com/wp-content/uploads/2016/12/progressive-css-loading-opt.png)

*为了使用 HTTP/2 实现最佳效果， 参考 Chrome’s Jake Archibald 的建议，[逐步加载css](https://jakearchibald.com/2016/link-in-body/) *

你也可以尝试 [逐步加载css](https://jakearchibald.com/2016/link-in-body/)。明显的，你这样做对于 HTTP/1.1 用户是不友好的， 所以作为你部署流程的一部分，你需要对不同的浏览器产生不同的构建方式，当然事情也会变得略显复杂。你也可以放弃 [  HTTP/2 connection coalescing](https://daniel.haxx.se/blog/2016/08/18/http2-connection-coalescing/)， 得益于 HTTP/2 ，允许你使用域分片，但是这个具体实现还是有点难度的。

怎么去做？如果你已运行在 HTTP/2， 作为妥协（对于旧版浏览器来说不算很坏），可以发送了大约10个包。当然对于自己的网站，还是需要实验和测试出合适的值是多少。


#### 23. 确保服务的安全性
所有浏览器的都是依赖 TLS 实现 HTTP/2 的 ，所以你可能想要避免安全性警告或有些网页无法工作。再次检查你的 [正确设置安全性头部](https://securityheaders.io/) ，[消除已知漏洞](https://www.smashingmagazine.com/2016/01/eliminating-known-security-vulnerabilities-with-snyk/) ， [检查你的证书](https://www.ssllabs.com/ssltest/)。

已经迁移到 HTTPS了吗？查阅  [The HTTPS-Only Standard](https://https.cio.gov/faq/) ，以获取完整的指南。另外，确保所有的外部插件和跟踪脚本通过 HTTPS 加载，跨域脚本是不被允许的，[HTTP Strict Transport Security headers](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security_Cheat_Sheet) 和 [ Content Security Policy headers](https://content-security-policy.com/) 被正确设置。

#### 24. 服务和 CNDs 支持 HTTP/2 ?
不同的服务和 CDNs 支持 HTTP/2 的程度是不一样的。使用 [ Is TLS Fast Yet?](https://istlsfastyet.com/)去查看符合你的选项，快速查看你服务的性能如何，支持哪些特性。

![](https://www.smashingmagazine.com/wp-content/uploads/2016/12/isitfastyet_doieve_c_scalew_1393-opt.png)

*[ Is TLS Fast Yet?](https://istlsfastyet.com/) 允许你查看当你切换到 HTTP/2 时 你的服务和CDNs支持的选项。*

#### 25.  Brotli or Zopfli compression
 去年，Google [介绍](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html)了 [Brotli](https://github.com/google/brotli)， 一个新的开源无损数据格式，已被Chrome， FireFox，Opera [广泛支持](http://caniuse.com/#search=brotli)。 实践中，Brotli 相比于 Gzip 和 Defalte 表现[更加有效](https://samsaffron.com/archive/2016/06/15/the-current-state-of-brotli-compression)。取决于设置，它可能会缓慢压缩，但是缓慢压缩最终导致高压缩率。而且，Brotli 解压是非常迅速的。因为是来源于Google的算法，那么对于浏览器只对用户浏览的HTTPS网页支持Brotli也就不奇怪了——好吧，其实里面也有一些技术上的原因。。。现今 Brotli 不是预先安装在大部分服务器上的，而且没有自编译的 NGINX 或 Ubuntu也不是那么容易安装 Brotli。然而，你甚至可以 [在不支持 Brotli 的CDNs上启用它](http://calendar.perfplanet.com/2016/enabling-brotli-even-on-cdns-that-dont-support-it-yet/)（使用的是 service worker 技术）。


或者，你可以去瞧瞧[ Zopfli 压缩算法](https://blog.codinghorror.com/zopfli-optimization-literally-free-bandwidth/)，它可以把数据编码成 Deflate， Gzip，Zlib格式。任何传统的 Gzip压缩资源，将会从 Zopfli 改进的 Deflate 编码方式中受益，因为文件将会比以 Zlib 最大的压缩方式压缩的文件小 3% ~ 8%。值得一提的是，文件将花费80倍的时间来压缩。这就是为什么推荐对那些不是经常改动的文件使用 Zopfli 压缩。

#### 26. 启用了 OCSP stapling 吗？
通过在你的服务器上[启用 OCSP stapling](https://www.digicert.com/enabling-ocsp-stapling.htm)， 你可以加速 TLS 握手。`The Online Certificate Status Protocol` (OCSP)被 创建为替代 ` the Certificate Revocation List` (CRL) 的方案。这两个协议被用作检查 SSL 证书是否被撤销。然而，`the OCSP protocol` 不要求浏览器下载，而是在列表中搜索证书的相关信息，因此减少了握手中的请求时间。

#### 27.  你已经采用 IPv6 了？
因为我们正在[耗尽 IPv4 空间](https://en.wikipedia.org/wiki/IPv4_address_exhaustion) ，主要的移动网络正在迅速的支持 IPv6（美国已经有 [50%](https://www.google.com/intl/en/ipv6/statistics.html#tab=ipv6-adoption&tab=ipv6-adoption) 的采用了 IPv6）。建议更新你的 DNS 到 IPv6，紧跟时代趋势。只需要确保网络提供 `dual-stack` 支持 —— 它允许 IPv6 和 IPv4 同时互不干涉的运行。但是终究，IPv6是不向后兼容的。而且，[研究显示](https://www.cloudflare.com/ipv6/) IPv6 凭借  neighbor discovery (NDP)  和 路由优化 让网站运行块 10% ~ 15%。

#### 28.  启用了 HPACK 压缩？
如果你正在使用 HTTP/2 ， 为了减少不必要的开销，再次检查是否启用了 HPACK 压缩 HTTP 响应头部。因为 HTTP/2 服务还是相对来说比较新的，他们不一定完全支持规范，使用   HPACK 就是一个例子。 [H2spec ](https://github.com/summerwind/h2spec) 是一个检查上述支持情况的比较好的工具。 [ HPACK works](https://www.keycdn.com/blog/http2-hpack-compression/).

![](https://www.smashingmagazine.com/wp-content/uploads/2016/12/h2spec-example-750w-opt.png)


*H2spec（[View large version](https://www.smashingmagazine.com/wp-content/uploads/2016/12/h2spec-example-large-opt.png)）*

#### 29.  为缓存和网络降级启用 service workers 了？

任何对于网络的性能优化都不可能比用户机器上本地存储缓存来的快。如果你的网站启用了 HTTPS， 使用 [Pragmatist’s Guide to Service Workers](https://github.com/lyzadanger/pragmatist-service-worker)在 `service worker cache` 和 离线存储（甚至完全离线的页面） 中 缓存静态资源，这样可以从用户本机上检索资源，而不是去网络上请求。参考：Jake’s [Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/) 和 the free Udacity course [Offline Web Applications](https://www.udacity.com/course/offline-web-applications--ud899) 。浏览器支持吗？看[这里](http://caniuse.com/#search=serviceworker), 不管网络状况如何，这样的后备方案都是适用的。


### 测试和监控
#### 30. 监控混合内容的警告
如果你最近已经从 HTTP 迁移到了HTTPS， 请务必使用工具[Report-URI.io.](https://report-uri.io/)监控主动的和被动的混合内容警告。你也可以为混合内容，使用 [ Mixed Content Scan](https://github.com/bramus/mixed-content-scan) 去扫描支持 HTTPS 的站点。

#### 31.  在 DevTools 中优化了你的开发工作流吗？
挑选一个调试工具，然后点击每一个简单的按钮。请确保自己能理解怎么去分析渲染性能和  console 输出，还有怎么去调试 JavaScript 和编辑 CSS 样式。Umar Hansa 最近准备了一个（很大的）[slidedeck](https://umaar.github.io/devtools-optimise-your-web-development-workflow-2016/#/) 和 [talk](https://www.youtube.com/watch?v=N33lYfsAsoU) 覆盖了几十个隐藏的提示和技术，能帮助我们更好的在 DevTools 中调试和测试。

#### 32.  你在代理浏览器和旧版浏览器中测试过吗？
在 Chrome 和 FireFox 中测试是不够的。研究你的网站是怎么在代理浏览器和旧版浏览器中工作的。例如， UC 浏览器 和 Opera Mini ，在亚洲占着[一定的市场份额](http://gs.statcounter.com/#mobile_browser-as-monthly-201511-201611)（高达 35%），测试你感兴趣的国家[网速的平均值](https://www.webworldwide.io/)， 避免以后听说的时候被惊讶到。使用网络节流调节测试，来模仿高DPI的设备。[ BrowserStack](https://www.browserstack.com/)，就是一个非常棒的工具，也可以在真实设备商测试。

#### 33.  建立了持续的监控？
有一个有用的私有地实例 [WebPagetest](http://www.webpagetest.org/)可以快速无限制的被测试。建立一个可以自动报警的持续性能预算监控。设置你自己的用户时间标记去测试  监控业务特定的指标。查看使用 [SpeedCurve](https://speedcurve.com/) 监控随着时间推移的性能的改变，使用 [New Relic](https://newrelic.com/browser-monitoring) 得到 `WebPagetest `不能提供的数据。还有一些工具：[SpeedTracker](https://speedtracker.org/) ，[Lighthouse](https://github.com/GoogleChrome/lighthouse) ， [Calibre](https://calibreapp.com/)。

### 快速获取：
这份清单还是相当全面的，完成所有的优化手段会需要相当一段时间的。所以，你只有1小时的时间，想去取得性能上显著的提升，应该怎么做？我们把它们合到 10 个 比较容易的方案上。当然，在你开始之前和完成之后，需要在 3G网络 和 有线网络中，分别测试 `start rendering time` 和 ` SpeedIndex ` 两个指标的值。

1. 你的目标是 `start rendering time` 在有线网络中小于 1 秒，在 3G 网络中小于 3 秒，和 ` SpeedIndex ` 值低于1000。然后优化 `start rendering time` 和 `time-to-interactive` 两个值。
2.  为你的模版准备 `critical CSS` ，将其包含在页面 `<head>`标签内。（你的关键CSS大小预算是 14KB）。
3.  尽可能延迟和懒加载尽量多的 scripts ，以及你的和第三方的 scripts —— 特别是社交媒体按钮相关的，视频播放相关的和高代价的JavaScript。
4.  添加资源提示加速传输：`dns-lookup`, `preconnect`, `prefetch`, `preload` 和 `prerender`。
5.  添加 web fonts 子集以及异步加载它们（或只切换到系统字体）。
6.  优化图片，对关键页面图片使用 WebP 格式（像是登录页面）。
7.  检查是否正确设置 HTTP 缓存头部和安全性头部。
8.  在服务上启用 Brotli 或 Zopfli 压缩。（如果这不现实，也不要忘记 Gzip 压缩）
9.  如果 HTTP/2 可用，启用   HPACK 压缩 和 监控混合内容的警告。如果你运行了 LTS， 别忘了启用 OCSP stapling。
10.  如果可能，在  service worker 缓存中，缓存像是字体，样式，JavaScript，图片这样的资源——其实是，缓存越多越好！。


### Off We Go！
有些优化手段可能超出了你工作的范围，预算或是你负责的被遗弃的遗留代码范畴。没关系！把这份清单作为一般（希望是全面的）的指南，根据你实际的情况，列出你自己的问题列表。但是最最重要的是，在优化之前测试和监控你的项目，发现性能问题所在。最后希望大家，2017年有一个快乐的性能体验！
