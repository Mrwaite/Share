## Task, mictask, queues and schedules(翻译)
作者: jake
原文链接: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
翻译: Mrwaite

当我告诉我同事 [Matt Gaunt](https://twitter.com/gauntface) ,我正在考虑写一篇关于 microtask queueing和浏览器 event loop 的执行, 他说他不会去读这篇文章...但,我还是会写,希望大家有所收获!

事实上,你首先可以了解 [Philip Roberts](https://twitter.com/philip_roberts) 在 [JSConf 上关于 event loop的演讲](https://www.youtube.com/watch?v=8aGhZQkoFbQ) - microtasks 并没有涉及, 除此之外它仍是非常好的介绍.

先看下面这段 JavaScript :
```javascript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

正确的结果是:`script start`, `script end`, `promise1`, `promise2`, `setTimeout`, 但浏览器支持不同还是会有所不同的!

Microsoft Edge, Firefox 40, iOS Safari 和 desktop Safari8.0.8会在 `promise1` 和 `promise2` 之前打印 `setTimeout`. 怪异的是, Firefox 39 和 Safari 8.0.7 却始终保持正确.

#### 解释

为了理解, 首先你需要知道 event loop 是怎么处理 tasks 和 microtasks.这样当你接触这方面问题的时候,脑子里将会有很多思路.深呼吸...


每个'线程'都会有自己的 event loop ,所以每个 web worker 都会得到自己的, 所以它们可以独立执行, 而所有同源的窗口共享一个 event loop他们可以同步通讯. event loop不断执行任何已排队的 tasks.一个 event loop 有很多的 task 源,并确保该源的执行顺序(例如 indexedDB), 但是浏览器可以在每一轮的循环中挑选哪个源任务去执行.这样允许浏览器优先去执行性能敏感的任务,像是用户输入.ok, stay with me...

Tasks需要被计划好, 这样浏览器深入到 JavaScript/DOM land, 确保这些 tasks 依次执行.两个 task 之间, 浏览器也许会渲染更新.从鼠标点击到事件回调需要安排一个 task ,解析HTML也是如此,在上面的例子中, `setTimeout`.

`setTimeout`等待一个给定的延迟时间, 然后为它的回调安排一个新的 task .这就是为什么`setTimeout`在`script end`之前打印, 打印`script end`是第一个 task 的一部分, `setTimeout` 是在另一个 task 中打印的.好, 我们大都能理解这个, 但是我需要你坚持看下去...

`Microtask` 通常是为那些在脚本执行完之后需要直接发生的任务而被安排的, 像是对一批任务做出反应, 或者在没有副作用的新 task 中做一些异步的事.只要没有其他 JavaScript 中间执行, 并且在每个任务结束之后, `Microtask` 队列将会在回调后执行.任何额外的 microtasks 将会被安排到队列的末尾, 依旧执行. `Microtask` 包括突发的观察者回调, 像上面的例子 promise 回调.


一旦 promise 状态保持不变, 它将会为其后面的回调函数在队列中加入一个 microtask. 这样就确保 promise 回调函数是异步的, 甚至 promise 已经变为 不可变状态(rejected or reslove, 就是即使临时加入一个promise回调也是会加入当前microtask的). 所以 `.tnen(yey, nay)`会立刻排入一个 microtask.  因为在 microtask 执行之前 当前的 running script(就是普通的执行脚本, 普通的script语句)必须执行完毕,所以 `promise1` 和 `promise2` 在 `script end` 之后打印.因为 microtask 总是在下一个 task 之前被执行, 所以 `promise1` 和 `promise2` 在 `setTimeout` 之前打印.

(当前script就是第一个task, 然后执行第一个microtask也就是`promise1`和`promise2`, 之后执行下一个task也就是`setTimeout`)

再看看一步一步来是怎么回事:
[原文有一个很好的一步一步查看task和microtask的示意图](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/#try-it/)

是的, 我搞了一个动画的分布示意图. 你是怎么度过你的周六的?和你的小伙伴出去溜溜?但是,我不是.若是因我惊人的UI设计中还是不明白, 点击上面的箭头一步一步前进.

#### 浏览器的兼容性

有些浏览器打印出来的结果是 `script start`, `script end`, `setTimeout`, `promise1`, `promise2`. 他们是在 `setTimeout`之后执行 promise 的.这就像是他们把 promise 回调当做是新的 task 的一部分,而不是作为一个 microtask.

这也是有点情有可原的, promises 是来自 ECMAScript 而不是 HTML的. ECMAScript有'jobs'这个概念, 和microtask有点类似,但是他们的关系是不明确的,就像[ES DISCUSS中争论的那样](https://esdiscuss.org/topic/the-initialization-steps-for-web-browsers#content-16), 然而普遍的共识是 promises 应该属于 microtask queue 中的一部分, 并有很好的解释.

把 promises 作为 tasks 对待会导致性能问题, 回调将会因为像渲染这样的任务相关的东西导致不必要的延迟执行.它还会因为其他任务源的影响而导致不确定性.

这里有个[Promise callbacks don't run as microtasksEdge](https://connect.microsoft.com/IE/feedback/details/1658365) 的 Edge 反馈, WebKit 连夜修正了, 所以我保证 Safari 最终也会修正, 它可能会在 FireFox 46 修复.

非常有意思的是, 自从被修复, Safari 和 FireFox 都遭遇了一次回退, 我想这应该是一个巧合.

#### 怎么去判断使用是 tasks 还是 microtask
测试是一个方法, 看log何时打印出来.

正确的方式是查看规范, 例如, [setTimeout 的第14步](https://html.spec.whatwg.org/multipage/webappapis.html#timer-initialisation-steps)中有关于如何对一个 task 进行排列, 而 [queuing a mutation record 的 第5步](https://dom.spec.whatwg.org/#queue-a-mutation-record) 是如何对 microtask 进行排列.

顺便提到, 在 ECMAScript 中, 他们称 microtask 为 'jobs'. 在 [ step 8.a of PerformPromiseThen](http://www.ecma-international.org/ecma-262/6.0/#sec-performpromisethen), `EnqueueJob` 被称为 `排列 microtask`.

现在, 让我看看更多的复杂的例子.

#### Level 1 Boss战
在写这篇文章之前, 我已经犯过错了. 这里是一段 html:
```
<div class="outer">
  <div class="inner"></div>
</div>
```

给它加上下面的 JS, 如果我点击 `div.inner` 会打印什么?
```javascript
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
```

在偷看答案之前自己运行一遍, 提示: 不止打印一次.

#### 验证

点击里面的块, 触发点击事件:
[原文章有一个可操作的小demo](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

和你猜的一样吗? 如果是, 你或许是正确的. 不幸的是, 不同浏览器会不太一致:
```
Chrome: click  |promise | mutate | click | promise | mutate | timeout | timeout

FireFox: click | mutate | click | mutate | timeout | promise | promise | timeout

Safari: | click | mutate | clic | mutate| promise | promise | timeout| timeout

IE:|click|click|mutate|timeout|promise|timeout|promise
```

#### 谁是正确的?

调度 'click' 事件的是一个 task. ` Mutation observer ` 和 `promise callbacks ` 是属于 microtask的. `setTimeout` 回调是作为一个task的.所以这里就是它们是如何运行的:

[查看原文章demo](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

如果是 Chrome , 它将会这样运行.其中对我来说新奇的是 microtask 是在 callbacks 之后处理的(只要没有其他的 JavaScript 中间执行).我认为它会被 `end-of-task` 限制.这个规则是来自 HTML 中的调用回调的规范:

> 如果[脚本设置的对象栈](https://html.spec.whatwg.org/multipage/webappapis.html#stack-of-script-settings-objects)是空的, 就[执行一次 microtask 检查](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)
> -- [HTML: 回调之后的清理 步骤3](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback)

microtask 检查点将会遍及整个 microtask 队列, 直到处理了整个 microtask 队列. 相似的是, ECMAScript 是这么描述 `jobs` 的:

> 只有在 没有正在运行的上下文 和 执行上下文栈是空的 这样的情况下, 才回去执行 `job`.
> -- [ECMAScript: Job and Job queues](http://www.ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues)

虽然在 HTML 上下文中 `can be` 会变成 `must be`~~~

#### 浏览器出错了?

`FireFox` 和 `Safari` 是在 click 监听者之间耗尽了 microtask 队列, 就像 mutation 回调所示, 但是 promises 似乎不太一样. 情有可原的是关联 `jobs` 和 `microtasks`是模糊的, 但我还是希望它们在监听者回调中调用.[Firefox ticket](https://bugzilla.mozilla.org/show_bug.cgi?id=1193394). [Safari ticket](https://bugs.webkit.org/show_bug.cgi?id=147933).

至于 Edge 我们已经看到排列 promise 是正确的,但是它在click 监听者之间处理 microtask 还是失败的, 取而代之的是会在所有监听者之后处理.这就能解释 `mutate` 会在所有 `click` 之后打印.[Bug ticket](https://connect.microsoft.com/IE/feedbackdetail/view/1658386/microtasks-queues-should-be-processed-following-event-listeners)

#### Level 1 boss暴躁的老大哥
使用上面例子, 如果我们执行 `inner.click()` 会怎么样?

它将会像前面一样开始时间调度, 但是使用的是 script 而不是 真正的交互.

#### try it
[原文demo](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

浏览器的执行结果是:
```
chrome: click | click | promise | mutate | promise | timeout | timeout
FireFox: click | click | mutate | timeout | promise | promise | timeout
Safari: click | click | mutate | promise | promise | timeout | timeout
IE: click | click | mutate | timeout | promise | timeout | promise
```

我发誓在 chrome 上还是会显示不同的结果, 如果你在chrome中得到不同的结果, 欢迎在评论中告诉我其版本号.

#### 为什么会不同
这就是它如何执行的:
```javascript
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});
```

[原文demo](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

所以正确的是: click, click, promise, mutate, promise, timeout, timeout, chrome 上好像是正确的.

当所有的 监听者 回调都被调用之后...
> 如果[脚本设置的对象栈](https://html.spec.whatwg.org/multipage/webappapis.html#stack-of-script-settings-objects)是空的, 就[执行一次 microtask 检查](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)
> -- [HTML: 回调之后的清理 步骤3](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback)

原先, 这表明 microtask 是在 监听者回调之间 运行的, 但是 `.click()`导致事件同步调用, 所以在回调中 调用`.click()的script`依旧在栈中的. 以上的规则确保 microtask 不会中断 中间执行的 JavaScript.这意味着我们在监听者回调中是不会处理 microtask 的, 他们会在所有的监听者时候被处理.

#### 这有什么关系吗?

好吧, 这还是讲的比较晦涩.我在尝试为 [`indexedDB` 创建一个简单的包装库过程中](https://github.com/jakearchibald/indexeddb-promised/blob/master/lib/idb.js), 使用了 promise 而不是 `IDBRequest` 对象, 遇到了这个问题.这使IDB很有趣的被使用.

当 IDB 触发了一个成功的事件, [涉及到交易的对象在调度完之后就变成停滞状态](http://w3c.github.io/IndexedDB/#fire-a-success-event)(步骤4),如果我创建一个 promise 会在 当事件 fire 时变为 resolve 状态, 当交易还是活跃的时候该回调应该在步骤4之前运行, 但是除了chrome在其他浏览器上预期的并未发生.

你可以在FireFox上试试触发这个问题, 因为像 [es6-promise](https://github.com/jakearchibald/es6-promise) 使用 `mutation observer` 作为回调, es6 polyfills使用的是 microtask. Safari好像因为其 fix 也会有些问题, 这就是他们的 [ broken implementation of IDB](http://www.raymondcamden.com/2014/09/25/IndexedDB-on-iOS-8-Broken-Bad),不幸的是, 在 IE/
IE/Edge 上有些东西会反复的失败, 像是在回调之后 `mutation 事件` 并未被执行.

但愿我们将会在不久之后见到他们之间的一些互通性.

#### 你做到了!

总结:
+ Task会顺序执行, 浏览器可能会在他们之间 发生渲染.
+ Microtask也是顺序执行, 他们会在下面两种情况下被执行:
  + 在每一个回调之后, 只要没有其他的中间执行的javascript
  + 在每一个 task 结束之后
但愿你现在可以理解事件循环.

所以, 现在有人还在看吗?hello?hello>


#### 其他参考

[JS基础 Promise](https://github.com/BlackGanglion/My-Reading-List/issues/4)
[Difference between microtask and macrotask within an event loop context](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)
[非同步程式碼之霧：Node.js 的事件迴圈與 EventEmitter](https://medium.com/sivann-com-tw/%E9%9D%9E%E5%90%8C%E6%AD%A5%E7%A8%8B%E5%BC%8F%E7%A2%BC%E4%B9%8B%E9%9C%A7-node-js-%E7%9A%84%E4%BA%8B%E4%BB%B6%E8%BF%B4%E5%9C%88%E8%88%87-eventemitter-809432976c1b)
[javascript线程解释（setTimeout,setInterval你不知道的事）](http://www.cnblogs.com/youxin/p/3354924.html)








