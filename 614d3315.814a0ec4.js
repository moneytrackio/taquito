(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{70:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return r})),a.d(t,"metadata",(function(){return c})),a.d(t,"rightToc",(function(){return s})),a.d(t,"default",(function(){return b}));var n=a(2),o=a(6),i=(a(0),a(94)),r={title:"Batch API",id:"batch_API",author:"Claude Barde"},c={unversionedId:"batch_API",id:"batch_API",isDocsHomePage:!1,title:"Batch API",description:"What is the Batch API?",source:"@site/../docs/batch-api.md",slug:"/batch_API",permalink:"/docs/batch_API",version:"current",sidebar:"docs",previous:{title:"Using the Lambda View",permalink:"/docs/lambda_view"},next:{title:"Tutorial Links",permalink:"/docs/tutorial_links"}},s=[{value:"What is the Batch API?",id:"what-is-the-batch-api",children:[]},{value:"How does it work?",id:"how-does-it-work",children:[]},{value:"What are the limitations?",id:"what-are-the-limitations",children:[]},{value:"References",id:"references",children:[]}],h={rightToc:s};function b(e){var t=e.components,a=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},h,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"what-is-the-batch-api"},"What is the Batch API?"),Object(i.b)("p",null,"Taquito provides a simple way of forging and sending transactions to the blockchain, whether you wish to send a few tez to a certain address or interact with a smart contract. Each Tezos account holds a counter that increments every time an operation is included in a block on the network. This feature prevents users from sending two or multiple transactions in a row as illustrated in this code snippet:"),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"/*\n * ONE OF THESE TRANSACTIONS WILL FAIL\n * AND YOU WILL GET AN ERROR MESSAGE\n */\nconst op1 = await contract.methods.interact('tezos').send();\nconst op2 = await contract.methods.wait([['unit']]).send();\n\nawait op1.confirmation();\nawait op2.confirmation();\n\n/*\n * Error Message returned by the node:\n * \"Error while applying operation opWH2nEcmmzUwK4T6agHg3bn9GDR7fW1ynqWL58AVRAb7aZFciD:\n * branch refused (Error:\n * Counter 1122148 already used for contract tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb (expected 1122149))\"\n */\n")),Object(i.b)("p",null,"Tracking the confirmation of transactions and the update of the transaction counter can be very frustrating and cumbersome, this is why Taquito provides the Batch API. The Batch API allows you to group all your transactions together and emit them at once under the same transaction counter value and the same transaction hash."),Object(i.b)("h2",{id:"how-does-it-work"},"How does it work?"),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"TezosToolkit")," object exposes a method called ",Object(i.b)("inlineCode",{parentName:"p"},"batch"),". Subsequently, the returned object exposes 6 different methods that can be concatenated according to the number of transactions to emit."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { TezosToolkit } from '@taquito/taquito';\n\nconst Tezos = new TezosToolkit('RPC address here');\nconst batch = await Tezos.batch();\n\n// Add here the operations to be emitted together\n\nconst batchOp = await batch.send();\nconsole.log('Operation hash:', batchOp.hash);\nawait batchOp.confirmation();\n")),Object(i.b)("p",null,"After concatenating the different methods to batch operations together, a single transaction is created and broadcast with a single operation hash returned. As for any other transaction created by Taquito, you then wait for a determined number of confirmations."),Object(i.b)("h4",{id:"--the-withtransfer-method"},"- The ",Object(i.b)("inlineCode",{parentName:"h4"},"withTransfer")," method"),Object(i.b)("p",null,"This method allows you to add a transfer of tez to the batched operations. It takes an object as a parameter with 4 properties. Two of them are mandatory: ",Object(i.b)("inlineCode",{parentName:"p"},"to")," indicates the recipient of the transfer and ",Object(i.b)("inlineCode",{parentName:"p"},"amount")," indicates the amount of tez to be transferred. Two other properties are optional: if ",Object(i.b)("inlineCode",{parentName:"p"},"mutez")," is set to ",Object(i.b)("inlineCode",{parentName:"p"},"true"),", the value specified in ",Object(i.b)("inlineCode",{parentName:"p"},"amount")," is considered to be in mutez. The ",Object(i.b)("inlineCode",{parentName:"p"},"parameter")," property takes an object where you can indicate an entrypoint and a value for the transfer."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const batch = await Tezos.batch()\n  .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })\n  .withTransfer({ to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', amount: 4000000, mutez: true })\n  .withTransfer({ to: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6', amount: 3 });\n")),Object(i.b)("h4",{id:"--the-withorigination-method"},"- The ",Object(i.b)("inlineCode",{parentName:"h4"},"withOrigination")," method"),Object(i.b)("p",null,"This method allows you to add the origination of one or multiple contracts to an existing batch of operations. It takes an object as a parameter with 4 properties. The ",Object(i.b)("inlineCode",{parentName:"p"},"code")," property is mandatory and can be a string representing the plain Michelson code or the JSON representation of the Michelson contract. The parameter object must also include an ",Object(i.b)("inlineCode",{parentName:"p"},"init")," or ",Object(i.b)("inlineCode",{parentName:"p"},"storage")," property: when ",Object(i.b)("inlineCode",{parentName:"p"},"init")," is specified, ",Object(i.b)("inlineCode",{parentName:"p"},"storage")," is optional and vice-versa. ",Object(i.b)("inlineCode",{parentName:"p"},"init")," is the initial storage object value that can be either Micheline or JSON encoded. ",Object(i.b)("inlineCode",{parentName:"p"},"storage")," is a JavaScript representation of a storage object. Optionally, you can also indicate a ",Object(i.b)("inlineCode",{parentName:"p"},"balance")," for the newly created contract and a ",Object(i.b)("inlineCode",{parentName:"p"},"delegate"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const batch = await Tezos.batch()\n  .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })\n  .withOrigination({\n    code: validCode,\n    storage: initialStorage,\n    balance: 2,\n    delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',\n  });\n")),Object(i.b)("h4",{id:"--the-withdelegation-method"},"- The ",Object(i.b)("inlineCode",{parentName:"h4"},"withDelegation")," method"),Object(i.b)("p",null,"This simple method allows batching multiple delegation transactions. The method takes an object as a parameter with a single property: the address of the delegate."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const batch = await Tezos.batch().withDelegation({\n  delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',\n});\n")),Object(i.b)("h4",{id:"--the-withcontractcall-method"},"- The ",Object(i.b)("inlineCode",{parentName:"h4"},"withContractCall")," method"),Object(i.b)("p",null,"This method may be one of the most useful ones as it allows you to batch and emit multiple contract calls under one transaction. The parameter is also pretty simple: it takes the function you would call on the contract abstraction object if you would send a single transaction."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const batch = await Tezos.batch()\n  .withContractCall(contract.methods.interact('tezos'))\n  .withContractCall(contract.methods.wait([['unit']]));\n")),Object(i.b)("h4",{id:"--the-with-method"},"- The ",Object(i.b)("inlineCode",{parentName:"h4"},"with")," method"),Object(i.b)("p",null,"If you prefer having an array that contains objects with the different transactions you want to emit, you can use the ",Object(i.b)("inlineCode",{parentName:"p"},"with")," method. It allows you to group transactions as objects instead of concatenating function calls. The object you use expects the same properties as the parameter of the corresponding method with an additional ",Object(i.b)("inlineCode",{parentName:"p"},"kind")," property that indicates the kind of transaction you want to emit (a handy ",Object(i.b)("inlineCode",{parentName:"p"},"opKind")," enum is ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/ecadlabs/taquito/blob/master/packages/taquito-rpc/src/opkind.ts"}),"exported from the Taquito package")," with the valid values for the ",Object(i.b)("inlineCode",{parentName:"p"},"kind")," property)."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { OpKind } from '@taquito/taquito';\n\nconst batch = await Tezos.batch([\n  {\n    kind: OpKind.TRANSACTION,\n    to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',\n    amount: 2000000,\n    mutez: true,\n  },\n  {\n    kind: OpKind.ORIGINATION,\n    balance: '1',\n    code: validCode,\n    storage: 0,\n  },\n  {\n    kind: OpKind.DELEGATION,\n    delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',\n  },\n]);\n")),Object(i.b)("blockquote",null,Object(i.b)("p",{parentName:"blockquote"},"Note: you cannot make contract calls with this method.")),Object(i.b)("h4",{id:"--the-send-method"},"- The ",Object(i.b)("inlineCode",{parentName:"h4"},"send")," method"),Object(i.b)("p",null,"After batching all the necessary operations together, you must use the ",Object(i.b)("inlineCode",{parentName:"p"},"send")," method to emit them. This step is very similar to what you would do to emit a single transaction."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const batch = await Tezos.batch();\n/*\n * Here happens all the operation batching\n */\nconst batchOp = await batch.send();\nconsole.log('Operation hash:', batchOp.hash);\nawait batchOp.confirmation();\n")),Object(i.b)("p",null,"Like with other operations created by Taquito, the ",Object(i.b)("inlineCode",{parentName:"p"},"send")," method is a promise that returns an object where the operation hash is available under the ",Object(i.b)("inlineCode",{parentName:"p"},"hash")," property and where you can wait until the transaction is confirmed with the ",Object(i.b)("inlineCode",{parentName:"p"},"confirmation")," method (taking as a parameter the number of confirmations you would like to receive)."),Object(i.b)("h2",{id:"what-are-the-limitations"},"What are the limitations?"),Object(i.b)("p",null,"The limitations of batched operations are within the limitations of single operations, for example, the number of operations batched together is limited by the gas limit of the Tezos blockchain.\nIn addition to that, batched operations can only be signed by a single account."),Object(i.b)("h2",{id:"references"},"References"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/ecadlabs/taquito/blob/master/integration-tests/batch-api.spec.ts"}),"Integration tests")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(n.a)({parentName:"li"},{href:"https://tezostaquito.io/typedoc/classes/_taquito_taquito.walletoperationbatch-2.html"}),"Documentation"))))}b.isMDXComponent=!0},94:function(e,t,a){"use strict";a.d(t,"a",(function(){return l})),a.d(t,"b",(function(){return m}));var n=a(0),o=a.n(n);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var h=o.a.createContext({}),b=function(e){var t=o.a.useContext(h),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},l=function(e){var t=b(e.components);return o.a.createElement(h.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,r=e.parentName,h=s(e,["components","mdxType","originalType","parentName"]),l=b(a),d=n,m=l["".concat(r,".").concat(d)]||l[d]||p[d]||i;return a?o.a.createElement(m,c(c({ref:t},h),{},{components:a})):o.a.createElement(m,c({ref:t},h))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,r=new Array(i);r[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,r[1]=c;for(var h=2;h<i;h++)r[h]=a[h];return o.a.createElement.apply(null,r)}return o.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);