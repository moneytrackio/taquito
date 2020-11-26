(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{86:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return s})),a.d(t,"rightToc",(function(){return c})),a.d(t,"default",(function(){return d}));var n=a(2),o=a(6),r=(a(0),a(94)),i={title:"Set delegate",author:"Simon Boissonneault-Robert"},s={unversionedId:"set_delegate",id:"set_delegate",isDocsHomePage:!1,title:"Set delegate",description:"Examples demonstrating delegation for various address type",source:"@site/../docs/set_delegate.md",slug:"/set_delegate",permalink:"/docs/set_delegate",version:"current",sidebar:"docs",previous:{title:"Originating (Deploying) Contracts",permalink:"/docs/originate"},next:{title:"Working with Smart Contracts",permalink:"/docs/smartcontracts"}},c=[{value:"Delegate from an implicit tz1 address",id:"delegate-from-an-implicit-tz1-address",children:[]},{value:"Delegation involving &quot;originated&quot; KT1 addresses",id:"delegation-involving-originated-kt1-addresses",children:[{value:"Example of delegation for a KT1 on Carthage/Proto006",id:"example-of-delegation-for-a-kt1-on-carthageproto006",children:[]}]}],l={rightToc:c};function d(e){var t=e.components,a=Object(o.a)(e,["components"]);return Object(r.b)("wrapper",Object(n.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"examples-demonstrating-delegation-for-various-address-type"},"Examples demonstrating delegation for various address type"),Object(r.b)("p",null,"In Tezos a delegation operation will set the delegate of an address."),Object(r.b)("p",null,"When the ",Object(r.b)("inlineCode",{parentName:"p"},"Babylon/proto005")," protocol amendment came into affect, it changed how delegation from KT1 addresses work. In order to set delegate for a KT1 account, the delegation must be completed by calling the KT1's smart contract ",Object(r.b)("inlineCode",{parentName:"p"},"do")," method. The ",Object(r.b)("inlineCode",{parentName:"p"},"do")," method takes a lambda function, and it is the logic of this function that causes the desired delegation to happen."),Object(r.b)("h2",{id:"delegate-from-an-implicit-tz1-address"},"Delegate from an implicit tz1 address"),Object(r.b)("p",null,"This is the simplest delegation scenario"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');\n\nawait Tezos.contract.setDelegate({ source: 'tz1_source', delegate: 'tz1_baker' })\n")),Object(r.b)("p",null,"Register as a delegate"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');\n\nawait Tezos.contract.registerDelegate({})\n")),Object(r.b)("h2",{id:"delegation-involving-originated-kt1-addresses"},'Delegation involving "originated" KT1 addresses'),Object(r.b)("p",null,"Pre-",Object(r.b)("inlineCode",{parentName:"p"},"Babylon/proto005"),' it was common to have "script-less" KT1 addresses. This changed when the Tezos blockchain migrated to the new ',Object(r.b)("inlineCode",{parentName:"p"},"Babylon/proto005")," protocol."),Object(r.b)("p",null,"During the migration form ",Object(r.b)("inlineCode",{parentName:"p"},"proto004")," to ",Object(r.b)("inlineCode",{parentName:"p"},"proto005")," all KT1 addresses were migrated so that they got a contract called ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"https://gitlab.com/nomadic-labs/mi-cho-coq/blob/master/src/contracts/manager.tz"}),"manager.tz"),'. This meant that there are no longer any "script-less" KT1 addresses in Tezos.'),Object(r.b)("p",null,"In order to delegate for a KT1 addresses with the new ",Object(r.b)("inlineCode",{parentName:"p"},"manager.tz")," contract, a call to the KT1's smart contract's ",Object(r.b)("inlineCode",{parentName:"p"},"do")," method is required. The ",Object(r.b)("inlineCode",{parentName:"p"},"do")," method takes a lambda function, and it is this lambda function that causes changes to occur in the KT1 address."),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"The examples following only apply to KT1 addresses that were migrated as part of the ",Object(r.b)("inlineCode",{parentName:"p"},"Babylon/proto005")," upgrade. Delegations involving ",Object(r.b)("em",{parentName:"p"},"other")," types of smart-contracts, will depend on those contracts specifically.")),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},Object(r.b)("strong",{parentName:"p"},"Why doesn't Taquito abstract KT1 manager accounts so I can just call setDelegate()")),Object(r.b)("p",{parentName:"blockquote"},"For the time being, we regard KT1 manager accounts as a regular smart contract. In fact, it is possible to have a smart contract that is not following the manager.tz conventions and that also delegates to a baker. The correct lambda to pass to a contract in order to delegate is application/wallet specific. Therefore Taquito does not make any assumption on the KT1.")),Object(r.b)("h3",{id:"example-of-delegation-for-a-kt1-on-carthageproto006"},"Example of delegation for a KT1 on Carthage/Proto006"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),'// const Tezos = new TezosToolkit(\'https://YOUR_PREFERRED_RPC_URL\');\n\nconst contract = await Tezos.contract.at("kt1...")\nawait contract.methods.do(setDelegate("tz1_delegate")).send()\n')),Object(r.b)("p",null,"Where ",Object(r.b)("inlineCode",{parentName:"p"},"setDelegate")," is a function that returns the necessary Michelson lambda. It looks like this:"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const setDelegate = (key: string) => {\n  return [\n    { prim: 'DROP' },\n    { prim: 'NIL', args: [{ prim: 'operation' }] },\n    {\n      prim: 'PUSH',\n      args: [{ prim: 'key_hash' }, { string: key }],\n    },\n    { prim: 'SOME' },\n    { prim: 'SET_DELEGATE' },\n    { prim: 'CONS' },\n  ];\n};\n")))}d.isMDXComponent=!0},94:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return g}));var n=a(0),o=a.n(n);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var l=o.a.createContext({}),d=function(e){var t=o.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=d(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=d(a),m=n,g=p["".concat(i,".").concat(m)]||p[m]||b[m]||r;return a?o.a.createElement(g,s(s({ref:t},l),{},{components:a})):o.a.createElement(g,s({ref:t},l))}));function g(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,i=new Array(r);i[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var l=2;l<r;l++)i[l]=a[l];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);