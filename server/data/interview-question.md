# 前端面试题

## 一、HTML / CSS

### 1. 语义化 HTML 的意义是什么？常见语义化标签有哪些？

语义化让页面结构更清晰，利于 SEO、可访问性和维护。常见标签有 `header`、`nav`、`main`、`section`、`article`、`aside`、`footer`、`figure` 等。

### 2. HTML5 有哪些新特性？

包括语义化标签、音视频标签、Canvas、SVG、Web Storage、WebSocket、Service Worker、地理定位、拖拽 API、表单新类型和新属性等。

### 3. `DOCTYPE` 的作用是什么？

`DOCTYPE` 用于告诉浏览器使用哪种文档类型解析规则。HTML5 中写 `<!DOCTYPE html>` 可让浏览器以标准模式渲染页面。

### 4. 行内元素、块级元素、行内块元素有什么区别？

行内元素不独占一行，宽高通常由内容决定；块级元素独占一行，可设置宽高；行内块元素不独占一行但可设置宽高，如 `inline-block`。

### 5. `meta viewport` 的作用是什么？移动端适配常用哪些方案？

`viewport` 用于控制移动端视口宽度和缩放。常见适配方案有响应式布局、`rem` 适配、`vw/vh` 适配、媒体查询和弹性布局。

### 6. `src` 和 `href` 有什么区别？

`src` 用于引入资源并替换当前元素内容，如 `script`、`img`；`href` 用于建立当前文档与目标资源的链接关系，如 `a`、`link`。

### 7. 表单的 `enctype` 有哪些取值？分别适用于什么场景？

常见值有 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`。普通表单用默认值，文件上传必须用 `multipart/form-data`。

### 8. `cookie`、`localStorage`、`sessionStorage` 有什么区别？

`cookie` 会随请求发送，容量小，可设过期时间；`localStorage` 持久存储，容量较大；`sessionStorage` 仅在当前会话有效，关闭标签页后清除。

### 9. 标准盒模型和 IE 盒模型有什么区别？

标准盒模型中 `width` 只包含内容区；IE 盒模型中 `width` 包含内容区、内边距和边框。可用 `box-sizing` 切换。

### 10. `box-sizing` 的作用是什么？

`box-sizing` 用于控制盒模型计算方式。`content-box` 是标准盒模型，`border-box` 让宽高包含内边距和边框。

### 11. 什么是 BFC？如何触发 BFC？BFC 有哪些应用？

BFC 是块级格式化上下文，是独立渲染区域。可通过 `overflow` 非 `visible`、`float`、绝对定位、`display: flow-root` 等触发。常用于清除浮动、防止外边距合并和隔离布局。

### 12. 清除浮动的常见方式有哪些？

常见方式有给父元素设置 `overflow: hidden`、使用伪元素清除浮动、使用 `display: flow-root`，或使用 Flex/Grid 布局避免浮动问题。

### 13. CSS 定位方式有哪些？各自特点是什么？

有 `static`、`relative`、`absolute`、`fixed`、`sticky`。`relative` 相对自身偏移；`absolute` 相对最近非 `static` 祖先定位；`fixed` 相对视口；`sticky` 在滚动到阈值后粘性定位。

### 14. `z-index` 的生效条件是什么？什么是层叠上下文？

`z-index` 通常只对定位元素或 Flex/Grid 子项等生效。层叠上下文是决定元素层级关系的独立环境，可由定位加 `z-index`、`opacity`、`transform` 等触发。

### 15. Flex 布局的常用属性有哪些？`flex: 1` 代表什么？

常用容器属性有 `justify-content`、`align-items`、`flex-direction`、`flex-wrap`；子项属性有 `flex`、`align-self`、`order`。`flex: 1` 通常等价于 `flex: 1 1 0%`，表示可放大、可缩小、基础尺寸为 0。

### 16. Grid 布局与 Flex 布局有什么区别？分别适合什么场景？

Flex 适合一维布局，如导航、工具栏；Grid 适合二维布局，如页面整体网格、复杂卡片布局。

### 17. CSS 选择器优先级如何计算？

优先级通常为：行内样式 > ID 选择器 > 类/属性/伪类 > 标签/伪元素 > 通配符。`!important` 会覆盖普通声明。

### 18. 伪类和伪元素有什么区别？常见用法有哪些？

伪类用于描述元素状态，如 `:hover`、`:focus`；伪元素用于创建或选择元素的一部分，如 `::before`、`::after`、`::first-line`。

### 19. 响应式布局的常见实现方案有哪些？

常见方案有媒体查询、百分比布局、Flex 布局、Grid 布局、`rem/vw` 适配、图片响应式和多端断点设计。

### 20. CSS 动画和 JavaScript 动画有什么区别？各自适用场景是什么？

CSS 动画由浏览器渲染引擎处理，性能通常较好，适合简单状态和过渡；JavaScript 动画控制灵活，适合复杂逻辑、交互和动态计算场景。

## 二、JavaScript

### 21. `var`、`let`、`const` 有什么区别？

`var` 有函数作用域和变量提升；`let`、`const` 有块级作用域和暂时性死区；`const` 声明后不能重新赋值，但对象内容可修改。

### 22. 什么是作用域链？

作用域链是变量查找时从当前作用域逐层向外查找的链式结构，直到全局作用域。

### 23. 什么是闭包？闭包有哪些应用和潜在问题？

闭包是能访问其他函数作用域变量的函数。常用于私有变量、函数工厂、防抖节流；潜在问题是可能延长变量生命周期，导致内存占用。

### 24. JavaScript 中 `this` 的绑定规则有哪些？

常见规则有默认绑定、隐式绑定、显式绑定、`new` 绑定和箭头函数词法绑定。优先级通常是 `new` > 显式 > 隐式 > 默认。

### 25. `call`、`apply`、`bind` 有什么区别？

`call` 和 `apply` 会立即调用函数，区别是参数形式；`bind` 返回绑定 `this` 后的新函数，不会立即执行。

### 26. 什么是原型链？原型链查找过程是怎样的？

每个对象都有原型，访问属性时先查自身，再沿 `__proto__` 或 `Object.getPrototypeOf` 逐层向上查找，直到 `null`。

### 27. `instanceof` 的判断原理是什么？

`instanceof` 会检查构造函数的 `prototype` 是否出现在对象的原型链上。

### 28. `new` 操作符执行过程中发生了什么？

创建新对象；将新对象原型指向构造函数 `prototype`；以新对象为 `this` 执行构造函数；若构造函数返回对象则返回该对象，否则返回新对象。

### 29. JavaScript 常见继承方式有哪些？各自优缺点是什么？

常见有原型链继承、构造函数继承、组合继承、原型式继承、寄生式继承、寄生组合继承和 `class extends`。寄生组合继承和 `class` 继承较常用，避免重复调用构造函数。

### 30. 什么是事件循环？浏览器事件循环和 Node.js 事件循环有什么区别？

事件循环负责协调调用栈、任务队列和渲染。浏览器按宏任务、微任务和渲染阶段循环；Node.js 有多个阶段，如 timers、poll、check 等，微任务在阶段切换时执行。

### 31. 宏任务和微任务有哪些？执行顺序是怎样的？

常见宏任务有 `setTimeout`、`setInterval`、I/O、UI 渲染；微任务有 `Promise.then`、`queueMicrotask`、`MutationObserver`。每轮宏任务后清空微任务队列。

### 32. Promise 有哪些状态？状态如何流转？

状态有 `pending`、`fulfilled`、`rejected`。只能从 `pending` 转为 `fulfilled` 或 `rejected`，且不可逆。

### 33. `async/await` 的原理是什么？如何处理异常？

`async` 函数返回 Promise，`await` 会暂停执行等待 Promise 结果。可用 `try/catch` 捕获异常，也可在调用处 `.catch`。

### 34. 深拷贝和浅拷贝有什么区别？如何实现深拷贝？

浅拷贝只复制第一层引用；深拷贝递归复制嵌套对象。可用 `structuredClone`、递归实现或库实现，注意循环引用和特殊对象。

### 35. 防抖和节流有什么区别？分别如何实现？

防抖是事件停止触发后延迟执行；节流是固定时间间隔内最多执行一次。防抖用定时器重置，节流用时间戳或定时器控制频率。

### 36. `map`、`forEach`、`filter`、`reduce` 有什么区别？

`map` 返回新数组；`forEach` 只遍历不返回新数组；`filter` 返回满足条件的元素；`reduce` 将数组累积为单个值。

### 37. 什么是事件委托？有哪些优缺点？

事件委托利用事件冒泡，把子元素事件监听绑定到父元素。优点是减少监听器、支持动态元素；缺点是依赖冒泡，部分事件不冒泡。

### 38. 事件捕获、事件冒泡和目标阶段有什么区别？

捕获阶段从根到目标；目标阶段在目标元素触发；冒泡阶段从目标向上传播。可通过 `addEventListener` 第三个参数控制。

### 39. 严格模式有哪些限制和作用？

严格模式禁止隐式全局变量、禁止删除变量、限制 `this` 默认绑定等，有助于发现错误并提升安全性。

### 40. JavaScript 类型转换规则是什么？常见隐式转换有哪些？

分为显式转换和隐式转换。常见隐式转换发生在 `+`、`==`、条件判断、布尔转换等场景，如字符串拼接和数值运算。

### 41. `==` 和 `===` 有什么区别？

`==` 会进行类型转换后比较；`===` 要求类型和值都相同，不进行类型转换。

### 42. `NaN` 有什么特点？如何判断 `NaN`？

`NaN` 表示非数字，与任何值都不相等，包括自身。可用 `Number.isNaN()` 判断，避免 `isNaN` 的隐式转换问题。

### 43. `JSON.stringify` 有哪些常见坑？

会忽略 `undefined`、函数和 `Symbol`；`NaN` 和 `Infinity` 会变成 `null`；循环引用会报错；日期会转字符串；`BigInt` 会报错。

### 44. CommonJS 和 ES Module 有什么区别？

CommonJS 是运行时加载，使用 `require/module.exports`；ES Module 是静态加载，使用 `import/export`，支持静态分析和 Tree Shaking。

### 45. 前端常见内存泄漏场景有哪些？如何排查？

常见有未解绑事件、定时器未清除、闭包引用大对象、全局变量、缓存未释放、DOM 引用未清理。可用浏览器 Performance、Memory 面板排查。

### 46. JavaScript 垃圾回收机制有哪些常见算法？

常见有引用计数和标记清除。现代引擎多用标记清除及分代回收、增量回收等优化策略。

### 47. 迭代器和生成器有什么区别？`yield` 的作用是什么？

迭代器实现 `next()` 返回 `{value, done}`；生成器是返回迭代器的函数，用 `function*` 定义。`yield` 用于暂停和恢复执行并产出值。

### 48. `Proxy` 和 `Reflect` 的作用是什么？

`Proxy` 用于拦截对象操作，如读写、调用；`Reflect` 提供操作对象的默认方法，常与 `Proxy` 配合实现转发。

### 49. `WeakMap`、`WeakSet` 与 `Map`、`Set` 有什么区别？

`WeakMap/WeakSet` 的键或元素是弱引用，不可枚举，利于避免内存泄漏；`Map/Set` 可枚举、可遍历，键为强引用。

### 50. 什么是柯里化？有什么应用场景？

柯里化是把多参数函数转换为依次接收参数的函数。常用于参数复用、函数组合、延迟执行和部分应用。

## 三、浏览器与网络

### 51. 从输入 URL 到页面展示完整过程发生了什么？

包括 URL 解析、DNS 解析、建立 TCP/TLS 连接、发送 HTTP 请求、服务器响应、浏览器解析 HTML/CSS、构建 DOM/CSSOM、布局、绘制和合成。

### 52. HTTP 缓存机制是什么？缓存字段有哪些？

HTTP 缓存分为强缓存和协商缓存。常见字段有 `Cache-Control`、`Expires`、`ETag`、`Last-Modified`、`If-None-Match`、`If-Modified-Since`。

### 53. 强缓存和协商缓存有什么区别？

强缓存命中时浏览器直接使用本地缓存，不发请求；协商缓存会向服务器验证资源是否变化，未变化返回 304。

### 54. Cookie 的常见属性有哪些？`HttpOnly`、`Secure`、`SameSite` 分别有什么作用？

常见属性有 `Domain`、`Path`、`Expires`、`Max-Age`、`HttpOnly`、`Secure`、`SameSite`。`HttpOnly` 禁止 JS 读取；`Secure` 仅 HTTPS 发送；`SameSite` 限制跨站发送。

### 55. 什么是同源策略？同源策略限制了什么？

同源要求协议、域名、端口一致。同源策略限制跨源读取响应、Cookie 访问和部分 DOM 操作，防止数据泄露。

### 56. CORS 的工作原理是什么？简单请求和预检请求有什么区别？

CORS 通过响应头授权跨源访问。简单请求直接发送；非简单请求先发 `OPTIONS` 预检，服务器允许后再发实际请求。

### 57. 常见跨域解决方案有哪些？各自优缺点是什么？

常见有 CORS、JSONP、代理服务器、Nginx 反向代理、postMessage。CORS 标准但需服务端配置；JSONP 只支持 GET；代理可绕过浏览器限制。

### 58. HTTP/1.1、HTTP/2、HTTP/3 有什么区别？

HTTP/1.1 有队头阻塞和文本协议；HTTP/2 多路复用、二进制分帧、头部压缩；HTTP/3 基于 QUIC/UDP，减少握手和队头阻塞。

### 59. HTTPS 握手过程是怎样的？如何保证安全性？

HTTPS 通过 TLS 握手协商密钥、验证证书、交换随机数，最终生成会话密钥。它结合非对称加密、对称加密和证书体系保证机密性、完整性和身份认证。

### 60. TCP 三次握手和四次挥手过程是什么？为什么需要三次握手？

三次握手：SYN、SYN-ACK、ACK；四次挥手：FIN、ACK、FIN、ACK。三次握手用于确认双方收发能力并同步序列号，防止历史连接误建立。

### 61. DNS 解析过程是怎样的？常见 DNS 记录有哪些？

解析顺序通常是浏览器缓存、系统缓存、hosts、本地 DNS、根域名服务器、顶级域和权威 DNS。常见记录有 A、AAAA、CNAME、MX、TXT、NS。

### 62. CDN 的原理是什么？如何提升访问速度？

CDN 通过边缘节点缓存静态资源，使用户就近访问，减少网络延迟和源站压力。常配合缓存策略、回源和负载均衡。

### 63. WebSocket 的工作原理是什么？与 HTTP 轮询相比有什么优势？

WebSocket 通过 HTTP 升级握手建立全双工长连接。相比轮询，实时性更好、开销更小、支持服务端主动推送。

### 64. Server-Sent Events 是什么？适用于什么场景？

SSE 是基于 HTTP 的服务端单向推送技术。适合实时通知、日志流、行情更新等服务器到客户端单向场景。

### 65. 浏览器渲染流程包括哪些阶段？

包括解析 HTML 构建 DOM、解析 CSS 构建 CSSOM、合成渲染树、布局、绘制、分层和合成。

### 66. 重排和重绘有什么区别？如何减少重排重绘？

重排是几何布局变化，重绘是外观变化。减少方式包括批量修改 DOM、使用 `transform/opacity` 动画、避免频繁读取布局属性、离屏操作。

### 67. `DOMContentLoaded` 和 `load` 事件有什么区别？

`DOMContentLoaded` 在 HTML 解析完成、DOM 构建后触发；`load` 在页面所有资源加载完成后触发。

### 68. 浏览器常见存储方式有哪些？如何选择？

常见有 Cookie、localStorage、sessionStorage、IndexedDB、Cache Storage。小量且需随请求发送用 Cookie；简单键值用 Storage；大量结构化数据用 IndexedDB；离线缓存用 Cache Storage。

### 69. Service Worker 的作用是什么？生命周期是怎样的？

Service Worker 是独立于页面的后台脚本，可拦截请求、做离线缓存和推送。生命周期包括注册、安装、激活、空闲和终止。

### 70. 前端路由的原理是什么？Hash 路由和 History 路由有什么区别？

前端路由通过监听 URL 变化切换视图。Hash 路由监听 `hashchange`，兼容性好；History 路由使用 `pushState/replaceState` 和 `popstate`，URL 更美观但需服务端配合。

## 四、工程化与构建

### 71. Webpack 的构建流程是怎样的？

从入口开始递归解析依赖，使用 loader 转换模块，plugin 扩展构建过程，生成 chunk，最后输出 bundle 文件。

### 72. Webpack 中 loader 和 plugin 有什么区别？

loader 用于转换模块源码，如处理 CSS、图片、TS；plugin 用于扩展构建流程，可监听生命周期钩子执行更复杂任务。

### 73. 什么是 Tree Shaking？生效条件有哪些？

Tree Shaking 是移除未使用代码的优化。通常要求 ES Module 静态结构、生产模式、无副作用或正确配置 `sideEffects`。

### 74. Webpack 热更新原理是什么？

Webpack Dev Server 通过 WebSocket 通知浏览器更新，浏览器拉取更新模块并替换，保留页面状态，无需整页刷新。

### 75. Vite 的原理是什么？为什么开发环境启动较快？

开发环境利用浏览器原生 ES Module 按需加载，依赖预构建；生产环境用 Rollup 打包。因此启动时无需先打包全部代码。

### 76. Babel 的作用是什么？常见配置有哪些？

Babel 用于将新语法转换为兼容代码，并支持插件和预设。常见配置有 `presets`、`plugins`、`targets`、`sourceType`。

### 77. npm 依赖版本中的 `^`、`~`、精确版本有什么区别？

`^1.2.3` 允许更新次版本和修订版本；`~1.2.3` 只允许修订版本更新；`1.2.3` 锁定精确版本。

### 78. 什么是 monorepo？常见实现方案有哪些？

monorepo 是把多个项目或包放在同一仓库管理。常见方案有 pnpm workspace、Yarn Workspaces、Lerna、Nx、Turborepo。

### 79. ESLint 和 Prettier 有什么区别？如何配合使用？

ESLint 主要检查代码质量和潜在错误；Prettier 主要统一格式。通常用 ESLint 管质量，Prettier 管格式，并通过配置避免规则冲突。

### 80. 前端 CI/CD 通常包含哪些流程？

通常包括代码检查、单元测试、构建打包、产物校验、部署到测试/生产环境、缓存刷新和监控告警。

## 五、性能优化

### 81. 常见前端性能指标有哪些？如何采集？

常见指标有 FP、FCP、LCP、CLS、INP、TTFB。可用 Performance API、Lighthouse、RUM 监控平台采集。

### 82. 首屏加载优化有哪些常见手段？

常见手段有路由懒加载、代码分割、资源压缩、CDN、预加载、SSR/SSG、骨架屏、图片优化和减少首屏请求。

### 83. 图片优化有哪些方式？WebP、AVIF 等格式有什么优势？

方式包括压缩、响应式图片、懒加载、CDN、雪碧图、字体图标。WebP 体积较小且兼容性较好；AVIF 压缩率更高但编码和兼容成本更高。

### 84. 懒加载的原理是什么？常见实现方式有哪些？

懒加载是资源进入视口或即将使用时再加载。可用 `IntersectionObserver`、滚动监听、`loading="lazy"` 和动态 `import()` 实现。

### 85. 代码分割的原理是什么？适合在哪些场景使用？

代码分割把代码拆成多个 chunk 按需加载。适合路由级、组件级、第三方依赖和低频功能模块。

### 86. 前端缓存策略如何设计？如何避免缓存更新问题？

HTML 通常不缓存或短缓存，静态资源用内容哈希并长期缓存，配合 `Cache-Control` 和协商缓存。发布时更新 HTML 引用新哈希资源。

### 87. 长列表渲染优化有哪些方案？

可用虚拟列表、分页、懒加载、`requestAnimationFrame` 分批渲染、减少 DOM 节点和复用列表项。

### 88. 如何监控和分析前端内存性能问题？

可用 Chrome DevTools Memory 面板、Performance 录制、堆快照和 Allocation Instrumentation。重点关注 DOM 节点、监听器、定时器和缓存增长。

## 六、前端安全

### 89. XSS 攻击的原理是什么？如何防范？

XSS 是攻击者向页面注入恶意脚本。防范包括输出转义、输入校验、CSP、避免 `innerHTML` 拼接、Cookie 设置 `HttpOnly`。

### 90. CSRF 攻击的原理是什么？如何防范？

CSRF 利用用户已登录状态诱导发起请求。防范包括 CSRF Token、SameSite Cookie、校验 Referer/Origin、关键操作二次确认。

### 91. CSP 的作用是什么？如何配置？

CSP 是内容安全策略，用于限制脚本、样式、图片等资源来源，降低 XSS 风险。可通过响应头 `Content-Security-Policy` 或 meta 配置。

### 92. 前端输入校验与注入类风险防范应注意什么？

前端校验只用于体验，服务端必须再次校验。应对输出做上下文转义，避免直接拼接 HTML/SQL/命令，限制危险字符和富文本白名单。

### 93. 点击劫持的原理是什么？如何防范？

点击劫持通过透明 iframe 诱导用户点击。防范可设置 `X-Frame-Options`、CSP `frame-ancestors`，或使用 JS 防嵌套。

## 七、TypeScript

### 94. `interface` 和 `type` 有什么区别？

`interface` 主要用于对象结构，可声明合并和继承；`type` 可定义联合、交叉、元组等更广泛类型，但不能声明合并。

### 95. TypeScript 泛型的作用是什么？常见使用场景有哪些？

泛型用于让类型参数化，提高复用性和类型安全。常见于函数、组件、数据结构、工具类型和 API 响应封装。

### 96. 类型断言和类型转换有什么区别？

类型断言只告诉编译器类型，不改变运行时值；类型转换会在运行时改变值或结构。断言不做运行时检查。

### 97. 什么是类型守卫？常见类型守卫方式有哪些？

类型守卫用于在运行时缩小类型范围。常见有 `typeof`、`instanceof`、`in`、字面量判断和自定义类型谓词 `value is Type`。

## 八、测试、调试与综合

### 98. 前端单元测试常用工具有哪些？如何设计测试用例？

常用工具有 Jest、Vitest、Mocha、Testing Library、Playwright、Cypress。测试用例应覆盖正常路径、边界值、异常分支和关键交互。

### 99. 浏览器调试常用工具有哪些？如何排查网络和性能问题？

常用 DevTools 的 Elements、Console、Network、Performance、Memory、Application。网络问题看请求头、状态码、耗时和缓存；性能问题看火焰图、长任务和渲染指标。

### 100. 前端监控通常包括哪些内容？如何设计前端监控体系？

通常包括错误监控、性能监控、接口监控、资源加载、用户行为和告警。设计上应统一采集 SDK、采样上报、Source Map 还原、聚合分析和告警闭环。
