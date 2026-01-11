X# TEST RESULTS (CURRENT)

> Required by guardrails when code changes are staged.
> Paste command(s) + output summary + failures.

- Commands run:
- Summary:
- Failures + notes:


## Ran at 2026-01-10 22:15:17

## Ran at 2026-01-10 22:16:59

No known test runner detected. Add real commands manually.


# TEST RESULTS (CURRENT)


## Ran at 2026-01-10 22:41:50


ENV: node=v24.12.0


---
COMMAND: npm.cmd -v
CWD: SPR_stage20_build


---
COMMAND: npm.cmd ci
CWD: SPR_stage20_build


# TEST RESULTS (CURRENT)


## Ran at 2026-01-10 22:42:50


ENV: node=v24.12.0


---
COMMAND: npm.cmd -v
CWD: SPR_stage20_build


---
COMMAND: npm.cmd ci
CWD: SPR_stage20_build


---
COMMAND: npm.cmd run check
CWD: SPR_stage20_build


---
COMMAND: npm.cmd run build
CWD: SPR_stage20_build


---
COMMAND: npm.cmd run test:smoke
CWD: SPR_stage20_build


SUMMARY: FAIL (one or more steps returned non-zero).


# TEST RESULTS (CURRENT)


## Ran at 2026-01-10 22:48:51


ENV: node=v24.12.0


---
COMMAND: npm.cmd -v
CWD: SPR_stage20_build


---
COMMAND: npm.cmd ci
CWD: SPR_stage20_build


---
COMMAND: npm.cmd run check
CWD: SPR_stage20_build


---
COMMAND: npm.cmd run build
CWD: SPR_stage20_build


---
COMMAND: npm.cmd run test:smoke
CWD: SPR_stage20_build


# CI RUN

Timestamp: 2026-01-10 22:58:14

ENV: node=v24.12.0

PM: C:\Program Files\nodejs\npm.cmd


---
COMMAND: C:\Program Files\nodejs\npm.cmd
CWD: SPR_stage20_build


# CI RUN

Timestamp: 2026-01-10 23:00:46

ENV: node=v24.12.0

PM: C:\Program Files\nodejs\npm.cmd


---
COMMAND: C:\Program Files\nodejs\npm.cmd -v
CWD: SPR_stage20_build


### STDOUT
`	xt
11.6.2

`" }
  if () { Append

EXIT_CODE: 0


---
COMMAND: C:\Program Files\nodejs\npm.cmd ci
CWD: SPR_stage20_build


### STDOUT
`	xt

added 452 packages, and audited 453 packages in 8s

54 packages are looking for funding
  run `npm fund` for details

1 high severity vulnerability

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

`" }
  if () { Append

EXIT_CODE: 0


---
COMMAND: C:\Program Files\nodejs\npm.cmd run check
CWD: SPR_stage20_build


### STDOUT
`	xt

> rest-express@0.18.0 check
> tsc


`" }
  if () { Append

EXIT_CODE: 0


---
COMMAND: C:\Program Files\nodejs\npm.cmd run build
CWD: SPR_stage20_build


# CI RUN
Timestamp: 2026-01-10 23:09:26
ENV: node=v24.12.0
PM: C:\Program Files\nodejs\npm.cmd

---
COMMAND: C:\Program Files\nodejs\npm.cmd -v
CWD: SPR_stage20_build
STDOUT:
11.6.2
EXIT_CODE: 0

---
COMMAND: C:\Program Files\nodejs\npm.cmd ci
CWD: SPR_stage20_build
STDOUT:

added 452 packages, and audited 453 packages in 12s

54 packages are looking for funding
  run `npm fund` for details

1 high severity vulnerability

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
EXIT_CODE: 0

---
COMMAND: C:\Program Files\nodejs\npm.cmd run check
CWD: SPR_stage20_build
STDOUT:

> rest-express@0.18.0 check
> tsc
EXIT_CODE: 0

---
COMMAND: C:\Program Files\nodejs\npm.cmd run build
CWD: SPR_stage20_build
STDOUT:

> rest-express@0.18.0 build
> npx tsx backend/script/build.ts

building client...
[36mvite v7.3.0 [32mbuilding client environment for production...[36m[39m
transforming...
[32mΓ£ô[39m 3122 modules transformed.
rendering chunks...
computing gzip size...
[2m../../dist/public/[22m[32mindex.html                 [39m[1m[2m    2.03 kB[22m[1m[22m[2m Γöé gzip:   0.78 kB[22m
[2m../../dist/public/[22m[35massets/index-CwfyZWyc.css  [39m[1m[2m   74.14 kB[22m[1m[22m[2m Γöé gzip:  12.29 kB[22m
[2m../../dist/public/[22m[36massets/index-DBLEVJP2.js   [39m[1m[33m1,018.16 kB[39m[22m[2m Γöé gzip: 298.01 kB[22m
[32mΓ£ô built in 5.65s[39m
building server...
STDERR:
npm.cmd : [33m
At C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\scripts\oh-ci.ps1:36 char:5
+     & $exe @argv 1> $tmpOut.FullName 2> $tmpErr.FullName
+     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ([33m:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking:
https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m

  dist\index.cjs  1.1mb

Done in 338ms
EXIT_CODE: 0

---
COMMAND: C:\Program Files\nodejs\npm.cmd run test:smoke
CWD: SPR_stage20_build
STDOUT:

> rest-express@0.18.0 test:smoke
> node backend/script/smoke.cjs
STDERR:
npm.cmd : C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:70
At C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\scripts\oh-ci.ps1:36 char:5
+     & $exe @argv 1> $tmpOut.FullName 2> $tmpErr.FullName
+     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (C:\Users\Tigri\...st\index.cjs:70:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError

		`;await r.execute(g`CREATE SCHEMA IF NOT EXISTS ${g.identifier(a)}`),await r.execute(s);let u=(await r.all(g`select
id, hash, created_at from ${g.identifier(a)}.${g.identifier(i)} order by created_at desc limit 1`))[0];await
r.transaction(async c=>{for await(let l of e)if(!u||Number(u.created_at)<l.folderMillis){for(let p of l.sql)await
c.execute(g.raw(p));await c.execute(g`insert into ${g.identifier(a)}.${g.identifier(i)} ("hash", "created_at")
values(${l.hash}, ${l.folderMillis})`)}})}escapeName(e){return`"${e}"`}escapeParam(e){return`$${e+1}`}escapeString(e){r
eturn`'${e.replace(/'/g,"''")}'`}buildWithCTE(e){if(!e?.length)return;let r=[g`with `];for(let[n,i]of
e.entries())r.push(g`${g.identifier(i._.alias)} as (${i._.sql})`),n<e.length-1&&r.push(g`, `);return r.push(g`
`),g.join(r)}buildDeleteQuery({table:e,where:r,returning:n,withList:i}){let a=this.buildWithCTE(i),s=n?g` returning
${this.buildSelection(n,{isSingleTable:!0})}`:void 0,o=r?g` where ${r}`:void 0;return g`${a}delete from
${e}${o}${s}`}buildUpdateSet(e,r){let n=e[P.Symbol.Columns],i=Object.keys(n).filter(s=>r[s]!==void
0||n[s]?.onUpdateFn!==void 0),a=i.length;return g.join(i.flatMap((s,o)=>{let
u=n[s],c=r[s]??g.param(u.onUpdateFn(),u),l=g`${g.identifier(this.casing.getColumnCasing(u))} = ${c}`;return
o<a-1?[l,g.raw(", ")]:[l]}))}buildUpdateQuery({table:e,set:r,where:n,returning:i,withList:a,from:s,joins:o}){let
u=this.buildWithCTE(a),c=e[We.Symbol.Name],l=e[We.Symbol.Schema],p=e[We.Symbol.OriginalName],d=c===p?void
0:c,f=g`${l?g`${g.identifier(l)}.`:void 0}${g.identifier(p)}${d&&g`
${g.identifier(d)}`}`,y=this.buildUpdateSet(e,r),v=s&&g.join([g.raw(" from
"),this.buildFromTable(s)]),b=this.buildJoins(o),_=i?g` returning ${this.buildSelection(i,{isSingleTable:!s})}`:void
0,k=n?g` where ${n}`:void 0;return g`${u}update ${f} set
${y}${v}${b}${k}${_}`}buildSelection(e,{isSingleTable:r=!1}={}){let n=e.length,i=e.flatMap(({field:a},s)=>{let
o=[];if(w(a,N.Aliased)&&a.isSelectionField)o.push(g.identifier(a.fieldAlias));else if(w(a,N.Aliased)||w(a,N)){let
u=w(a,N.Aliased)?a.sql:a;r?o.push(new
N(u.queryChunks.map(c=>w(c,A)?g.identifier(this.casing.getColumnCasing(c)):c))):o.push(u),w(a,N.Aliased)&&o.push(g` as
${g.identifier(a.fieldAlias)}`)}else
w(a,ne)&&(r?o.push(g.identifier(this.casing.getColumnCasing(a))):o.push(a));return s<n-1&&o.push(g`, `),o});return
g.join(i)}buildJoins(e){if(!e||e.length===0)return;let r=[];for(let[n,i]of e.entries()){n===0&&r.push(g` `);let
a=i.table,s=i.lateral?g` lateral`:void 0;if(w(a,We)){let
o=a[We.Symbol.Name],u=a[We.Symbol.Schema],c=a[We.Symbol.OriginalName],l=o===c?void
0:i.alias;r.push(g`${g.raw(i.joinType)} join${s} ${u?g`${g.identifier(u)}.`:void 0}${g.identifier(c)}${l&&g`
${g.identifier(l)}`} on ${i.on}`)}else if(w(a,ct)){let o=a[ge].name,u=a[ge].schema,c=a[ge].originalName,l=o===c?void
0:i.alias;r.push(g`${g.raw(i.joinType)} join${s} ${u?g`${g.identifier(u)}.`:void 0}${g.identifier(c)}${l&&g`
${g.identifier(l)}`} on ${i.on}`)}else r.push(g`${g.raw(i.joinType)} join${s} ${a} on
${i.on}`);n<e.length-1&&r.push(g` `)}return
g.join(r)}buildFromTable(e){if(w(e,P)&&e[P.Symbol.OriginalName]!==e[P.Symbol.Name]){let
r=g`${g.identifier(e[P.Symbol.OriginalName])}`;return
e[P.Symbol.Schema]&&(r=g`${g.identifier(e[P.Symbol.Schema])}.${r}`),g`${r} ${g.identifier(e[P.Symbol.Name])}`}return e}
buildSelectQuery({withList:e,fields:r,fieldsFlat:n,where:i,having:a,table:s,joins:o,orderBy:u,groupBy:c,limit:l,offset:
p,lockingClause:d,distinct:f,setOperators:y}){let v=n??jt(r);for(let we of
v)if(w(we.field,ne)&&yt(we.field.table)!==(w(s,je)?s._.alias:w(s,xr)?s[ge].name:w(s,N)?void
0:yt(s))&&!(Te=>o?.some(({alias:Et})=>Et===(Te[P.Symbol.IsAlias]?yt(Te):Te[P.Symbol.BaseName])))(we.field.table)){let
Te=yt(we.field.table);throw new Error(`Your "${we.path.join("->")}" field references a column
"${Te}"."${we.field.name}", but the table "${Te}" is not part of the query! Did you forget to join it?`)}let
b=!o||o.length===0,_=this.buildWithCTE(e),k;f&&(k=f===!0?g` distinct`:g` distinct on (${g.join(f.on,g`, `)})`);let
E=this.buildSelection(v,{isSingleTable:b}),q=this.buildFromTable(s),V=this.buildJoins(o),F=i?g` where ${i}`:void
0,R=a?g` having ${a}`:void 0,L;u&&u.length>0&&(L=g` order by ${g.join(u,g`, `)}`);let te;c&&c.length>0&&(te=g` group
by ${g.join(c,g`, `)}`);let Be=typeof l=="object"||typeof l=="number"&&l>=0?g` limit ${l}`:void 0,pt=p?g` offset
${p}`:void 0,Je=g.empty();if(d){let we=g` for ${g.raw(d.strength)}`;d.config.of&&we.append(g` of
${g.join(Array.isArray(d.config.of)?d.config.of:[d.config.of],g`, `)}`),d.config.noWait?we.append(g` no
wait`):d.config.skipLocked&&we.append(g` skip locked`),Je.append(we)}let Pe=g`${_}select${k} ${E} from
${q}${V}${F}${te}${R}${L}${Be}${pt}${Je}`;return
y.length>0?this.buildSetOperations(Pe,y):Pe}buildSetOperations(e,r){let[n,...i]=r;if(!n)throw new Error("Cannot pass
undefined values to any set operator");return i.length===0?this.buildSetOperationQuery({leftSelect:e,setOperator:n}):th
is.buildSetOperations(this.buildSetOperationQuery({leftSelect:e,setOperator:n}),i)}buildSetOperationQuery({leftSelect:e
,setOperator:{type:r,isAll:n,rightSelect:i,limit:a,orderBy:s,offset:o}}){let u=g`(${e.getSQL()})
`,c=g`(${i.getSQL()})`,l;if(s&&s.length>0){let y=[];for(let v of s)if(w(v,A))y.push(g.identifier(v.name));else
if(w(v,N)){for(let b=0;b<v.queryChunks.length;b++){let
_=v.queryChunks[b];w(_,A)&&(v.queryChunks[b]=g.identifier(_.name))}y.push(g`${v}`)}else y.push(g`${v}`);l=g` order by
${g.join(y,g`, `)} `}let p=typeof a=="object"||typeof a=="number"&&a>=0?g` limit ${a}`:void 0,d=g.raw(`${r} ${n?"all
":""}`),f=o?g` offset ${o}`:void 0;return g`${u}${d}${c}${l}${p}${f}`}buildInsertQuery({table:e,values:r,onConflict:n,r
eturning:i,withList:a,select:s,overridingSystemValue_:o}){let u=[],c=e[P.Symbol.Columns],l=Object.entries(c).filter(([_
,k])=>!k.shouldDisableInsert()),p=l.map(([,_])=>g.identifier(this.casing.getColumnCasing(_)));if(s){let
_=r;w(_,N)?u.push(_):u.push(_.getSQL())}else{let _=r;u.push(g.raw("values "));for(let[k,E]of _.entries()){let
q=[];for(let[V,F]of l){let R=E[V];if(R===void 0||w(R,bt)&&R.value===void 0)if(F.defaultFn!==void 0){let
L=F.defaultFn(),te=w(L,N)?L:g.param(L,F);q.push(te)}else if(!F.default&&F.onUpdateFn!==void 0){let
L=F.onUpdateFn(),te=w(L,N)?L:g.param(L,F);q.push(te)}else q.push(g`default`);else
q.push(R)}u.push(q),k<_.length-1&&u.push(g`, `)}}let d=this.buildWithCTE(a),f=g.join(u),y=i?g` returning
${this.buildSelection(i,{isSingleTable:!0})}`:void 0,v=n?g` on conflict ${n}`:void 0,b=o===!0?g`overriding system
value `:void 0;return g`${d}insert into ${e} ${p}
${b}${f}${v}${y}`}buildRefreshMaterializedViewQuery({view:e,concurrently:r,withNoData:n}){let i=r?g`
concurrently`:void 0,a=n?g` with no data`:void 0;return g`refresh materialized view${i}
${e}${a}`}prepareTyping(e){return w(e,bs)||w(e,xs)?"json":w(e,ws)?"decimal":w(e,Ss)?"time":w(e,_s)||w(e,Es)?"timestamp"
:w(e,vs)||w(e,ys)?"date":w(e,Ts)?"uuid":"none"}sqlToQuery(e,r){return e.toQuery({casing:this.casing,escapeName:this.esc
apeName,escapeParam:this.escapeParam,escapeString:this.escapeString,prepareTyping:this.prepareTyping,invokeSource:r})}b
uildRelationalQueryWithoutPK({fullSchema:e,schema:r,tableNamesMap:n,table:i,tableConfig:a,queryConfig:s,tableAlias:o,ne
stedQueryRelation:u,joinOn:c}){let l=[],p,d,f=[],y,v=[];if(s===!0)l=Object.entries(a.columns).map(([k,E])=>({dbKey:E.na
me,tsKey:k,field:ir(E,o),relationTableTsKey:void 0,isJson:!1,selection:[]}));else{let
_=Object.fromEntries(Object.entries(a.columns).map(([R,L])=>[R,ir(L,o)]));if(s.where){let R=typeof
s.where=="function"?s.where(_,l8()):s.where;y=R&&ps(R,o)}let k=[],E=[];if(s.columns){let R=!1;for(let[L,te]of
Object.entries(s.columns))te!==void 0&&L in a.columns&&(!R&&te===!0&&(R=!0),E.push(L));E.length>0&&(E=R?E.filter(L=>s.c
olumns?.[L]===!0):Object.keys(a.columns).filter(L=>!E.includes(L)))}else E=Object.keys(a.columns);for(let R of E){let
L=a.columns[R];k.push({tsKey:R,value:L})}let q=[];s.with&&(q=Object.entries(s.with).filter(R=>!!R[1]).map(([R,L])=>({ts
Key:R,queryConfig:L,relation:a.relations[R]})));let V;if(s.extras){V=typeof
s.extras=="function"?s.extras(_,{sql:g}):s.extras;for(let[R,L]of
Object.entries(V))k.push({tsKey:R,value:yf(L,o)})}for(let{tsKey:R,value:L}of
k)l.push({dbKey:w(L,N.Aliased)?L.fieldAlias:a.columns[R].name,tsKey:R,field:w(L,ne)?ir(L,o):L,relationTableTsKey:void
0,isJson:!1,selection:[]});let F=typeof s.orderBy=="function"?s.orderBy(_,p8()):s.orderBy??[];Array.isArray(F)||(F=[F])
,f=F.map(R=>w(R,ne)?ir(R,o):ps(R,o)),p=s.limit,d=s.offset;for(let{tsKey:R,queryConfig:L,relation:te}of q){let Be=f8(r,n
,te),pt=vn(te.referencedTable),Je=n[pt],Pe=`${o}_${R}`,we=Ke(...Be.fields.map((Xr,Xi)=>ee(ir(Be.references[Xi],Pe),ir(X
r,o)))),Te=this.buildRelationalQueryWithoutPK({fullSchema:e,schema:r,tableNamesMap:n,table:e[Je],tableConfig:r[Je],quer
yConfig:w(te,Ur)?L===!0?{limit:1}:{...L,limit:1}:L,tableAlias:Pe,joinOn:we,nestedQueryRelation:te}),Et=g`${g.identifier
(Pe)}.${g.identifier("data")}`.as(R);v.push({on:g`true`,table:new je(Te.sql,{},Pe),alias:Pe,joinType:"left",lateral:!0}
),l.push({dbKey:R,tsKey:R,field:Et,relationTableTsKey:Je,isJson:!0,selection:Te.selection})}}if(l.length===0)throw new
ms({message:`No fields selected for table "${a.tsName}" ("${o}")`});let b;if(y=Ke(c,y),u){let _=g`json_build_array(${g.
join(l.map(({field:q,tsKey:V,isJson:F})=>F?g`${g.identifier(`${o}_${V}`)}.${g.identifier("data")}`:w(q,N.Aliased)?q.sql
:q),g`, `)})`;w(u,ks)&&(_=g`coalesce(json_agg(${_}${f.length>0?g` order by ${g.join(f,g`, `)}`:void 0}),
'[]'::json)`);let
k=[{dbKey:"data",tsKey:"data",field:_.as("data"),isJson:!0,relationTableTsKey:a.tsName,selection:l}];p!==void
0||d!==void 0||f.length>0?(b=this.buildSelectQuery({table:ls(i,o),fields:{},fieldsFlat:[{path:[],field:g.raw("*")}],whe
re:y,limit:p,offset:d,orderBy:f,setOperators:[]}),y=void 0,p=void 0,d=void
0,f=[]):b=ls(i,o),b=this.buildSelectQuery({table:w(b,We)?b:new je(b,{},o),fields:{},fieldsFlat:k.map(({field:q})=>({pat
h:[],field:w(q,ne)?ir(q,o):q})),joins:v,where:y,limit:p,offset:d,orderBy:f,setOperators:[]})}else b=this.buildSelectQue
ry({table:ls(i,o),fields:{},fieldsFlat:l.map(({field:_})=>({path:[],field:w(_,ne)?ir(_,o):_})),joins:v,where:y,limit:p,
offset:d,orderBy:f,setOperators:[]});return{tableTsKey:a.tsName,sql:b,selection:l}}}});var
Kc,y8=S(()=>{C();Kc=class{static[m]="TypedQueryBuilder";getSelectedFields(){return this._.selectedFields}}});function
qi(t,e){return(r,n,...i)=>{let a=[n,...i].map(s=>({type:t,isAll:e,rightSelect:s}));for(let s of
a)if(!ds(r.getSelectedFields(),s.rightSelect.getSelectedFields()))throw new Error("Set operator error (union /
intersect / except): selected fields are not the same or are in a different order");return r.addSetOperators(a)}}var et
,yh,Xc,Sj,_j,Ej,Tj,kj,Aj,Cj,xh=S(()=>{C();Gc();y8();fr();Br();Le();nr();xt();mr();de();de();hr();et=class{static[m]="Pg
SelectBuilder";fields;session;dialect;withList=[];distinct;constructor(e){this.fields=e.fields,this.session=e.session,t
his.dialect=e.dialect,e.withList&&(this.withList=e.withList),this.distinct=e.distinct}authToken;setToken(e){return
this.authToken=e,this}from(e){let r=!!this.fields,n=e,i;return this.fields?i=this.fields:w(n,je)?i=Object.fromEntries(O
bject.keys(n._.selectedFields).map(a=>[a,n[a]])):w(n,xr)?i=n[ge].selectedFields:w(n,N)?i={}:i=xn(n),new Xc({table:n,fie
lds:i,isPartialSelect:r,session:this.session,dialect:this.dialect,withList:this.withList,distinct:this.distinct}).setTo
ken(this.authToken)}},yh=class extends Kc{static[m]="PgSelectQueryBuilder";_;config;joinsNotNullableMap;tableName;isPar
tialSelect;session;dialect;constructor({table:e,fields:r,isPartialSelect:n,session:i,dialect:a,withList:s,distinct:o}){
super(),this.config={withList:s,table:e,fields:{...r},distinct:o,setOperators:[]},this.isPartialSelect=n,this.session=i
,this.dialect=a,this._={selectedFields:r},this.tableName=vr(e),this.joinsNotNullableMap=typeof
this.tableName=="string"?{[this.tableName]:!0}:{}}createJoin(e){return(r,n)=>{let i=this.tableName,a=vr(r);if(typeof
a=="string"&&this.config.joins?.some(s=>s.alias===a))throw new Error(`Alias "${a}" is already used in this
query`);if(!this.isPartialSelect&&(Object.keys(this.joinsNotNullableMap).length===1&&typeof
i=="string"&&(this.config.fields={[i]:this.config.fields}),typeof a=="string"&&!w(r,N))){let
s=w(r,je)?r._.selectedFields:w(r,ct)?r[ge].selectedFields:r[P.Symbol.Columns];this.config.fields[a]=s}if(typeof
n=="function"&&(n=n(new Proxy(this.config.fields,new pe({sqlAliasedBehavior:"sql",sqlBehavior:"sql"})))),this.config.jo
ins||(this.config.joins=[]),this.config.joins.push({on:n,table:r,joinType:e,alias:a}),typeof a=="string")switch(e){case
"left":{this.joinsNotNullableMap[a]=!1;break}case"right":{this.joinsNotNullableMap=Object.fromEntries(Object.entries(th
is.joinsNotNullableMap).map(([s])=>[s,!1])),this.joinsNotNullableMap[a]=!0;break}case"inner":{this.joinsNotNullableMap[
a]=!0;break}case"full":{this.joinsNotNullableMap=Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([s])=
>[s,!1])),this.joinsNotNullableMap[a]=!1;break}}return this}}leftJoin=this.createJoin("left");rightJoin=this.createJoin
("right");innerJoin=this.createJoin("inner");fullJoin=this.createJoin("full");createSetOperator(e,r){return n=>{let
i=typeof n=="function"?n(Sj()):n;if(!ds(this.getSelectedFields(),i.getSelectedFields()))throw new Error("Set operator
error (union / intersect / except): selected fields are not the same or are in a different order");return this.config.s
etOperators.push({type:e,isAll:r,rightSelect:i}),this}}union=this.createSetOperator("union",!1);unionAll=this.createSet
Operator("union",!0);intersect=this.createSetOperator("intersect",!1);intersectAll=this.createSetOperator("intersect",!
0);except=this.createSetOperator("except",!1);exceptAll=this.createSetOperator("except",!0);addSetOperators(e){return
this.config.setOperators.push(...e),this}where(e){return typeof e=="function"&&(e=e(new Proxy(this.config.fields,new
pe({sqlAliasedBehavior:"sql",sqlBehavior:"sql"})))),this.config.where=e,this}having(e){return typeof
e=="function"&&(e=e(new Proxy(this.config.fields,new
pe({sqlAliasedBehavior:"sql",sqlBehavior:"sql"})))),this.config.having=e,this}groupBy(...e){if(typeof
e[0]=="function"){let r=e[0](new Proxy(this.config.fields,new
pe({sqlAliasedBehavior:"alias",sqlBehavior:"sql"})));this.config.groupBy=Array.isArray(r)?r:[r]}else
this.config.groupBy=e;return this}orderBy(...e){if(typeof e[0]=="function"){let r=e[0](new
Proxy(this.config.fields,new pe({sqlAliasedBehavior:"alias",sqlBehavior:"sql"}))),n=Array.isArray(r)?r:[r];this.config.
setOperators.length>0?this.config.setOperators.at(-1).orderBy=n:this.config.orderBy=n}else{let
r=e;this.config.setOperators.length>0?this.config.setOperators.at(-1).orderBy=r:this.config.orderBy=r}return
this}limit(e){return
this.config.setOperators.length>0?this.config.setOperators.at(-1).limit=e:this.config.limit=e,this}offset(e){return thi
s.config.setOperators.length>0?this.config.setOperators.at(-1).offset=e:this.config.offset=e,this}for(e,r={}){return
this.config.lockingClause={strength:e,config:r},this}getSQL(){return
this.dialect.buildSelectQuery(this.config)}toSQL(){let{typings:e,...r}=this.dialect.sqlToQuery(this.getSQL());return
r}as(e){return new Proxy(new je(this.getSQL(),this.config.fields,e),new
pe({alias:e,sqlAliasedBehavior:"alias",sqlBehavior:"error"}))}getSelectedFields(){return new
Proxy(this.config.fields,new
pe({alias:this.tableName,sqlAliasedBehavior:"alias",sqlBehavior:"error"}))}$dynamic(){return this}},Xc=class extends yh
{static[m]="PgSelect";_prepare(e){let{session:r,config:n,dialect:i,joinsNotNullableMap:a,authToken:s}=this;if(!r)throw
new Error("Cannot execute a query on a query builder. Please use a database instance instead.");return
he.startActiveSpan("drizzle.prepareQuery",()=>{let
o=jt(n.fields),u=r.prepareQuery(i.sqlToQuery(this.getSQL()),o,e,!0);return
u.joinsNotNullableMap=a,u.setToken(s)})}prepare(e){return this._prepare(e)}authToken;setToken(e){return this.authToken=
e,this}execute=e=>he.startActiveSpan("drizzle.operation",()=>this._prepare().execute(e,this.authToken))};cE(Xc,[Ye]);Sj
=()=>({union:_j,unionAll:Ej,intersect:Tj,intersectAll:kj,except:Aj,exceptAll:Cj}),_j=qi("union",!1),Ej=qi("union",!0),T
j=qi("intersect",!1),kj=qi("intersect",!0),Aj=qi("except",!1),Cj=qi("except",!0)});var br,Zc=S(()=>{C();Wc();Br();nr();
xh();br=class{static[m]="PgQueryBuilder";dialect;dialectConfig;constructor(e){this.dialect=w(e,Qr)?e:void
0,this.dialectConfig=w(e,Qr)?void 0:e}$with=(e,r)=>{let n=this;return{as:a=>(typeof a=="function"&&(a=a(n)),new
Proxy(new Ii(a.getSQL(),r??("getSelectedFields"in a?a.getSelectedFields()??{}:{}),e,!0),new
pe({alias:e,sqlAliasedBehavior:"alias",sqlBehavior:"error"})))}};with(...e){let r=this;function n(s){return new
et({fields:s??void 0,session:void 0,dialect:r.getDialect(),withList:e})}function i(s){return new et({fields:s??void
0,session:void 0,dialect:r.getDialect(),distinct:!0})}function a(s,o){return new et({fields:o??void 0,session:void
0,dialect:r.getDialect(),distinct:{on:s}})}return{select:n,selectDistinct:i,selectDistinctOn:a}}select(e){return new
et({fields:e??void 0,session:void 0,dialect:this.getDialect()})}selectDistinct(e){return new et({fields:e??void
0,session:void 0,dialect:this.getDialect(),distinct:!0})}selectDistinctOn(e,r){return new et({fields:r??void
0,session:void 0,dialect:this.getDialect(),distinct:{on:e}})}getDialect(){return this.dialect||(this.dialect=new
Qr(this.dialectConfig)),this.dialect}}});var Cs,Jc,x8=S(()=>{C();fr();Br();Le();xt();mr();de();Zc();Cs=class{constructo
r(e,r,n,i,a){this.table=e,this.session=r,this.dialect=n,this.withList=i,this.overridingSystemValue_=a}static[m]="PgInse
rtBuilder";authToken;setToken(e){return this.authToken=e,this}overridingSystemValue(){return
this.overridingSystemValue_=!0,this}values(e){if(e=Array.isArray(e)?e:[e],e.length===0)throw new Error("values() must
be called with at least one value");let r=e.map(n=>{let i={},a=this.table[P.Symbol.Columns];for(let s of
Object.keys(n)){let o=n[s];i[s]=w(o,N)?o:new bt(o,a[s])}return i});return new Jc(this.table,r,this.session,this.dialect
,this.withList,!1,this.overridingSystemValue_).setToken(this.authToken)}select(e){let r=typeof e=="function"?e(new
br):e;if(!w(r,N)&&!ds(this.table[Oc],r._.selectedFields))throw new Error("Insert select error: selected fields are not
the same or are in a different order compared to the table definition");return new
Jc(this.table,r,this.session,this.dialect,this.withList,!0)}},Jc=class extends Ye{constructor(e,r,n,i,a,s,o){super(),th
is.session=n,this.dialect=i,this.config={table:e,values:r,withList:a,select:s,overridingSystemValue_:o}}static[m]="PgIn
sert";config;returning(e=this.config.table[P.Symbol.Columns]){return
this.config.returningFields=e,this.config.returning=jt(e),this}onConflictDoNothing(e={}){if(e.target===void
0)this.config.onConflict=g`do nothing`;else{let r="";r=Array.isArray(e.target)?e.target.map(i=>this.dialect.escapeName(
this.dialect.casing.getColumnCasing(i))).join(","):this.dialect.escapeName(this.dialect.casing.getColumnCasing(e.target
));let n=e.where?g` where ${e.where}`:void 0;this.config.onConflict=g`(${g.raw(r)})${n} do nothing`}return
this}onConflictDoUpdate(e){if(e.where&&(e.targetWhere||e.setWhere))throw new Error('You cannot use both "where" and
"targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');let
r=e.where?g` where ${e.where}`:void 0,n=e.targetWhere?g` where ${e.targetWhere}`:void 0,i=e.setWhere?g` where
${e.setWhere}`:void 0,a=this.dialect.buildUpdateSet(this.config.table,Rc(this.config.table,e.set)),s="";return s=Array.
isArray(e.target)?e.target.map(o=>this.dialect.escapeName(this.dialect.casing.getColumnCasing(o))).join(","):this.diale
ct.escapeName(this.dialect.casing.getColumnCasing(e.target)),this.config.onConflict=g`(${g.raw(s)})${n} do update set
${a}${r}${i}`,this}getSQL(){return
this.dialect.buildInsertQuery(this.config)}toSQL(){let{typings:e,...r}=this.dialect.sqlToQuery(this.getSQL());return
r}_prepare(e){return he.startActiveSpan("drizzle.prepareQuery",()=>this.session.prepareQuery(this.dialect.sqlToQuery(th
is.getSQL()),this.config.returning,e,!0))}prepare(e){return this._prepare(e)}authToken;setToken(e){return this.authToke
n=e,this}execute=e=>he.startActiveSpan("drizzle.operation",()=>this._prepare().execute(e,this.authToken));getSelectedFi
elds(){return this.config.returningFields?new Proxy(this.config.returningFields,new
pe({alias:yt(this.config.table),sqlAliasedBehavior:"alias",sqlBehavior:"error"})):void 0}$dynamic(){return
this}}});var Yc,bh=S(()=>{C();fr();mr();Yc=class extends Ye{constructor(e,r,n){super(),this.session=r,this.dialect=n,th
is.config={view:e}}static[m]="PgRefreshMaterializedView";config;concurrently(){if(this.config.withNoData!==void
0)throw new Error("Cannot use concurrently and withNoData together");return
this.config.concurrently=!0,this}withNoData(){if(this.config.concurrently!==void 0)throw new Error("Cannot use
concurrently and withNoData together");return this.config.withNoData=!0,this}getSQL(){return this.dialect.buildRefreshM
aterializedViewQuery(this.config)}toSQL(){let{typings:e,...r}=this.dialect.sqlToQuery(this.getSQL());return
r}_prepare(e){return
he.startActiveSpan("drizzle.prepareQuery",()=>this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()),void
0,e,!0))}prepare(e){return this._prepare(e)}authToken;setToken(e){return this.authToken=e,this}execute=e=>he.startActiv
eSpan("drizzle.operation",()=>this._prepare().execute(e,this.authToken))}});var b8=S(()=>{});var Is,wh,w8=S(()=>{C();bn
();fr();Br();Le();nr();xt();de();hr();Is=class{constructor(e,r,n,i){this.table=e,this.session=r,this.dialect=n,this.wit
hList=i}static[m]="PgUpdateBuilder";authToken;setToken(e){return this.authToken=e,this}set(e){return new
wh(this.table,Rc(this.table,e),this.session,this.dialect,this.withList).setToken(this.authToken)}},wh=class extends Ye{
constructor(e,r,n,i,a){super(),this.session=n,this.dialect=i,this.config={set:r,table:e,withList:a,joins:[]},this.table
Name=vr(e),this.joinsNotNullableMap=typeof this.tableName=="string"?{[this.tableName]:!0}:{}}static[m]="PgUpdate";confi
g;tableName;joinsNotNullableMap;from(e){let r=e,n=vr(r);return typeof
n=="string"&&(this.joinsNotNullableMap[n]=!0),this.config.from=r,this}getTableLikeFields(e){return
w(e,We)?e[P.Symbol.Columns]:w(e,je)?e._.selectedFields:e[ge].selectedFields}createJoin(e){return(r,n)=>{let
i=vr(r);if(typeof i=="string"&&this.config.joins.some(a=>a.alias===i))throw new Error(`Alias "${i}" is already used in
this query`);if(typeof n=="function"){let
a=this.config.from&&!w(this.config.from,N)?this.getTableLikeFields(this.config.from):void 0;n=n(new
Proxy(this.config.table[P.Symbol.Columns],new pe({sqlAliasedBehavior:"sql",sqlBehavior:"sql"})),a&&new Proxy(a,new
pe({sqlAliasedBehavior:"sql",sqlBehavior:"sql"})))}if(this.config.joins.push({on:n,table:r,joinType:e,alias:i}),typeof
i=="string")switch(e){case"left":{this.joinsNotNullableMap[i]=!1;break}case"right":{this.joinsNotNullableMap=Object.fro
mEntries(Object.entries(this.joinsNotNullableMap).map(([a])=>[a,!1])),this.joinsNotNullableMap[i]=!0;break}case"inner":
{this.joinsNotNullableMap[i]=!0;break}case"full":{this.joinsNotNullableMap=Object.fromEntries(Object.entries(this.joins
NotNullableMap).map(([a])=>[a,!1])),this.joinsNotNullableMap[i]=!1;break}}return this}}leftJoin=this.createJoin("left")
;rightJoin=this.createJoin("right");innerJoin=this.createJoin("inner");fullJoin=this.createJoin("full");where(e){return
 this.config.where=e,this}returning(e){if(!e&&(e=Object.assign({},this.config.table[P.Symbol.Columns]),this.config.from
)){let r=vr(this.config.from);if(typeof r=="string"&&this.config.from&&!w(this.config.from,N)){let
n=this.getTableLikeFields(this.config.from);e[r]=n}for(let n of this.config.joins){let i=vr(n.table);if(typeof
i=="string"&&!w(n.table,N)){let a=this.getTableLikeFields(n.table);e[i]=a}}}return
this.config.returningFields=e,this.config.returning=jt(e),this}getSQL(){return
this.dialect.buildUpdateQuery(this.config)}toSQL(){let{typings:e,...r}=this.dialect.sqlToQuery(this.getSQL());return
r}_prepare(e){let
r=this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()),this.config.returning,e,!0);return
r.joinsNotNullableMap=this.joinsNotNullableMap,r}prepare(e){return this._prepare(e)}authToken;setToken(e){return
this.authToken=e,this}execute=e=>this._prepare().execute(e,this.authToken);getSelectedFields(){return
this.config.returningFields?new Proxy(this.config.returningFields,new
pe({alias:yt(this.config.table),sqlAliasedBehavior:"alias",sqlBehavior:"error"})):void 0}$dynamic(){return
this}}});var Sh=S(()=>{pE();x8();Zc();bh();xh();b8();w8()});var eu,S8=S(()=>{C();Le();eu=class t extends N{constructor(
e){super(t.buildEmbeddedCount(e.source,e.filters).queryChunks),this.params=e,this.mapWith(Number),this.session=e.sessio
n,this.sql=t.buildCount(e.source,e.filters)}sql;token;static[m]="PgCountBuilder";[Symbol.toStringTag]="PgCountBuilder";
session;static buildEmbeddedCount(e,r){return g`(select count(*) from ${e}${g.raw(" where ").if(r)}${r})`}static
buildCount(e,r){return g`select count(*) as count from ${e}${g.raw(" where ").if(r)}${r};`}setToken(e){return
this.token=e,this}then(e,r){return Promise.resolve(this.session.count(this.sql,this.token)).then(e,r)}catch(e){return
this.then(void 0,e)}finally(e){return this.then(r=>(e?.(),r),r=>{throw e?.(),r})}}});var tu,ru,_8=S(()=>{C();fr();As();
mr();tu=class{constructor(e,r,n,i,a,s,o){this.fullSchema=e,this.schema=r,this.tableNamesMap=n,this.table=i,this.tableCo
nfig=a,this.dialect=s,this.session=o}static[m]="PgRelationalQueryBuilder";findMany(e){return new ru(this.fullSchema,thi
s.schema,this.tableNamesMap,this.table,this.tableConfig,this.dialect,this.session,e||{},"many")}findFirst(e){return
new ru(this.fullSchema,this.schema,this.tableNamesMap,this.table,this.tableConfig,this.dialect,this.session,e?{...e,lim
it:1}:{limit:1},"first")}},ru=class extends Ye{constructor(e,r,n,i,a,s,o,u,c){super(),this.fullSchema=e,this.schema=r,t
his.tableNamesMap=n,this.table=i,this.tableConfig=a,this.dialect=s,this.session=o,this.config=u,this.mode=c}static[m]="
PgRelationalQuery";_prepare(e){return
he.startActiveSpan("drizzle.prepareQuery",()=>{let{query:r,builtQuery:n}=this._toSQL();return
this.session.prepareQuery(n,void 0,e,!0,(i,a)=>{let
s=i.map(o=>Vc(this.schema,this.tableConfig,o,r.selection,a));return this.mode==="first"?s[0]:s})})}prepare(e){return
this._prepare(e)}_getQuery(){return this.dialect.buildRelationalQueryWithoutPK({fullSchema:this.fullSchema,schema:this.
schema,tableNamesMap:this.tableNamesMap,table:this.table,tableConfig:this.tableConfig,queryConfig:this.config,tableAlia
s:this.tableConfig.tsName})}getSQL(){return this._getQuery().sql}_toSQL(){let
e=this._getQuery(),r=this.dialect.sqlToQuery(e.sql);return{query:e,builtQuery:r}}toSQL(){return
this._toSQL().builtQuery}authToken;setToken(e){return this.authToken=e,this}execute(){return
he.startActiveSpan("drizzle.operation",()=>this._prepare().execute(void 0,this.authToken))}}});var
nu,E8=S(()=>{C();fr();nu=class extends Ye{constructor(e,r,n,i){super(),this.execute=e,this.sql=r,this.query=n,this.mapB
atchResult=i}static[m]="PgRaw";getSQL(){return this.sql}getQuery(){return this.query}mapResult(e,r){return
r?this.mapBatchResult(e):e}_prepare(){return this}isResponseInArrayMode(){return!1}}});var Ri,iu=S(()=>{C();Sh();Br();L
e();nr();S8();_8();E8();bh();Ri=class{constructor(e,r,n){if(this.dialect=e,this.session=r,this._=n?{schema:n.schema,ful
lSchema:n.fullSchema,tableNamesMap:n.tableNamesMap,session:r}:{schema:void
0,fullSchema:{},tableNamesMap:{},session:r},this.query={},this._.schema)for(let[i,a]of
Object.entries(this._.schema))this.query[i]=new tu(n.fullSchema,this._.schema,this._.tableNamesMap,n.fullSchema[i],a,e,
r)}static[m]="PgDatabase";query;$with=(e,r)=>{let n=this;return{as:a=>(typeof a=="function"&&(a=a(new
br(n.dialect))),new Proxy(new Ii(a.getSQL(),r??("getSelectedFields"in a?a.getSelectedFields()??{}:{}),e,!0),new
pe({alias:e,sqlAliasedBehavior:"alias",sqlBehavior:"error"})))}};$count(e,r){return new
eu({source:e,filters:r,session:this.session})}with(...e){let r=this;function n(c){return new et({fields:c??void
0,session:r.session,dialect:r.dialect,withList:e})}function i(c){return new et({fields:c??void
0,session:r.session,dialect:r.dialect,withList:e,distinct:!0})}function a(c,l){return new et({fields:l??void
0,session:r.session,dialect:r.dialect,withList:e,distinct:{on:c}})}function s(c){return new
Is(c,r.session,r.dialect,e)}function o(c){return new Cs(c,r.session,r.dialect,e)}function u(c){return new fs(c,r.sessio
n,r.dialect,e)}return{select:n,selectDistinct:i,selectDistinctOn:a,update:s,insert:o,delete:u}}select(e){return new
et({fields:e??void 0,session:this.session,dialect:this.dialect})}selectDistinct(e){return new et({fields:e??void
0,session:this.session,dialect:this.dialect,distinct:!0})}selectDistinctOn(e,r){return new et({fields:r??void
0,session:this.session,dialect:this.dialect,distinct:{on:e}})}update(e){return new
Is(e,this.session,this.dialect)}insert(e){return new Cs(e,this.session,this.dialect)}delete(e){return new
fs(e,this.session,this.dialect)}refreshMaterializedView(e){return new
Yc(e,this.session,this.dialect)}authToken;execute(e){let r=typeof
e=="string"?g.raw(e):e.getSQL(),n=this.dialect.sqlToQuery(r),i=this.session.prepareQuery(n,void 0,void 0,!1);return
new nu(()=>i.execute(void 0,this.authToken),r,n,a=>i.mapResult(a,!0))}transaction(e,r){return
this.session.transaction(e,r)}}});var T8=S(()=>{});var k8,_h,A8=S(()=>{C();k8=class{constructor(e,r){this.name=e,this.v
alue=r}static[m]="PgCheckBuilder";brand;build(e){return new _h(e,this)}},_h=class{constructor(e,r){this.table=e,this.na
me=r.name,this.value=r.value}static[m]="PgCheck";name;value}});function wn(t){return new au(!1,t)}function
Ns(t){return new au(!0,t)}var au,Ps,Eh,C8=S(()=>{Le();C();Fc();au=class{constructor(e,r){this.unique=e,this.name=r}stat
ic[m]="PgIndexBuilderOn";on(...e){return new Ps(e.map(r=>{if(w(r,N))return r;r=r;let n=new
Ci(r.name,!!r.keyAsName,r.columnType,r.indexConfig);return
r.indexConfig=JSON.parse(JSON.stringify(r.defaultConfig)),n}),this.unique,!1,this.name)}onOnly(...e){return new
Ps(e.map(r=>{if(w(r,N))return r;r=r;let n=new Ci(r.name,!!r.keyAsName,r.columnType,r.indexConfig);return
r.indexConfig=r.defaultConfig,n}),this.unique,!0,this.name)}using(e,...r){return new Ps(r.map(n=>{if(w(n,N))return
n;n=n;let i=new Ci(n.name,!!n.keyAsName,n.columnType,n.indexConfig);return n.indexConfig=JSON.parse(JSON.stringify(n.de
faultConfig)),i}),this.unique,!0,this.name,e)}},Ps=class{static[m]="PgIndexBuilder";config;constructor(e,r,n,i,a="btree
"){this.config={name:i,columns:e,unique:r,only:n,method:a}}concurrently(){return
this.config.concurrently=!0,this}with(e){return this.config.with=e,this}where(e){return
this.config.where=e,this}build(e){return new
Eh(this.config,e)}},Eh=class{static[m]="PgIndex";config;constructor(e,r){this.config={...e,table:r}}}});var I8,P8=S(()=
>{C();I8=class{constructor(e,r){this.name=e,r&&(this.as=r.as,this.for=r.for,this.to=r.to,this.using=r.using,this.withCh
eck=r.withCheck)}static[m]="PgPolicy";as;for;to;using;withCheck;_linkedTable;link(e){return
this._linkedTable=e,this}}});var N8,O8=S(()=>{C();N8=class{constructor(e,r){this.name=e,r&&(this.createDb=r.createDb,th
is.createRole=r.createRole,this.inherit=r.inherit)}static[m]="PgRole";_existing;createDb;createRole;inherit;existing(){
return this._existing=!0,this}}});function q8(t,e,r){return new Th(t,e,r)}var Th,kh=S(()=>{C();Th=class{constructor(e,r
,n){this.seqName=e,this.seqOptions=r,this.schema=n}static[m]="PgSequence"}});var
Ah,Ch=S(()=>{Ah=Symbol.for("drizzle:PgViewConfig")});function j8(t,e,r){return e?new Ph(t,e,r):new Ih(t,r)}function
D8(t,e,r){return e?new Oh(t,e,r):new Nh(t,r)}var su,Ih,Ph,ou,Nh,Oh,Os,R8,qs,qh=S(()=>{C();Br();de();Zc();bn();Gc();Ch()
;su=class{constructor(e,r){this.name=e,this.schema=r}static[m]="PgDefaultViewBuilderCore";config={};with(e){return
this.config.with=e,this}},Ih=class extends su{static[m]="PgViewBuilder";as(e){typeof e=="function"&&(e=e(new br));let
r=new pe({alias:this.name,sqlBehavior:"error",sqlAliasedBehavior:"alias",replaceOriginalName:!0}),n=new
Proxy(e.getSelectedFields(),r);return new Proxy(new Os({pgConfig:this.config,config:{name:this.name,schema:this.schema,
selectedFields:n,query:e.getSQL().inlineParams()}}),r)}},Ph=class extends
su{static[m]="PgManualViewBuilder";columns;constructor(e,r,n){super(e,n),this.columns=xn($r(e,r))}existing(){return
new Proxy(new Os({pgConfig:void 0,config:{name:this.name,schema:this.schema,selectedFields:this.columns,query:void
0}}),new pe({alias:this.name,sqlBehavior:"error",sqlAliasedBehavior:"alias",replaceOriginalName:!0}))}as(e){return new
Proxy(new Os({pgConfig:this.config,config:{name:this.name,schema:this.schema,selectedFields:this.columns,query:e.inline
Params()}}),new pe({alias:this.name,sqlBehavior:"error",sqlAliasedBehavior:"alias",replaceOriginalName:!0}))}},ou=class
{constructor(e,r){this.name=e,this.schema=r}static[m]="PgMaterializedViewBuilderCore";config={};using(e){return
this.config.using=e,this}with(e){return this.config.with=e,this}tablespace(e){return
this.config.tablespace=e,this}withNoData(){return this.config.withNoData=!0,this}},Nh=class extends
ou{static[m]="PgMaterializedViewBuilder";as(e){typeof e=="function"&&(e=e(new br));let r=new
pe({alias:this.name,sqlBehavior:"error",sqlAliasedBehavior:"alias",replaceOriginalName:!0}),n=new
Proxy(e.getSelectedFields(),r);return new Proxy(new qs({pgConfig:{with:this.config.with,using:this.config.using,tablesp
ace:this.config.tablespace,withNoData:this.config.withNoData},config:{name:this.name,schema:this.schema,selectedFields:
n,query:e.getSQL().inlineParams()}}),r)}},Oh=class extends ou{static[m]="PgManualMaterializedViewBuilder";columns;const
ructor(e,r,n){super(e,n),this.columns=xn($r(e,r))}existing(){return new Proxy(new qs({pgConfig:{tablespace:this.config.
tablespace,using:this.config.using,with:this.config.with,withNoData:this.config.withNoData},config:{name:this.name,sche
ma:this.schema,selectedFields:this.columns,query:void 0}}),new
pe({alias:this.name,sqlBehavior:"error",sqlAliasedBehavior:"alias",replaceOriginalName:!0}))}as(e){return new
Proxy(new qs({pgConfig:{tablespace:this.config.tablespace,using:this.config.using,with:this.config.with,withNoData:this
.config.withNoData},config:{name:this.name,schema:this.schema,selectedFields:this.columns,query:e.inlineParams()}}),new
 pe({alias:this.name,sqlBehavior:"error",sqlAliasedBehavior:"alias",replaceOriginalName:!0}))}},Os=class extends xr{sta
tic[m]="PgView";[Ah];constructor({pgConfig:e,config:r}){super(r),e&&(this[Ah]={with:e.with})}},R8=Symbol.for("drizzle:P
gMaterializedViewConfig"),qs=class extends xr{static[m]="PgMaterializedView";[R8];constructor({pgConfig:e,config:r}){su
per(r),this[R8]={with:e?.with,using:e?.using,tablespace:e?.tablespace,withNoData:e?.withNoData}}}});var L8,M8=S(()=>{C(
);Le();Pc();kh();bn();qh();L8=class{constructor(e){this.schemaName=e}static[m]="PgSchema";table=(e,r,n)=>mh(e,r,n,this.
schemaName);view=(e,r)=>j8(e,r,this.schemaName);materializedView=(e,r)=>D8(e,r,this.schemaName);enum=(e,r)=>W_(e,r,this
.schemaName);sequence=(e,r)=>q8(e,r,this.schemaName);getSQL(){return new
N([g.identifier(this.schemaName)])}shouldOmitSQLParens(){return!0}}});var
cu,uu,lu,Rh=S(()=>{C();Lc();Hc();mr();iu();cu=class{constructor(e){this.query=e}authToken;getQuery(){return
this.query}mapResult(e,r){return e}setToken(e){return this.authToken=e,this}static[m]="PgPreparedQuery";joinsNotNullabl
eMap},uu=class{constructor(e){this.dialect=e}static[m]="PgSession";execute(e,r){return he.startActiveSpan("drizzle.oper
ation",()=>he.startActiveSpan("drizzle.prepareQuery",()=>this.prepareQuery(this.dialect.sqlToQuery(e),void 0,void
0,!1)).setToken(r).execute(void 0,r))}all(e){return this.prepareQuery(this.dialect.sqlToQuery(e),void 0,void
0,!1).all()}async count(e,r){let n=await this.execute(e,r);return Number(n[0].count)}},lu=class extends
Ri{constructor(e,r,n,i=0){super(e,r,n),this.schema=n,this.nestedIndex=i}static[m]="PgTransaction";rollback(){throw new
Dc}getTransactionConfigSQL(e){let r=[];return e.isolationLevel&&r.push(`isolation level
${e.isolationLevel}`),e.accessMode&&r.push(e.accessMode),typeof
e.deferrable=="boolean"&&r.push(e.deferrable?"deferrable":"not deferrable"),g.raw(r.join("
"))}setTransaction(e){return this.session.execute(g`set transaction ${this.getTransactionConfigSQL(e)}`)}}});var
F8=S(()=>{});var B8=S(()=>{});var $8=S(()=>{nf()});var jh=S(()=>{T8();A8();Fc();iu();Wc();Xd();C8();P8();gh();Sh();O8()
;M8();kh();Rh();F8();bn();tf();B8();$8();Ch();qh()});var
z8,sr,Dh,pu,Lh,Mh=S(()=>{Sc();C();Tc();jh();Rh();Le();mr();de();({Pool:z8,types:sr}=Fr),Dh=class extends cu{constructor
(e,r,n,i,a,s,o,u){super({sql:r,params:n}),this.client=e,this.params=n,this.logger=i,this.fields=a,this._isResponseInArr
ayMode=o,this.customResultMapper=u,this.rawQueryConfig={name:s,text:r,types:{getTypeParser:(c,l)=>c===sr.builtins.TIMES
TAMPTZ?p=>p:c===sr.builtins.TIMESTAMP?p=>p:c===sr.builtins.DATE?p=>p:c===sr.builtins.INTERVAL?p=>p:sr.getTypeParser(c,l
)}},this.queryConfig={name:s,text:r,rowMode:"array",types:{getTypeParser:(c,l)=>c===sr.builtins.TIMESTAMPTZ?p=>p:c===sr
.builtins.TIMESTAMP?p=>p:c===sr.builtins.DATE?p=>p:c===sr.builtins.INTERVAL?p=>p:sr.getTypeParser(c,l)}}}static[m]="Nod
ePgPreparedQuery";rawQueryConfig;queryConfig;async execute(e={}){return
he.startActiveSpan("drizzle.execute",async()=>{let r=vf(this.params,e);this.logger.logQuery(this.rawQueryConfig.text,r)
;let{fields:n,rawQueryConfig:i,client:a,queryConfig:s,joinsNotNullableMap:o,customResultMapper:u}=this;if(!n&&!u)return
 he.startActiveSpan("drizzle.driver.execute",async l=>(l?.setAttributes({"drizzle.query.name":i.name,"drizzle.query.tex
t":i.text,"drizzle.query.params":JSON.stringify(r)}),a.query(i,r)));let c=await he.startActiveSpan("drizzle.driver.exec
ute",l=>(l?.setAttributes({"drizzle.query.name":s.name,"drizzle.query.text":s.text,"drizzle.query.params":JSON.stringif
y(r)}),a.query(s,r)));return
he.startActiveSpan("drizzle.mapResponse",()=>u?u(c.rows):c.rows.map(l=>oE(n,l,o)))})}all(e={}){return
he.startActiveSpan("drizzle.execute",()=>{let r=vf(this.params,e);return this.logger.logQuery(this.rawQueryConfig.text,
r),he.startActiveSpan("drizzle.driver.execute",n=>(n?.setAttributes({"drizzle.query.name":this.rawQueryConfig.name,"dri
zzle.query.text":this.rawQueryConfig.text,"drizzle.query.params":JSON.stringify(r)}),this.client.query(this.rawQueryCon
fig,r).then(i=>i.rows)))})}isResponseInArrayMode(){return this._isResponseInArrayMode}},pu=class t extends
uu{constructor(e,r,n,i={}){super(r),this.client=e,this.schema=n,this.options=i,this.logger=i.logger??new
Ec}static[m]="NodePgSession";logger;prepareQuery(e,r,n,i,a){return new
Dh(this.client,e.sql,e.params,this.logger,r,n,i,a)}async transaction(e,r){let n=this.client instanceof z8?new t(await
this.client.connect(),this.dialect,this.schema,this.options):this,i=new Lh(this.dialect,n,this.schema);await
i.execute(g`begin${r?g` ${i.getTransactionConfigSQL(r)}`:void 0}`);try{let a=await e(i);return await
i.execute(g`commit`),a}catch(a){throw await i.execute(g`rollback`),a}finally{this.client instanceof
z8&&n.client.release()}}async count(e){let r=await this.execute(e);return Number(r.rows[0].count)}},Lh=class t extends
lu{static[m]="NodePgTransaction";async transaction(e){let r=`sp${this.nestedIndex+1}`,n=new
t(this.dialect,this.session,this.schema,this.nestedIndex+1);await n.execute(g.raw(`savepoint ${r}`));try{let i=await
e(n);return await n.execute(g.raw(`release savepoint ${r}`)),i}catch(i){throw await n.execute(g.raw(`rollback to
savepoint ${r}`)),i}}}});function Rs(t,e={}){let r=new Qr({casing:e.casing}),n;e.logger===!0?n=new
_c:e.logger!==!1&&(n=e.logger);let i;if(e.schema){let
u=d8(e.schema,m8);i={fullSchema:e.schema,schema:u.tables,tableNamesMap:u.tableNamesMap}}let s=new
Fh(t,r,{logger:n}).createSession(i),o=new Bh(r,s,i);return o.$client=t,o}function du(...t){if(typeof
t[0]=="string"){let e=new Fr.Pool({connectionString:t[0]});return
Rs(e,t[1])}if(lE(t[0])){let{connection:e,client:r,...n}=t[0];if(r)return Rs(r,n);let i=typeof e=="string"?new
Fr.Pool({connectionString:e}):new Fr.Pool(e);return Rs(i,n)}return Rs(t[0],t[1])}var Fh,Bh,U8=S(()=>{Sc();C();Tc();iu()
;Wc();As();de();Mh();Fh=class{constructor(e,r,n={}){this.client=e,this.dialect=r,this.options=n}static[m]="NodePgDriver
";createSession(e){return new pu(this.client,this.dialect,e,{logger:this.options.logger})}},Bh=class extends
Ri{static[m]="NodePgDatabase"};(t=>{function e(r){return Rs({},r)}t.mock=e})(du||(du={}))});var
Q8=S(()=>{U8();Mh()});var Z,$h,O,or,js=S(()=>{(function(t){t.assertEqual=i=>{};function e(i){}t.assertIs=e;function
r(i){throw new Error}t.assertNever=r,t.arrayToEnum=i=>{let a={};for(let s of i)a[s]=s;return
a},t.getValidEnumValues=i=>{let a=t.objectKeys(i).filter(o=>typeof i[i[o]]!="number"),s={};for(let o of
a)s[o]=i[o];return t.objectValues(s)},t.objectValues=i=>t.objectKeys(i).map(function(a){return
i[a]}),t.objectKeys=typeof Object.keys=="function"?i=>Object.keys(i):i=>{let a=[];for(let s in
i)Object.prototype.hasOwnProperty.call(i,s)&&a.push(s);return a},t.find=(i,a)=>{for(let s of i)if(a(s))return
s},t.isInteger=typeof Number.isInteger=="function"?i=>Number.isInteger(i):i=>typeof
i=="number"&&Number.isFinite(i)&&Math.floor(i)===i;function n(i,a=" | "){return i.map(s=>typeof
s=="string"?`'${s}'`:s).join(a)}t.joinValues=n,t.jsonStringifyReplacer=(i,a)=>typeof a=="bigint"?a.toString():a})(Z||(Z
={}));(function(t){t.mergeShapes=(e,r)=>({...e,...r})})($h||($h={}));O=Z.arrayToEnum(["string","nan","number","integer"
,"float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","
never","map","set"]),or=t=>{switch(typeof t){case"undefined":return O.undefined;case"string":return
O.string;case"number":return Number.isNaN(t)?O.nan:O.number;case"boolean":return O.boolean;case"function":return
O.function;case"bigint":return O.bigint;case"symbol":return O.symbol;case"object":return
Array.isArray(t)?O.array:t===null?O.null:t.then&&typeof t.then=="function"&&t.catch&&typeof
t.catch=="function"?O.promise:typeof Map<"u"&&t instanceof Map?O.map:typeof Set<"u"&&t instanceof Set?O.set:typeof
Date<"u"&&t instanceof Date?O.date:O.object;default:return O.unknown}}});var T,Ij,St,fu=S(()=>{js();T=Z.arrayToEnum(["i
nvalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognize
d_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_inters
ection_types","not_multiple_of","not_finite"]),Ij=t=>JSON.stringify(t,null,2).replace(/"([^"]+)":/g,"$1:"),St=class t
extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=n=>{this.issues=[...t
his.issues,n]},this.addIssues=(n=[])=>{this.issues=[...this.issues,...n]};let r=new.target.prototype;Object.setPrototyp
eOf?Object.setPrototypeOf(this,r):this.__proto__=r,this.name="ZodError",this.issues=e}format(e){let
r=e||function(a){return a.message},n={_errors:[]},i=a=>{for(let s of
a.issues)if(s.code==="invalid_union")s.unionErrors.map(i);else
if(s.code==="invalid_return_type")i(s.returnTypeError);else if(s.code==="invalid_arguments")i(s.argumentsError);else
if(s.path.length===0)n._errors.push(r(s));else{let o=n,u=0;for(;u<s.path.length;){let c=s.path[u];u===s.path.length-1?(
o[c]=o[c]||{_errors:[]},o[c]._errors.push(r(s))):o[c]=o[c]||{_errors:[]},o=o[c],u++}}};return i(this),n}static
assert(e){if(!(e instanceof t))throw new Error(`Not a ZodError: ${e}`)}toString(){return this.message}get
message(){return JSON.stringify(this.issues,Z.jsonStringifyReplacer,2)}get isEmpty(){return
this.issues.length===0}flatten(e=r=>r.message){let r={},n=[];for(let i of this.issues)if(i.path.length>0){let
a=i.path[0];r[a]=r[a]||[],r[a].push(e(i))}else n.push(e(i));return{formErrors:n,fieldErrors:r}}get formErrors(){return
this.flatten()}};St.create=t=>new St(t)});var Pj,wr,zh=S(()=>{fu();js();Pj=(t,e)=>{let r;switch(t.code){case
T.invalid_type:t.received===O.undefined?r="Required":r=`Expected ${t.expected}, received ${t.received}`;break;case
T.invalid_literal:r=`Invalid literal value, expected ${JSON.stringify(t.expected,Z.jsonStringifyReplacer)}`;break;case
T.unrecognized_keys:r=`Unrecognized key(s) in object: ${Z.joinValues(t.keys,", ")}`;break;case
T.invalid_union:r="Invalid input";break;case T.invalid_union_discriminator:r=`Invalid discriminator value. Expected
${Z.joinValues(t.options)}`;break;case T.invalid_enum_value:r=`Invalid enum value. Expected
${Z.joinValues(t.options)}, received '${t.received}'`;break;case T.invalid_arguments:r="Invalid function
arguments";break;case T.invalid_return_type:r="Invalid function return type";break;case T.invalid_date:r="Invalid
date";break;case T.invalid_string:typeof t.validation=="object"?"includes"in t.validation?(r=`Invalid input: must
include "${t.validation.includes}"`,typeof t.validation.position=="number"&&(r=`${r} at one or more positions greater
than or equal to ${t.validation.position}`)):"startsWith"in t.validation?r=`Invalid input: must start with
"${t.validation.startsWith}"`:"endsWith"in t.validation?r=`Invalid input: must end with
"${t.validation.endsWith}"`:Z.assertNever(t.validation):t.validation!=="regex"?r=`Invalid
${t.validation}`:r="Invalid";break;case T.too_small:t.type==="array"?r=`Array must contain
${t.exact?"exactly":t.inclusive?"at least":"more than"} ${t.minimum} element(s)`:t.type==="string"?r=`String must
contain ${t.exact?"exactly":t.inclusive?"at least":"over"} ${t.minimum} character(s)`:t.type==="number"?r=`Number must
be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than
"}${t.minimum}`:t.type==="bigint"?r=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal
to ":"greater than "}${t.minimum}`:t.type==="date"?r=`Date must be ${t.exact?"exactly equal to ":t.inclusive?"greater
than or equal to ":"greater than "}${new Date(Number(t.minimum))}`:r="Invalid input";break;case
T.too_big:t.type==="array"?r=`Array must contain ${t.exact?"exactly":t.inclusive?"at most":"less than"} ${t.maximum}
element(s)`:t.type==="string"?r=`String must contain ${t.exact?"exactly":t.inclusive?"at most":"under"} ${t.maximum}
character(s)`:t.type==="number"?r=`Number must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"}
${t.maximum}`:t.type==="bigint"?r=`BigInt must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"}
${t.maximum}`:t.type==="date"?r=`Date must be ${t.exact?"exactly":t.inclusive?"smaller than or equal to":"smaller
than"} ${new Date(Number(t.maximum))}`:r="Invalid input";break;case T.custom:r="Invalid input";break;case
T.invalid_intersection_types:r="Intersection results could not be merged";break;case T.not_multiple_of:r=`Number must
be a multiple of ${t.multipleOf}`;break;case T.not_finite:r="Number must be
finite";break;default:r=e.defaultError,Z.assertNever(t)}return{message:r}},wr=Pj});function Nj(t){V8=t}function
ji(){return V8}var V8,mu=S(()=>{zh();V8=wr});function I(t,e){let
r=ji(),n=Ds({issueData:e,data:t.data,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,r,r===wr?void
0:wr].filter(i=>!!i)});t.common.issues.push(n)}var Ds,Oj,Ze,B,Sn,tt,hu,gu,Vr,Di,Uh=S(()=>{mu();zh();Ds=t=>{let{data:e,p
ath:r,errorMaps:n,issueData:i}=t,a=[...r,...i.path||[]],s={...i,path:a};if(i.message!==void
0)return{...i,path:a,message:i.message};let o="",u=n.filter(c=>!!c).slice().reverse();for(let c of
u)o=c(s,{data:e,defaultError:o}).message;return{...i,path:a,message:o}},Oj=[];Ze=class t{constructor(){this.value="vali
d"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static
mergeArray(e,r){let n=[];for(let i of r){if(i.status==="aborted")return
B;i.status==="dirty"&&e.dirty(),n.push(i.value)}return{status:e.value,value:n}}static async mergeObjectAsync(e,r){let
n=[];for(let i of r){let a=await i.key,s=await i.value;n.push({key:a,value:s})}return t.mergeObjectSync(e,n)}static
mergeObjectSync(e,r){let n={};for(let i of
r){let{key:a,value:s}=i;if(a.status==="aborted"||s.status==="aborted")return
B;a.status==="dirty"&&e.dirty(),s.status==="dirty"&&e.dirty(),a.value!=="__proto__"&&(typeof s.value<"u"||i.alwaysSet)&
&(n[a.value]=s.value)}return{status:e.value,value:n}}},B=Object.freeze({status:"aborted"}),Sn=t=>({status:"dirty",value
:t}),tt=t=>({status:"valid",value:t}),hu=t=>t.status==="aborted",gu=t=>t.status==="dirty",Vr=t=>t.status==="valid",Di=t
=>typeof Promise<"u"&&t instanceof Promise});var H8=S(()=>{});var D,G8=S(()=>{(function(t){t.errToObj=e=>typeof
e=="string"?{message:e}:e||{},t.toString=e=>typeof e=="string"?e:e?.message})(D||(D={}))});function
H(t){if(!t)return{};let{errorMap:e,invalid_type_error:r,required_error:n,description:i}=t;if(e&&(r||n))throw new
Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return
e?{errorMap:e,description:i}:{errorMap:(s,o)=>{let{message:u}=t;return
s.code==="invalid_enum_value"?{message:u??o.defaultError}:typeof o.data>"u"?{message:u??n??o.defaultError}:s.code!=="in
valid_type"?{message:o.defaultError}:{message:u??r??o.defaultError}},description:i}}function Z8(t){let
e="[0-5]\\d";t.precision?e=`${e}\\.\\d{${t.precision}}`:t.precision==null&&(e=`${e}(\\.\\d+)?`);let
r=t.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${e})${r}`}function Kj(t){return new
RegExp(`^${Z8(t)}$`)}function J8(t){let e=`${X8}T${Z8(t)}`,r=[];return
r.push(t.local?"Z?":"Z"),t.offset&&r.push("([+-]\\d{2}:?\\d{2})"),e=`${e}(${r.join("|")})`,new
RegExp(`^${e}$`)}function Xj(t,e){return!!((e==="v4"||!e)&&zj.test(t)||(e==="v6"||!e)&&Qj.test(t))}function
Zj(t,e){if(!Mj.test(t))return!1;try{let[r]=t.split(".");if(!r)return!1;let
n=r.replace(/-/g,"+").replace(/_/g,"/").padEnd(r.length+(4-r.length%4)%4,"="),i=JSON.parse(atob(n));return!(typeof
i!="object"||i===null||"typ"in i&&i?.typ!=="JWT"||!i.alg||e&&i.alg!==e)}catch{return!1}}function
Jj(t,e){return!!((e==="v4"||!e)&&Uj.test(t)||(e==="v6"||!e)&&Vj.test(t))}function Yj(t,e){let r=(t.toString().split("."
)[1]||"").length,n=(e.toString().split(".")[1]||"").length,i=r>n?r:n,a=Number.parseInt(t.toFixed(i).replace(".","")),s=
Number.parseInt(e.toFixed(i).replace(".",""));return a%s/10**i}function Li(t){if(t instanceof _t){let e={};for(let r
in t.shape){let n=t.shape[r];e[r]=Lt.create(Li(n))}return new _t({...t._def,shape:()=>e})}else return t instanceof
Er?new Er({...t._def,type:Li(t.element)}):t instanceof Lt?Lt.create(Li(t.unwrap())):t instanceof
ur?ur.create(Li(t.unwrap())):t instanceof cr?cr.create(t.items.map(e=>Li(e))):t}function Vh(t,e){let
r=or(t),n=or(e);if(t===e)return{valid:!0,data:t};if(r===O.object&&n===O.object){let
i=Z.objectKeys(e),a=Z.objectKeys(t).filter(o=>i.indexOf(o)!==-1),s={...t,...e};for(let o of a){let
u=Vh(t[o],e[o]);if(!u.valid)return{valid:!1};s[o]=u.data}return{valid:!0,data:s}}else
if(r===O.array&&n===O.array){if(t.length!==e.length)return{valid:!1};let i=[];for(let a=0;a<t.length;a++){let
s=t[a],o=e[a],u=Vh(s,o);if(!u.valid)return{valid:!1};i.push(u.data)}return{valid:!0,data:i}}else return
r===O.date&&n===O.date&&+t==+e?{valid:!0,data:t}:{valid:!1}}function Y8(t,e){return new
qn({values:t,typeName:$.ZodEnum,...H(e)})}function K8(t,e){let r=typeof t=="function"?t(e):typeof
t=="string"?{message:t}:t;return typeof r=="string"?{message:r}:r}function e4(t,e={},r){return
t?Gr.create().superRefine((n,i)=>{let a=t(n);if(a instanceof Promise)return a.then(s=>{if(!s){let
o=K8(e,n),u=o.fatal??r??!0;i.addIssue({code:"custom",...o,fatal:u})}});if(!a){let
s=K8(e,n),o=s.fatal??r??!0;i.addIssue({code:"custom",...s,fatal:o})}}):Gr.create()}var Mt,W8,G,qj,Rj,jj,Dj,Lj,Mj,Fj,Bj,
$j,Qh,zj,Uj,Qj,Vj,Hj,Gj,X8,Wj,Hr,_n,En,Tn,kn,Mi,An,Cn,Gr,_r,Vt,Fi,Er,_t,In,Sr,vu,Pn,cr,yu,Bi,$i,xu,Nn,On,qn,Rn,Wr,Ft,Lt
,ur,jn,Dn,zi,eD,Ls,Ms,Ln,tD,$,rD,t4,r4,nD,iD,n4,aD,sD,oD,cD,uD,lD,pD,dD,fD,mD,hD,gD,vD,yD,xD,bD,wD,SD,_D,ED,TD,kD,AD,CD
,ID,PD,ND,OD,qD,RD,jD,DD,LD,MD,i4=S(()=>{fu();mu();G8();Uh();js();Mt=class{constructor(e,r,n,i){this._cachedPath=[],thi
s.parent=e,this.data=r,this._path=n,this._key=i}get path(){return this._cachedPath.length||(Array.isArray(this._key)?th
is._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},W8=(
t,e)=>{if(Vr(e))return{success:!0,data:e.value};if(!t.common.issues.length)throw new Error("Validation failed but no
issues detected.");return{success:!1,get error(){if(this._error)return this._error;let r=new
St(t.common.issues);return this._error=r,this._error}}};G=class{get description(){return
this._def.description}_getType(e){return or(e.data)}_getOrReturnCtx(e,r){return r||{common:e.parent.common,data:e.data,
parsedType:or(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{stat
us:new Ze,ctx:{common:e.parent.common,data:e.data,parsedType:or(e.data),schemaErrorMap:this._def.errorMap,path:e.path,p
arent:e.parent}}}_parseSync(e){let r=this._parse(e);if(Di(r))throw new Error("Synchronous parse encountered
promise.");return r}_parseAsync(e){let r=this._parse(e);return Promise.resolve(r)}parse(e,r){let
n=this.safeParse(e,r);if(n.success)return n.data;throw n.error}safeParse(e,r){let n={common:{issues:[],async:r?.async??
!1,contextualErrorMap:r?.errorMap},path:r?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:or(
e)},i=this._parseSync({data:e,path:n.path,parent:n});return W8(n,i)}"~validate"(e){let r={common:{issues:[],async:!!thi
s["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:or(e)};if(!this["~standar
d"].async)try{let n=this._parseSync({data:e,path:[],parent:r});return Vr(n)?{value:n.value}:{issues:r.common.issues}}ca
tch(n){n?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),r.common={issues:[],async:!0}}r
eturn this._parseAsync({data:e,path:[],parent:r}).then(n=>Vr(n)?{value:n.value}:{issues:r.common.issues})}async
parseAsync(e,r){let n=await this.safeParseAsync(e,r);if(n.success)return n.data;throw n.error}async
safeParseAsync(e,r){let n={common:{issues:[],contextualErrorMap:r?.errorMap,async:!0},path:r?.path||[],schemaErrorMap:t
his._def.errorMap,parent:null,data:e,parsedType:or(e)},i=this._parse({data:e,path:n.path,parent:n}),a=await(Di(i)?i:Pro
mise.resolve(i));return W8(n,a)}refine(e,r){let n=i=>typeof r=="string"||typeof r>"u"?{message:r}:typeof
r=="function"?r(i):r;return this._refinement((i,a)=>{let s=e(i),o=()=>a.addIssue({code:T.custom,...n(i)});return
typeof Promise<"u"&&s instanceof Promise?s.then(u=>u?!0:(o(),!1)):s?!0:(o(),!1)})}refinement(e,r){return
this._refinement((n,i)=>e(n)?!0:(i.addIssue(typeof r=="function"?r(n,i):r),!1))}_refinement(e){return new
Ft({schema:this,typeName:$.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(
e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safePar
se.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=th
is.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.s
uperRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.n
ullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this
.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.de
fault.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this)
,this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind
(this),this["~standard"]={version:1,vendor:"zod",validate:r=>this["~validate"](r)}}optional(){return
Lt.create(this,this._def)}nullable(){return ur.create(this,this._def)}nullish(){return
this.nullable().optional()}array(){return Er.create(this)}promise(){return Wr.create(this,this._def)}or(e){return
In.create([this,e],this._def)}and(e){return Pn.create(this,e,this._def)}transform(e){return new
Ft({...H(this._def),schema:this,typeName:$.ZodEffects,effect:{type:"transform",transform:e}})}default(e){let r=typeof
e=="function"?e:()=>e;return new
jn({...H(this._def),innerType:this,defaultValue:r,typeName:$.ZodDefault})}brand(){return new
Ls({typeName:$.ZodBranded,type:this,...H(this._def)})}catch(e){let r=typeof e=="function"?e:()=>e;return new
Dn({...H(this._def),innerType:this,catchValue:r,typeName:$.ZodCatch})}describe(e){let r=this.constructor;return new
r({...this._def,description:e})}pipe(e){return Ms.create(this,e)}readonly(){return Ln.create(this)}isOptional(){return
this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},qj=/^c[^\s-]{8,}$/i,Rj=/^[0-9a-z]+$/,
jj=/^[0-9A-HJKMNP-TV-Z]{26}$/i,Dj=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}
$/i,Lj=/^[a-z0-9_-]{21}$/i,Mj=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,Fj=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-
+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[
-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+
]?\d+(?:[.,]\d+)?S)?)??$/,Bj=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,$j="^
(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",zj=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}
(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Uj=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){
3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,Qj=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]
{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1
,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}
:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-
fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|
(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0
-4]|1{0,1}[0-9]){0,1}[0-9]))$/,Vj=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,
4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4})
{1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4
}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4
}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,
4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-
9]|[1-9]?[0-9])$/,Hj=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,Gj=/^([0-9a-zA-Z-_]{4})*(([0-9a
-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,X8="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[1357
9][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8
])))",Wj=new RegExp(`^${X8}$`);Hr=class t extends
G{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==O.string){let
a=this._getOrReturnCtx(e);return I(a,{code:T.invalid_type,expected:O.string,received:a.parsedType}),B}let n=new
Ze,i;for(let a of this._def.checks)if(a.kind==="min")e.data.length<a.value&&(i=this._getOrReturnCtx(e,i),I(i,{code:T.to
o_small,minimum:a.value,type:"string",inclusive:!0,exact:!1,message:a.message}),n.dirty());else if(a.kind==="max")e.dat
a.length>a.value&&(i=this._getOrReturnCtx(e,i),I(i,{code:T.too_big,maximum:a.value,type:"string",inclusive:!0,exact:!1,
message:a.message}),n.dirty());else if(a.kind==="length"){let s=e.data.length>a.value,o=e.data.length<a.value;(s||o)&&(
i=this._getOrReturnCtx(e,i),s?I(i,{code:T.too_big,maximum:a.value,type:"string",inclusive:!0,exact:!0,message:a.message
}):o&&I(i,{code:T.too_small,minimum:a.value,type:"string",inclusive:!0,exact:!0,message:a.message}),n.dirty())}else if(
a.kind==="email")Bj.test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"email",code:T.invalid_string,message:a.
message}),n.dirty());else if(a.kind==="emoji")Qh||(Qh=new RegExp($j,"u")),Qh.test(e.data)||(i=this._getOrReturnCtx(e,i)
,I(i,{validation:"emoji",code:T.invalid_string,message:a.message}),n.dirty());else if(a.kind==="uuid")Dj.test(e.data)||
(i=this._getOrReturnCtx(e,i),I(i,{validation:"uuid",code:T.invalid_string,message:a.message}),n.dirty());else if(a.kind
==="nanoid")Lj.test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"nanoid",code:T.invalid_string,message:a.mess
age}),n.dirty());else if(a.kind==="cuid")qj.test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"cuid",code:T.in
valid_string,message:a.message}),n.dirty());else if(a.kind==="cuid2")Rj.test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,
{validation:"cuid2",code:T.invalid_string,message:a.message}),n.dirty());else if(a.kind==="ulid")jj.test(e.data)||(i=th
is._getOrReturnCtx(e,i),I(i,{validation:"ulid",code:T.invalid_string,message:a.message}),n.dirty());else
if(a.kind==="url")try{new URL(e.data)}catch{i=this._getOrReturnCtx(e,i),I(i,{validation:"url",code:T.invalid_string,mes
sage:a.message}),n.dirty()}else a.kind==="regex"?(a.regex.lastIndex=0,a.regex.test(e.data)||(i=this._getOrReturnCtx(e,i
),I(i,{validation:"regex",code:T.invalid_string,message:a.message}),n.dirty())):a.kind==="trim"?e.data=e.data.trim():a.
kind==="includes"?e.data.includes(a.value,a.position)||(i=this._getOrReturnCtx(e,i),I(i,{code:T.invalid_string,validati
on:{includes:a.value,position:a.position},message:a.message}),n.dirty()):a.kind==="toLowerCase"?e.data=e.data.toLowerCa
se():a.kind==="toUpperCase"?e.data=e.data.toUpperCase():a.kind==="startsWith"?e.data.startsWith(a.value)||(i=this._getO
rReturnCtx(e,i),I(i,{code:T.invalid_string,validation:{startsWith:a.value},message:a.message}),n.dirty()):a.kind==="end
sWith"?e.data.endsWith(a.value)||(i=this._getOrReturnCtx(e,i),I(i,{code:T.invalid_string,validation:{endsWith:a.value},
message:a.message}),n.dirty()):a.kind==="datetime"?J8(a).test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,{code:T.invalid
_string,validation:"datetime",message:a.message}),n.dirty()):a.kind==="date"?Wj.test(e.data)||(i=this._getOrReturnCtx(e
,i),I(i,{code:T.invalid_string,validation:"date",message:a.message}),n.dirty()):a.kind==="time"?Kj(a).test(e.data)||(i=
this._getOrReturnCtx(e,i),I(i,{code:T.invalid_string,validation:"time",message:a.message}),n.dirty()):a.kind==="duratio
n"?Fj.test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"duration",code:T.invalid_string,message:a.message}),n
.dirty()):a.kind==="ip"?Xj(e.data,a.version)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"ip",code:T.invalid_string,m
essage:a.message}),n.dirty()):a.kind==="jwt"?Zj(e.data,a.alg)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"jwt",code:
T.invalid_string,message:a.message}),n.dirty()):a.kind==="cidr"?Jj(e.data,a.version)||(i=this._getOrReturnCtx(e,i),I(i,
{validation:"cidr",code:T.invalid_string,message:a.message}),n.dirty()):a.kind==="base64"?Hj.test(e.data)||(i=this._get
OrReturnCtx(e,i),I(i,{validation:"base64",code:T.invalid_string,message:a.message}),n.dirty()):a.kind==="base64url"?Gj.
test(e.data)||(i=this._getOrReturnCtx(e,i),I(i,{validation:"base64url",code:T.invalid_string,message:a.message}),n.dirt
y()):Z.assertNever(a);return{status:n.value,value:e.data}}_regex(e,r,n){return
this.refinement(i=>e.test(i),{validation:r,code:T.invalid_string,...D.errToObj(n)})}_addCheck(e){return new
t({...this._def,checks:[...this._def.checks,e]})}email(e){return
this._addCheck({kind:"email",...D.errToObj(e)})}url(e){return
this._addCheck({kind:"url",...D.errToObj(e)})}emoji(e){return
this._addCheck({kind:"emoji",...D.errToObj(e)})}uuid(e){return
this._addCheck({kind:"uuid",...D.errToObj(e)})}nanoid(e){return
this._addCheck({kind:"nanoid",...D.errToObj(e)})}cuid(e){return
this._addCheck({kind:"cuid",...D.errToObj(e)})}cuid2(e){return
this._addCheck({kind:"cuid2",...D.errToObj(e)})}ulid(e){return
this._addCheck({kind:"ulid",...D.errToObj(e)})}base64(e){return
this._addCheck({kind:"base64",...D.errToObj(e)})}base64url(e){return
this._addCheck({kind:"base64url",...D.errToObj(e)})}jwt(e){return
this._addCheck({kind:"jwt",...D.errToObj(e)})}ip(e){return this._addCheck({kind:"ip",...D.errToObj(e)})}cidr(e){return
this._addCheck({kind:"cidr",...D.errToObj(e)})}datetime(e){return typeof e=="string"?this._addCheck({kind:"datetime",pr
ecision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof
e?.precision>"u"?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...D.errToObj(e?.message)})}date(e){return
this._addCheck({kind:"date",message:e})}time(e){return typeof
e=="string"?this._addCheck({kind:"time",precision:null,message:e}):this._addCheck({kind:"time",precision:typeof
e?.precision>"u"?null:e?.precision,...D.errToObj(e?.message)})}duration(e){return
this._addCheck({kind:"duration",...D.errToObj(e)})}regex(e,r){return
this._addCheck({kind:"regex",regex:e,...D.errToObj(r)})}includes(e,r){return
this._addCheck({kind:"includes",value:e,position:r?.position,...D.errToObj(r?.message)})}startsWith(e,r){return
this._addCheck({kind:"startsWith",value:e,...D.errToObj(r)})}endsWith(e,r){return
this._addCheck({kind:"endsWith",value:e,...D.errToObj(r)})}min(e,r){return
this._addCheck({kind:"min",value:e,...D.errToObj(r)})}max(e,r){return
this._addCheck({kind:"max",value:e,...D.errToObj(r)})}length(e,r){return
this._addCheck({kind:"length",value:e,...D.errToObj(r)})}nonempty(e){return this.min(1,D.errToObj(e))}trim(){return
new t({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new
t({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new
t({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get
isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get
isDate(){return!!this._def.checks.find(e=>e.kind==="date")}get
isTime(){return!!this._def.checks.find(e=>e.kind==="time")}get
isDuration(){return!!this._def.checks.find(e=>e.kind==="duration")}get
isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get
isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get
isEmoji(){return!!this._def.checks.find(e=>e.kind==="emoji")}get
isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get
isNANOID(){return!!this._def.checks.find(e=>e.kind==="nanoid")}get
isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get
isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get
isULID(){return!!this._def.checks.find(e=>e.kind==="ulid")}get
isIP(){return!!this._def.checks.find(e=>e.kind==="ip")}get
isCIDR(){return!!this._def.checks.find(e=>e.kind==="cidr")}get
isBase64(){return!!this._def.checks.find(e=>e.kind==="base64")}get
isBase64url(){return!!this._def.checks.find(e=>e.kind==="base64url")}get minLength(){let e=null;for(let r of
this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e}get maxLength(){let e=null;for(let r of
this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e}};Hr.create=t=>new
Hr({checks:[],typeName:$.ZodString,coerce:t?.coerce??!1,...H(t)});_n=class t extends G{constructor(){super(...arguments
),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),
this._getType(e)!==O.number){let a=this._getOrReturnCtx(e);return
I(a,{code:T.invalid_type,expected:O.number,received:a.parsedType}),B}let n,i=new Ze;for(let a of this._def.checks)a.kin
d==="int"?Z.isInteger(e.data)||(n=this._getOrReturnCtx(e,n),I(n,{code:T.invalid_type,expected:"integer",received:"float
",message:a.message}),i.dirty()):a.kind==="min"?(a.inclusive?e.data<a.value:e.data<=a.value)&&(n=this._getOrReturnCtx(e
,n),I(n,{code:T.too_small,minimum:a.value,type:"number",inclusive:a.inclusive,exact:!1,message:a.message}),i.dirty()):a
.kind==="max"?(a.inclusive?e.data>a.value:e.data>=a.value)&&(n=this._getOrReturnCtx(e,n),I(n,{code:T.too_big,maximum:a.
value,type:"number",inclusive:a.inclusive,exact:!1,message:a.message}),i.dirty()):a.kind==="multipleOf"?Yj(e.data,a.val
ue)!==0&&(n=this._getOrReturnCtx(e,n),I(n,{code:T.not_multiple_of,multipleOf:a.value,message:a.message}),i.dirty()):a.k
ind==="finite"?Number.isFinite(e.data)||(n=this._getOrReturnCtx(e,n),I(n,{code:T.not_finite,message:a.message}),i.dirty
()):Z.assertNever(a);return{status:i.value,value:e.data}}gte(e,r){return
this.setLimit("min",e,!0,D.toString(r))}gt(e,r){return this.setLimit("min",e,!1,D.toString(r))}lte(e,r){return
this.setLimit("max",e,!0,D.toString(r))}lt(e,r){return
this.setLimit("max",e,!1,D.toString(r))}setLimit(e,r,n,i){return new
t({...this._def,checks:[...this._def.checks,{kind:e,value:r,inclusive:n,message:D.toString(i)}]})}_addCheck(e){return
new t({...this._def,checks:[...this._def.checks,e]})}int(e){return
this._addCheck({kind:"int",message:D.toString(e)})}positive(e){return
this._addCheck({kind:"min",value:0,inclusive:!1,message:D.toString(e)})}negative(e){return
this._addCheck({kind:"max",value:0,inclusive:!1,message:D.toString(e)})}nonpositive(e){return
this._addCheck({kind:"max",value:0,inclusive:!0,message:D.toString(e)})}nonnegative(e){return
this._addCheck({kind:"min",value:0,inclusive:!0,message:D.toString(e)})}multipleOf(e,r){return
this._addCheck({kind:"multipleOf",value:e,message:D.toString(r)})}finite(e){return
this._addCheck({kind:"finite",message:D.toString(e)})}safe(e){return this._addCheck({kind:"min",inclusive:!0,value:Numb
er.MIN_SAFE_INTEGER,message:D.toString(e)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:D.
toString(e)})}get minValue(){let e=null;for(let r of
this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e}get maxValue(){let e=null;for(let r of
this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e}get
isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&Z.isInteger(e.value))}get
isFinite(){let e=null,r=null;for(let n of this._def.checks){if(n.kind==="finite"||n.kind==="int"||n.kind==="multipleOf"
)return!0;n.kind==="min"?(r===null||n.value>r)&&(r=n.value):n.kind==="max"&&(e===null||n.value<e)&&(e=n.value)}return
Number.isFinite(r)&&Number.isFinite(e)}};_n.create=t=>new
_n({checks:[],typeName:$.ZodNumber,coerce:t?.coerce||!1,...H(t)});En=class t extends G{constructor(){super(...arguments
),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return
this._getInvalidInput(e)}if(this._getType(e)!==O.bigint)return this._getInvalidInput(e);let n,i=new Ze;for(let a of thi
s._def.checks)a.kind==="min"?(a.inclusive?e.data<a.value:e.data<=a.value)&&(n=this._getOrReturnCtx(e,n),I(n,{code:T.too
_small,type:"bigint",minimum:a.value,inclusive:a.inclusive,message:a.message}),i.dirty()):a.kind==="max"?(a.inclusive?e
.data>a.value:e.data>=a.value)&&(n=this._getOrReturnCtx(e,n),I(n,{code:T.too_big,type:"bigint",maximum:a.value,inclusiv
e:a.inclusive,message:a.message}),i.dirty()):a.kind==="multipleOf"?e.data%a.value!==BigInt(0)&&(n=this._getOrReturnCtx(
e,n),I(n,{code:T.not_multiple_of,multipleOf:a.value,message:a.message}),i.dirty()):Z.assertNever(a);return{status:i.val
ue,value:e.data}}_getInvalidInput(e){let r=this._getOrReturnCtx(e);return
I(r,{code:T.invalid_type,expected:O.bigint,received:r.parsedType}),B}gte(e,r){return
this.setLimit("min",e,!0,D.toString(r))}gt(e,r){return this.setLimit("min",e,!1,D.toString(r))}lte(e,r){return
this.setLimit("max",e,!0,D.toString(r))}lt(e,r){return
this.setLimit("max",e,!1,D.toString(r))}setLimit(e,r,n,i){return new
t({...this._def,checks:[...this._def.checks,{kind:e,value:r,inclusive:n,message:D.toString(i)}]})}_addCheck(e){return
new t({...this._def,checks:[...this._def.checks,e]})}positive(e){return
this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:D.toString(e)})}negative(e){return
this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:D.toString(e)})}nonpositive(e){return
this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:D.toString(e)})}nonnegative(e){return
this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:D.toString(e)})}multipleOf(e,r){return
this._addCheck({kind:"multipleOf",value:e,message:D.toString(r)})}get minValue(){let e=null;for(let r of
this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e}get maxValue(){let e=null;for(let r of
this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e}};En.create=t=>new
En({checks:[],typeName:$.ZodBigInt,coerce:t?.coerce??!1,...H(t)});Tn=class extends
G{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==O.boolean){let n=this._getOrReturnCtx(e);return
I(n,{code:T.invalid_type,expected:O.boolean,received:n.parsedType}),B}return tt(e.data)}};Tn.create=t=>new
Tn({typeName:$.ZodBoolean,coerce:t?.coerce||!1,...H(t)});kn=class t extends
G{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==O.date){let
a=this._getOrReturnCtx(e);return
I(a,{code:T.invalid_type,expected:O.date,received:a.parsedType}),B}if(Number.isNaN(e.data.getTime())){let
a=this._getOrReturnCtx(e);return I(a,{code:T.invalid_date}),B}let n=new Ze,i;for(let a of this._def.checks)a.kind==="mi
n"?e.data.getTime()<a.value&&(i=this._getOrReturnCtx(e,i),I(i,{code:T.too_small,message:a.message,inclusive:!0,exact:!1
,minimum:a.value,type:"date"}),n.dirty()):a.kind==="max"?e.data.getTime()>a.value&&(i=this._getOrReturnCtx(e,i),I(i,{co
de:T.too_big,message:a.message,inclusive:!0,exact:!1,maximum:a.value,type:"date"}),n.dirty()):Z.assertNever(a);return{s
tatus:n.value,value:new Date(e.data.getTime())}}_addCheck(e){return new
t({...this._def,checks:[...this._def.checks,e]})}min(e,r){return
this._addCheck({kind:"min",value:e.getTime(),message:D.toString(r)})}max(e,r){return
this._addCheck({kind:"max",value:e.getTime(),message:D.toString(r)})}get minDate(){let e=null;for(let r of
this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e!=null?new Date(e):null}get maxDate(){let
e=null;for(let r of this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e!=null?new
Date(e):null}};kn.create=t=>new kn({checks:[],coerce:t?.coerce||!1,typeName:$.ZodDate,...H(t)});Mi=class extends
G{_parse(e){if(this._getType(e)!==O.symbol){let n=this._getOrReturnCtx(e);return
I(n,{code:T.invalid_type,expected:O.symbol,received:n.parsedType}),B}return tt(e.data)}};Mi.create=t=>new
Mi({typeName:$.ZodSymbol,...H(t)});An=class extends G{_parse(e){if(this._getType(e)!==O.undefined){let
n=this._getOrReturnCtx(e);return I(n,{code:T.invalid_type,expected:O.undefined,received:n.parsedType}),B}return
tt(e.data)}};An.create=t=>new An({typeName:$.ZodUndefined,...H(t)});Cn=class extends
G{_parse(e){if(this._getType(e)!==O.null){let n=this._getOrReturnCtx(e);return
I(n,{code:T.invalid_type,expected:O.null,received:n.parsedType}),B}return tt(e.data)}};Cn.create=t=>new
Cn({typeName:$.ZodNull,...H(t)});Gr=class extends G{constructor(){super(...arguments),this._any=!0}_parse(e){return
tt(e.data)}};Gr.create=t=>new Gr({typeName:$.ZodAny,...H(t)});_r=class extends
G{constructor(){super(...arguments),this._unknown=!0}_parse(e){return tt(e.data)}};_r.create=t=>new
_r({typeName:$.ZodUnknown,...H(t)});Vt=class extends G{_parse(e){let r=this._getOrReturnCtx(e);return
I(r,{code:T.invalid_type,expected:O.never,received:r.parsedType}),B}};Vt.create=t=>new
Vt({typeName:$.ZodNever,...H(t)});Fi=class extends G{_parse(e){if(this._getType(e)!==O.undefined){let
n=this._getOrReturnCtx(e);return I(n,{code:T.invalid_type,expected:O.void,received:n.parsedType}),B}return
tt(e.data)}};Fi.create=t=>new Fi({typeName:$.ZodVoid,...H(t)});Er=class t extends
G{_parse(e){let{ctx:r,status:n}=this._processInputParams(e),i=this._def;if(r.parsedType!==O.array)return
I(r,{code:T.invalid_type,expected:O.array,received:r.parsedType}),B;if(i.exactLength!==null){let s=r.data.length>i.exac
tLength.value,o=r.data.length<i.exactLength.value;(s||o)&&(I(r,{code:s?T.too_big:T.too_small,minimum:o?i.exactLength.va
lue:void 0,maximum:s?i.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:i.exactLength.message}),n.di
rty())}if(i.minLength!==null&&r.data.length<i.minLength.value&&(I(r,{code:T.too_small,minimum:i.minLength.value,type:"a
rray",inclusive:!0,exact:!1,message:i.minLength.message}),n.dirty()),i.maxLength!==null&&r.data.length>i.maxLength.valu
e&&(I(r,{code:T.too_big,maximum:i.maxLength.value,type:"array",inclusive:!0,exact:!1,message:i.maxLength.message}),n.di
rty()),r.common.async)return Promise.all([...r.data].map((s,o)=>i.type._parseAsync(new
Mt(r,s,r.path,o)))).then(s=>Ze.mergeArray(n,s));let a=[...r.data].map((s,o)=>i.type._parseSync(new
Mt(r,s,r.path,o)));return Ze.mergeArray(n,a)}get element(){return this._def.type}min(e,r){return new
t({...this._def,minLength:{value:e,message:D.toString(r)}})}max(e,r){return new
t({...this._def,maxLength:{value:e,message:D.toString(r)}})}length(e,r){return new
t({...this._def,exactLength:{value:e,message:D.toString(r)}})}nonempty(e){return this.min(1,e)}};Er.create=(t,e)=>new
Er({type:t,minLength:null,maxLength:null,exactLength:null,typeName:$.ZodArray,...H(e)});_t=class t extends G{constructo
r(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this
._cached!==null)return this._cached;let e=this._def.shape(),r=Z.objectKeys(e);return
this._cached={shape:e,keys:r},this._cached}_parse(e){if(this._getType(e)!==O.object){let
c=this._getOrReturnCtx(e);return I(c,{code:T.invalid_type,expected:O.object,received:c.parsedType}),B}let{status:n,ctx:
i}=this._processInputParams(e),{shape:a,keys:s}=this._getCached(),o=[];if(!(this._def.catchall instanceof
Vt&&this._def.unknownKeys==="strip"))for(let c in i.data)s.includes(c)||o.push(c);let u=[];for(let c of s){let
l=a[c],p=i.data[c];u.push({key:{status:"valid",value:c},value:l._parse(new Mt(i,p,i.path,c)),alwaysSet:c in
i.data})}if(this._def.catchall instanceof Vt){let c=this._def.unknownKeys;if(c==="passthrough")for(let l of
o)u.push({key:{status:"valid",value:l},value:{status:"valid",value:i.data[l]}});else
if(c==="strict")o.length>0&&(I(i,{code:T.unrecognized_keys,keys:o}),n.dirty());else if(c!=="strip")throw new
Error("Internal ZodObject error: invalid unknownKeys value.")}else{let c=this._def.catchall;for(let l of o){let
p=i.data[l];u.push({key:{status:"valid",value:l},value:c._parse(new Mt(i,p,i.path,l)),alwaysSet:l in i.data})}}return
i.common.async?Promise.resolve().then(async()=>{let c=[];for(let l of u){let p=await l.key,d=await
l.value;c.push({key:p,value:d,alwaysSet:l.alwaysSet})}return
c}).then(c=>Ze.mergeObjectSync(n,c)):Ze.mergeObjectSync(n,u)}get shape(){return this._def.shape()}strict(e){return
D.errToObj,new t({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(r,n)=>{let
i=this._def.errorMap?.(r,n).message??n.defaultError;return
r.code==="unrecognized_keys"?{message:D.errToObj(e).message??i}:{message:i}}}:{}})}strip(){return new
t({...this._def,unknownKeys:"strip"})}passthrough(){return new
t({...this._def,unknownKeys:"passthrough"})}extend(e){return new
t({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new t({unknownKeys:e._def.unknownKeys,catchal
l:e._def.catchall,shape:()=>({...this._def.shape(),...e._def.shape()}),typeName:$.ZodObject})}setKey(e,r){return
this.augment({[e]:r})}catchall(e){return new t({...this._def,catchall:e})}pick(e){let r={};for(let n of
Z.objectKeys(e))e[n]&&this.shape[n]&&(r[n]=this.shape[n]);return new t({...this._def,shape:()=>r})}omit(e){let
r={};for(let n of Z.objectKeys(this.shape))e[n]||(r[n]=this.shape[n]);return new
t({...this._def,shape:()=>r})}deepPartial(){return Li(this)}partial(e){let r={};for(let n of
Z.objectKeys(this.shape)){let i=this.shape[n];e&&!e[n]?r[n]=i:r[n]=i.optional()}return new
t({...this._def,shape:()=>r})}required(e){let r={};for(let n of
Z.objectKeys(this.shape))if(e&&!e[n])r[n]=this.shape[n];else{let a=this.shape[n];for(;a instanceof
Lt;)a=a._def.innerType;r[n]=a}return new t({...this._def,shape:()=>r})}keyof(){return
Y8(Z.objectKeys(this.shape))}};_t.create=(t,e)=>new
_t({shape:()=>t,unknownKeys:"strip",catchall:Vt.create(),typeName:$.ZodObject,...H(e)});_t.strictCreate=(t,e)=>new
_t({shape:()=>t,unknownKeys:"strict",catchall:Vt.create(),typeName:$.ZodObject,...H(e)});_t.lazycreate=(t,e)=>new
_t({shape:t,unknownKeys:"strip",catchall:Vt.create(),typeName:$.ZodObject,...H(e)});In=class extends
G{_parse(e){let{ctx:r}=this._processInputParams(e),n=this._def.options;function i(a){for(let o of
a)if(o.result.status==="valid")return o.result;for(let o of a)if(o.result.status==="dirty")return
r.common.issues.push(...o.ctx.common.issues),o.result;let s=a.map(o=>new St(o.ctx.common.issues));return
I(r,{code:T.invalid_union,unionErrors:s}),B}if(r.common.async)return Promise.all(n.map(async a=>{let
s={...r,common:{...r.common,issues:[]},parent:null};return{result:await
a._parseAsync({data:r.data,path:r.path,parent:s}),ctx:s}})).then(i);{let a,s=[];for(let u of n){let c={...r,common:{...
r.common,issues:[]},parent:null},l=u._parseSync({data:r.data,path:r.path,parent:c});if(l.status==="valid")return
l;l.status==="dirty"&&!a&&(a={result:l,ctx:c}),c.common.issues.length&&s.push(c.common.issues)}if(a)return
r.common.issues.push(...a.ctx.common.issues),a.result;let o=s.map(u=>new St(u));return
I(r,{code:T.invalid_union,unionErrors:o}),B}}get options(){return this._def.options}};In.create=(t,e)=>new
In({options:t,typeName:$.ZodUnion,...H(e)});Sr=t=>t instanceof Nn?Sr(t.schema):t instanceof Ft?Sr(t.innerType()):t
instanceof On?[t.value]:t instanceof qn?t.options:t instanceof Rn?Z.objectValues(t.enum):t instanceof
jn?Sr(t._def.innerType):t instanceof An?[void 0]:t instanceof Cn?[null]:t instanceof Lt?[void 0,...Sr(t.unwrap())]:t
instanceof ur?[null,...Sr(t.unwrap())]:t instanceof Ls||t instanceof Ln?Sr(t.unwrap()):t instanceof
Dn?Sr(t._def.innerType):[],vu=class t extends
G{_parse(e){let{ctx:r}=this._processInputParams(e);if(r.parsedType!==O.object)return
I(r,{code:T.invalid_type,expected:O.object,received:r.parsedType}),B;let
n=this.discriminator,i=r.data[n],a=this.optionsMap.get(i);return a?r.common.async?a._parseAsync({data:r.data,path:r.pat
h,parent:r}):a._parseSync({data:r.data,path:r.path,parent:r}):(I(r,{code:T.invalid_union_discriminator,options:Array.fr
om(this.optionsMap.keys()),path:[n]}),B)}get discriminator(){return this._def.discriminator}get options(){return
this._def.options}get optionsMap(){return this._def.optionsMap}static create(e,r,n){let i=new Map;for(let a of r){let
s=Sr(a.shape[e]);if(!s.length)throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all
schema options`);for(let o of s){if(i.has(o))throw new Error(`Discriminator property ${String(e)} has duplicate value
${String(o)}`);i.set(o,a)}}return new
t({typeName:$.ZodDiscriminatedUnion,discriminator:e,options:r,optionsMap:i,...H(n)})}};Pn=class extends
G{_parse(e){let{status:r,ctx:n}=this._processInputParams(e),i=(a,s)=>{if(hu(a)||hu(s))return B;let
o=Vh(a.value,s.value);return
o.valid?((gu(a)||gu(s))&&r.dirty(),{status:r.value,value:o.data}):(I(n,{code:T.invalid_intersection_types}),B)};return
n.common.async?Promise.all([this._def.left._parseAsync({data:n.data,path:n.path,parent:n}),this._def.right._parseAsync(
{data:n.data,path:n.path,parent:n})]).then(([a,s])=>i(a,s)):i(this._def.left._parseSync({data:n.data,path:n.path,parent
:n}),this._def.right._parseSync({data:n.data,path:n.path,parent:n}))}};Pn.create=(t,e,r)=>new
Pn({left:t,right:e,typeName:$.ZodIntersection,...H(r)});cr=class t extends
G{_parse(e){let{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==O.array)return
I(n,{code:T.invalid_type,expected:O.array,received:n.parsedType}),B;if(n.data.length<this._def.items.length)return I(n,
{code:T.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),B;!this._def.rest&&n.data.length>
this._def.items.length&&(I(n,{code:T.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),r.dirt
y());let a=[...n.data].map((s,o)=>{let u=this._def.items[o]||this._def.rest;return u?u._parse(new
Mt(n,s,n.path,o)):null}).filter(s=>!!s);return
n.common.async?Promise.all(a).then(s=>Ze.mergeArray(r,s)):Ze.mergeArray(r,a)}get items(){return
this._def.items}rest(e){return new t({...this._def,rest:e})}};cr.create=(t,e)=>{if(!Array.isArray(t))throw new
Error("You must pass an array of schemas to z.tuple([ ... ])");return new
cr({items:t,typeName:$.ZodTuple,rest:null,...H(e)})};yu=class t extends G{get keySchema(){return this._def.keyType}get
valueSchema(){return
this._def.valueType}_parse(e){let{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==O.object)return
I(n,{code:T.invalid_type,expected:O.object,received:n.parsedType}),B;let
i=[],a=this._def.keyType,s=this._def.valueType;for(let o in n.data)i.push({key:a._parse(new
Mt(n,o,n.path,o)),value:s._parse(new Mt(n,n.data[o],n.path,o)),alwaysSet:o in n.data});return
n.common.async?Ze.mergeObjectAsync(r,i):Ze.mergeObjectSync(r,i)}get element(){return this._def.valueType}static
create(e,r,n){return r instanceof G?new t({keyType:e,valueType:r,typeName:$.ZodRecord,...H(n)}):new
t({keyType:Hr.create(),valueType:e,typeName:$.ZodRecord,...H(r)})}},Bi=class extends G{get keySchema(){return
this._def.keyType}get valueSchema(){return
this._def.valueType}_parse(e){let{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==O.map)return
I(n,{code:T.invalid_type,expected:O.map,received:n.parsedType}),B;let
i=this._def.keyType,a=this._def.valueType,s=[...n.data.entries()].map(([o,u],c)=>({key:i._parse(new
Mt(n,o,n.path,[c,"key"])),value:a._parse(new Mt(n,u,n.path,[c,"value"]))}));if(n.common.async){let o=new Map;return
Promise.resolve().then(async()=>{for(let u of s){let c=await u.key,l=await
u.value;if(c.status==="aborted"||l.status==="aborted")return
B;(c.status==="dirty"||l.status==="dirty")&&r.dirty(),o.set(c.value,l.value)}return{status:r.value,value:o}})}else{let
o=new Map;for(let u of s){let c=u.key,l=u.value;if(c.status==="aborted"||l.status==="aborted")return B;(c.status==="dir
ty"||l.status==="dirty")&&r.dirty(),o.set(c.value,l.value)}return{status:r.value,value:o}}}};Bi.create=(t,e,r)=>new
Bi({valueType:e,keyType:t,typeName:$.ZodMap,...H(r)});$i=class t extends
G{_parse(e){let{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==O.set)return
I(n,{code:T.invalid_type,expected:O.set,received:n.parsedType}),B;let i=this._def;i.minSize!==null&&n.data.size<i.minSi
ze.value&&(I(n,{code:T.too_small,minimum:i.minSize.value,type:"set",inclusive:!0,exact:!1,message:i.minSize.message}),r
.dirty()),i.maxSize!==null&&n.data.size>i.maxSize.value&&(I(n,{code:T.too_big,maximum:i.maxSize.value,type:"set",inclus
ive:!0,exact:!1,message:i.maxSize.message}),r.dirty());let a=this._def.valueType;function s(u){let c=new Set;for(let l
of u){if(l.status==="aborted")return B;l.status==="dirty"&&r.dirty(),c.add(l.value)}return{status:r.value,value:c}}let
o=[...n.data.values()].map((u,c)=>a._parse(new Mt(n,u,n.path,c)));return
n.common.async?Promise.all(o).then(u=>s(u)):s(o)}min(e,r){return new
t({...this._def,minSize:{value:e,message:D.toString(r)}})}max(e,r){return new
t({...this._def,maxSize:{value:e,message:D.toString(r)}})}size(e,r){return this.min(e,r).max(e,r)}nonempty(e){return
this.min(1,e)}};$i.create=(t,e)=>new $i({valueType:t,minSize:null,maxSize:null,typeName:$.ZodSet,...H(e)});xu=class t
extends G{constructor(){super(...arguments),this.validate=this.implement}_parse(e){let{ctx:r}=this._processInputParams(
e);if(r.parsedType!==O.function)return I(r,{code:T.invalid_type,expected:O.function,received:r.parsedType}),B;function
n(o,u){return Ds({data:o,path:r.path,errorMaps:[r.common.contextualErrorMap,r.schemaErrorMap,ji(),wr].filter(c=>!!c),is
sueData:{code:T.invalid_arguments,argumentsError:u}})}function i(o,u){return Ds({data:o,path:r.path,errorMaps:[r.common
.contextualErrorMap,r.schemaErrorMap,ji(),wr].filter(c=>!!c),issueData:{code:T.invalid_return_type,returnTypeError:u}})
}let a={errorMap:r.common.contextualErrorMap},s=r.data;if(this._def.returns instanceof Wr){let o=this;return tt(async
function(...u){let c=new St([]),l=await o._def.args.parseAsync(u,a).catch(f=>{throw c.addIssue(n(u,f)),c}),p=await
Reflect.apply(s,this,l);return await o._def.returns._def.type.parseAsync(p,a).catch(f=>{throw
c.addIssue(i(p,f)),c})})}else{let o=this;return tt(function(...u){let c=o._def.args.safeParse(u,a);if(!c.success)throw
new St([n(u,c.error)]);let l=Reflect.apply(s,this,c.data),p=o._def.returns.safeParse(l,a);if(!p.success)throw new
St([i(l,p.error)]);return p.data})}}parameters(){return this._def.args}returnType(){return
this._def.returns}args(...e){return new t({...this._def,args:cr.create(e).rest(_r.create())})}returns(e){return new
t({...this._def,returns:e})}implement(e){return this.parse(e)}strictImplement(e){return this.parse(e)}static
create(e,r,n){return new
t({args:e||cr.create([]).rest(_r.create()),returns:r||_r.create(),typeName:$.ZodFunction,...H(n)})}},Nn=class extends
G{get schema(){return this._def.getter()}_parse(e){let{ctx:r}=this._processInputParams(e);return
this._def.getter()._parse({data:r.data,path:r.path,parent:r})}};Nn.create=(t,e)=>new
Nn({getter:t,typeName:$.ZodLazy,...H(e)});On=class extends G{_parse(e){if(e.data!==this._def.value){let
r=this._getOrReturnCtx(e);return
I(r,{received:r.data,code:T.invalid_literal,expected:this._def.value}),B}return{status:"valid",value:e.data}}get
value(){return this._def.value}};On.create=(t,e)=>new On({value:t,typeName:$.ZodLiteral,...H(e)});qn=class t extends
G{_parse(e){if(typeof e.data!="string"){let r=this._getOrReturnCtx(e),n=this._def.values;return
I(r,{expected:Z.joinValues(n),received:r.parsedType,code:T.invalid_type}),B}if(this._cache||(this._cache=new
Set(this._def.values)),!this._cache.has(e.data)){let r=this._getOrReturnCtx(e),n=this._def.values;return
I(r,{received:r.data,code:T.invalid_enum_value,options:n}),B}return tt(e.data)}get options(){return
this._def.values}get enum(){let e={};for(let r of this._def.values)e[r]=r;return e}get Values(){let e={};for(let r of
this._def.values)e[r]=r;return e}get Enum(){let e={};for(let r of this._def.values)e[r]=r;return
e}extract(e,r=this._def){return t.create(e,{...this._def,...r})}exclude(e,r=this._def){return
t.create(this.options.filter(n=>!e.includes(n)),{...this._def,...r})}};qn.create=Y8;Rn=class extends G{_parse(e){let r=
Z.getValidEnumValues(this._def.values),n=this._getOrReturnCtx(e);if(n.parsedType!==O.string&&n.parsedType!==O.number){l
et i=Z.objectValues(r);return
I(n,{expected:Z.joinValues(i),received:n.parsedType,code:T.invalid_type}),B}if(this._cache||(this._cache=new
Set(Z.getValidEnumValues(this._def.values))),!this._cache.has(e.data)){let i=Z.objectValues(r);return
I(n,{received:n.data,code:T.invalid_enum_value,options:i}),B}return tt(e.data)}get enum(){return
this._def.values}};Rn.create=(t,e)=>new Rn({values:t,typeName:$.ZodNativeEnum,...H(e)});Wr=class extends
G{unwrap(){return this._def.type}_parse(e){let{ctx:r}=this._processInputParams(e);if(r.parsedType!==O.promise&&r.common
.async===!1)return I(r,{code:T.invalid_type,expected:O.promise,received:r.parsedType}),B;let
n=r.parsedType===O.promise?r.data:Promise.resolve(r.data);return
tt(n.then(i=>this._def.type.parseAsync(i,{path:r.path,errorMap:r.common.contextualErrorMap})))}};Wr.create=(t,e)=>new
Wr({type:t,typeName:$.ZodPromise,...H(e)});Ft=class extends G{innerType(){return this._def.schema}sourceType(){return t
his._def.schema._def.typeName===$.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){let{status:r,ctx:
n}=this._processInputParams(e),i=this._def.effect||null,a={addIssue:s=>{I(n,s),s.fatal?r.abort():r.dirty()},get
path(){return n.path}};if(a.addIssue=a.addIssue.bind(a),i.type==="preprocess"){let
s=i.transform(n.data,a);if(n.common.async)return Promise.resolve(s).then(async o=>{if(r.value==="aborted")return B;let
u=await this._def.schema._parseAsync({data:o,path:n.path,parent:n});return
u.status==="aborted"?B:u.status==="dirty"?Sn(u.value):r.value==="dirty"?Sn(u.value):u});{if(r.value==="aborted")return
B;let o=this._def.schema._parseSync({data:s,path:n.path,parent:n});return
o.status==="aborted"?B:o.status==="dirty"?Sn(o.value):r.value==="dirty"?Sn(o.value):o}}if(i.type==="refinement"){let
s=o=>{let u=i.refinement(o,a);if(n.common.async)return Promise.resolve(u);if(u instanceof Promise)throw new
Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return
o};if(n.common.async===!1){let o=this._def.schema._parseSync({data:n.data,path:n.path,parent:n});return
o.status==="aborted"?B:(o.status==="dirty"&&r.dirty(),s(o.value),{status:r.value,value:o.value})}else return this._def.
schema._parseAsync({data:n.data,path:n.path,parent:n}).then(o=>o.status==="aborted"?B:(o.status==="dirty"&&r.dirty(),s(
o.value).then(()=>({status:r.value,value:o.value}))))}if(i.type==="transform")if(n.common.async===!1){let
s=this._def.schema._parseSync({data:n.data,path:n.path,parent:n});if(!Vr(s))return B;let o=i.transform(s.value,a);if(o
instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use
.parseAsync instead.");return{status:r.value,value:o}}else return this._def.schema._parseAsync({data:n.data,path:n.path
,parent:n}).then(s=>Vr(s)?Promise.resolve(i.transform(s.value,a)).then(o=>({status:r.value,value:o})):B);Z.assertNever(
i)}};Ft.create=(t,e,r)=>new Ft({schema:t,typeName:$.ZodEffects,effect:e,...H(r)});Ft.createWithPreprocess=(t,e,r)=>new
Ft({schema:e,effect:{type:"preprocess",transform:t},typeName:$.ZodEffects,...H(r)});Lt=class extends
G{_parse(e){return this._getType(e)===O.undefined?tt(void 0):this._def.innerType._parse(e)}unwrap(){return
this._def.innerType}};Lt.create=(t,e)=>new Lt({innerType:t,typeName:$.ZodOptional,...H(e)});ur=class extends
G{_parse(e){return this._getType(e)===O.null?tt(null):this._def.innerType._parse(e)}unwrap(){return
this._def.innerType}};ur.create=(t,e)=>new ur({innerType:t,typeName:$.ZodNullable,...H(e)});jn=class extends
G{_parse(e){let{ctx:r}=this._processInputParams(e),n=r.data;return r.parsedType===O.undefined&&(n=this._def.defaultValu
e()),this._def.innerType._parse({data:n,path:r.path,parent:r})}removeDefault(){return
this._def.innerType}};jn.create=(t,e)=>new jn({innerType:t,typeName:$.ZodDefault,defaultValue:typeof
e.default=="function"?e.default:()=>e.default,...H(e)});Dn=class extends G{_parse(e){let{ctx:r}=this._processInputParam
s(e),n={...r,common:{...r.common,issues:[]}},i=this._def.innerType._parse({data:n.data,path:n.path,parent:{...n}});retu
rn Di(i)?i.then(a=>({status:"valid",value:a.status==="valid"?a.value:this._def.catchValue({get error(){return new
St(n.common.issues)},input:n.data})})):{status:"valid",value:i.status==="valid"?i.value:this._def.catchValue({get
error(){return new St(n.common.issues)},input:n.data})}}removeCatch(){return
this._def.innerType}};Dn.create=(t,e)=>new Dn({innerType:t,typeName:$.ZodCatch,catchValue:typeof
e.catch=="function"?e.catch:()=>e.catch,...H(e)});zi=class extends G{_parse(e){if(this._getType(e)!==O.nan){let
n=this._getOrReturnCtx(e);return I(n,{code:T.invalid_type,expected:O.nan,received:n.parsedType}),B}return{status:"valid
",value:e.data}}};zi.create=t=>new zi({typeName:$.ZodNaN,...H(t)});eD=Symbol("zod_brand"),Ls=class extends
G{_parse(e){let{ctx:r}=this._processInputParams(e),n=r.data;return
this._def.type._parse({data:n,path:r.path,parent:r})}unwrap(){return this._def.type}},Ms=class t extends
G{_parse(e){let{status:r,ctx:n}=this._processInputParams(e);if(n.common.async)return(async()=>{let a=await
this._def.in._parseAsync({data:n.data,path:n.path,parent:n});return a.status==="aborted"?B:a.status==="dirty"?(r.dirty(
),Sn(a.value)):this._def.out._parseAsync({data:a.value,path:n.path,parent:n})})();{let
i=this._def.in._parseSync({data:n.data,path:n.path,parent:n});return i.status==="aborted"?B:i.status==="dirty"?(r.dirty
(),{status:"dirty",value:i.value}):this._def.out._parseSync({data:i.value,path:n.path,parent:n})}}static
create(e,r){return new t({in:e,out:r,typeName:$.ZodPipeline})}},Ln=class extends G{_parse(e){let
r=this._def.innerType._parse(e),n=i=>(Vr(i)&&(i.value=Object.freeze(i.value)),i);return
Di(r)?r.then(i=>n(i)):n(r)}unwrap(){return this._def.innerType}};Ln.create=(t,e)=>new Ln({innerType:t,typeName:$.ZodRea
donly,...H(e)});tD={object:_t.lazycreate};(function(t){t.ZodString="ZodString",t.ZodNumber="ZodNumber",t.ZodNaN="ZodNaN
",t.ZodBigInt="ZodBigInt",t.ZodBoolean="ZodBoolean",t.ZodDate="ZodDate",t.ZodSymbol="ZodSymbol",t.ZodUndefined="ZodUnde
fined",t.ZodNull="ZodNull",t.ZodAny="ZodAny",t.ZodUnknown="ZodUnknown",t.ZodNever="ZodNever",t.ZodVoid="ZodVoid",t.ZodA
rray="ZodArray",t.ZodObject="ZodObject",t.ZodUnion="ZodUnion",t.ZodDiscriminatedUnion="ZodDiscriminatedUnion",t.ZodInte
rsection="ZodIntersection",t.ZodTuple="ZodTuple",t.ZodRecord="ZodRecord",t.ZodMap="ZodMap",t.ZodSet="ZodSet",t.ZodFunct
ion="ZodFunction",t.ZodLazy="ZodLazy",t.ZodLiteral="ZodLiteral",t.ZodEnum="ZodEnum",t.ZodEffects="ZodEffects",t.ZodNati
veEnum="ZodNativeEnum",t.ZodOptional="ZodOptional",t.ZodNullable="ZodNullable",t.ZodDefault="ZodDefault",t.ZodCatch="Zo
dCatch",t.ZodPromise="ZodPromise",t.ZodBranded="ZodBranded",t.ZodPipeline="ZodPipeline",t.ZodReadonly="ZodReadonly"})($
||($={}));rD=(t,e={message:`Input not instance of ${t.name}`})=>e4(r=>r instanceof t,e),t4=Hr.create,r4=_n.create,nD=zi
.create,iD=En.create,n4=Tn.create,aD=kn.create,sD=Mi.create,oD=An.create,cD=Cn.create,uD=Gr.create,lD=_r.create,pD=Vt.c
reate,dD=Fi.create,fD=Er.create,mD=_t.create,hD=_t.strictCreate,gD=In.create,vD=vu.create,yD=Pn.create,xD=cr.create,bD=
yu.create,wD=Bi.create,SD=$i.create,_D=xu.create,ED=Nn.create,TD=On.create,kD=qn.create,AD=Rn.create,CD=Wr.create,ID=Ft
.create,PD=Lt.create,ND=ur.create,OD=Ft.createWithPreprocess,qD=Ms.create,RD=()=>t4().optional(),jD=()=>r4().optional()
,DD=()=>n4().optional(),LD={string:(t=>Hr.create({...t,coerce:!0})),number:(t=>_n.create({...t,coerce:!0})),boolean:(t=
>Tn.create({...t,coerce:!0})),bigint:(t=>En.create({...t,coerce:!0})),date:(t=>kn.create({...t,coerce:!0}))},MD=B});var
 x={};Zs(x,{BRAND:()=>eD,DIRTY:()=>Sn,EMPTY_PATH:()=>Oj,INVALID:()=>B,NEVER:()=>MD,OK:()=>tt,ParseStatus:()=>Ze,Schema:
()=>G,ZodAny:()=>Gr,ZodArray:()=>Er,ZodBigInt:()=>En,ZodBoolean:()=>Tn,ZodBranded:()=>Ls,ZodCatch:()=>Dn,ZodDate:()=>kn
,ZodDefault:()=>jn,ZodDiscriminatedUnion:()=>vu,ZodEffects:()=>Ft,ZodEnum:()=>qn,ZodError:()=>St,ZodFirstPartyTypeKind:
()=>$,ZodFunction:()=>xu,ZodIntersection:()=>Pn,ZodIssueCode:()=>T,ZodLazy:()=>Nn,ZodLiteral:()=>On,ZodMap:()=>Bi,ZodNa
N:()=>zi,ZodNativeEnum:()=>Rn,ZodNever:()=>Vt,ZodNull:()=>Cn,ZodNullable:()=>ur,ZodNumber:()=>_n,ZodObject:()=>_t,ZodOp
tional:()=>Lt,ZodParsedType:()=>O,ZodPipeline:()=>Ms,ZodPromise:()=>Wr,ZodReadonly:()=>Ln,ZodRecord:()=>yu,ZodSchema:()
=>G,ZodSet:()=>$i,ZodString:()=>Hr,ZodSymbol:()=>Mi,ZodTransformer:()=>Ft,ZodTuple:()=>cr,ZodType:()=>G,ZodUndefined:()
=>An,ZodUnion:()=>In,ZodUnknown:()=>_r,ZodVoid:()=>Fi,addIssueToContext:()=>I,any:()=>uD,array:()=>fD,bigint:()=>iD,boo
lean:()=>n4,coerce:()=>LD,custom:()=>e4,date:()=>aD,datetimeRegex:()=>J8,defaultErrorMap:()=>wr,discriminatedUnion:()=>
vD,effect:()=>ID,enum:()=>kD,function:()=>_D,getErrorMap:()=>ji,getParsedType:()=>or,instanceof:()=>rD,intersection:()=
>yD,isAborted:()=>hu,isAsync:()=>Di,isDirty:()=>gu,isValid:()=>Vr,late:()=>tD,lazy:()=>ED,literal:()=>TD,makeIssue:()=>
Ds,map:()=>wD,nan:()=>nD,nativeEnum:()=>AD,never:()=>pD,null:()=>cD,nullable:()=>ND,number:()=>r4,object:()=>mD,objectU
til:()=>$h,oboolean:()=>DD,onumber:()=>jD,optional:()=>PD,ostring:()=>RD,pipeline:()=>qD,preprocess:()=>OD,promise:()=>
CD,quotelessJson:()=>Ij,record:()=>bD,set:()=>SD,setErrorMap:()=>Nj,strictObject:()=>hD,string:()=>t4,symbol:()=>sD,tra
nsformer:()=>ID,tuple:()=>xD,undefined:()=>oD,union:()=>gD,unknown:()=>lD,util:()=>Z,void:()=>dD});var
Hh=S(()=>{mu();Uh();H8();js();i4();fu()});var Fs=S(()=>{Hh();Hh()});var a4=S(()=>{Uc()});var s4=S(()=>{});var
Gh=S(()=>{qc();Wd();rr();C();Lc();a4();Tc();s4();fr();As();Hc();nr();xt();de();hr()});function qe(t,e){return
e.includes(t.columnType)}function FD(t){return"enumValues"in
t&&Array.isArray(t.enumValues)&&t.enumValues.length>0}function o4(t,e){let
r=e?.zodInstance??x,n=e?.coerce??{},i;return FD(t)&&(i=t.enumValues.length?r.enum(t.enumValues):r.string()),i||(qe(t,["
PgGeometry","PgPointTuple"])?i=r.tuple([r.number(),r.number()]):qe(t,["PgGeometryObject","PgPointObject"])?i=r.object({
x:r.number(),y:r.number()}):qe(t,["PgHalfVector","PgVector"])?(i=r.array(r.number()),i=t.dimensions?i.length(t.dimensio
ns):i):qe(t,["PgLine"])?i=r.tuple([r.number(),r.number(),r.number()]):qe(t,["PgLineABC"])?i=r.object({a:r.number(),b:r.
number(),c:r.number()}):qe(t,["PgArray"])?(i=r.array(o4(t.baseColumn,r)),i=t.size?i.length(t.size):i):t.dataType==="arr
ay"?i=r.array(r.any()):t.dataType==="number"?i=UD(t,r,n):t.dataType==="bigint"?i=QD(t,r,n):t.dataType==="boolean"?i=n==
=!0||n.boolean?r.coerce.boolean():r.boolean():t.dataType==="date"?i=n===!0||n.date?r.coerce.date():r.date():t.dataType=
=="string"?i=VD(t,r,n):t.dataType==="json"?i=$D:t.dataType==="custom"?i=r.any():t.dataType==="buffer"&&(i=zD)),i||(i=r.
any()),i}function UD(t,e,r){let n=t.getSQLType().includes("unsigned"),i,a,s=!1;qe(t,["MySqlTinyInt","SingleStoreTinyInt
"])?(i=n?0:Ie.INT8_MIN,a=n?Ie.INT8_UNSIGNED_MAX:Ie.INT8_MAX,s=!0):qe(t,["PgSmallInt","PgSmallSerial","MySqlSmallInt","S
ingleStoreSmallInt"])?(i=n?0:Ie.INT16_MIN,a=n?Ie.INT16_UNSIGNED_MAX:Ie.INT16_MAX,s=!0):qe(t,["PgReal","MySqlFloat","MyS
qlMediumInt","SingleStoreMediumInt","SingleStoreFloat"])?(i=n?0:Ie.INT24_MIN,a=n?Ie.INT24_UNSIGNED_MAX:Ie.INT24_MAX,s=q
e(t,["MySqlMediumInt","SingleStoreMediumInt"])):qe(t,["PgInteger","PgSerial","MySqlInt","SingleStoreInt"])?(i=n?0:Ie.IN
T32_MIN,a=n?Ie.INT32_UNSIGNED_MAX:Ie.INT32_MAX,s=!0):qe(t,["PgDoublePrecision","MySqlReal","MySqlDouble","SingleStoreRe
al","SingleStoreDouble","SQLiteReal"])?(i=n?0:Ie.INT48_MIN,a=n?Ie.INT48_UNSIGNED_MAX:Ie.INT48_MAX):qe(t,["PgBigInt53","
PgBigSerial53","MySqlBigInt53","MySqlSerial","SingleStoreBigInt53","SingleStoreSerial","SQLiteInteger"])?(n=n||qe(t,["M
ySqlSerial","SingleStoreSerial"]),i=n?0:Number.MIN_SAFE_INTEGER,a=Number.MAX_SAFE_INTEGER,s=!0):qe(t,["MySqlYear","Sing
leStoreYear"])?(i=1901,a=2155,s=!0):(i=Number.MIN_SAFE_INTEGER,a=Number.MAX_SAFE_INTEGER);let
o=r===!0||r?.number?e.coerce.number():e.number();return o=o.min(i).max(a),s?o.int():o}function QD(t,e,r){let n=t.getSQL
Type().includes("unsigned"),i=n?0n:Ie.INT64_MIN,a=n?Ie.INT64_UNSIGNED_MAX:Ie.INT64_MAX;return(r===!0||r?.bigint?e.coerc
e.bigint():e.bigint()).min(i).max(a)}function VD(t,e,r){if(qe(t,["PgUUID"]))return e.string().uuid();let n,i,a=!1;qe(t,
["PgVarchar","SQLiteText"])?n=t.length:qe(t,["MySqlVarChar","SingleStoreVarChar"])?n=t.length??Ie.INT16_UNSIGNED_MAX:qe
(t,["MySqlText","SingleStoreText"])&&(t.textType==="longtext"?n=Ie.INT32_UNSIGNED_MAX:t.textType==="mediumtext"?n=Ie.IN
T24_UNSIGNED_MAX:t.textType==="text"?n=Ie.INT16_UNSIGNED_MAX:n=Ie.INT8_UNSIGNED_MAX),qe(t,["PgChar","MySqlChar","Single
StoreChar"])&&(n=t.length,a=!0),qe(t,["PgBinaryVector"])&&(i=/^[01]+$/,n=t.dimensions);let
s=r===!0||r?.string?e.coerce.string():e.string();return s=i?s.regex(i):s,n&&a?s.length(n):n?s.max(n):s}function
c4(t){return hf(t)?xn(t):uE(t)}function u4(t,e,r,n){let i={};for(let[a,s]of
Object.entries(t)){if(!w(s,ne)&&!w(s,N)&&!w(s,N.Aliased)&&typeof s=="object"){let
p=hf(s)||aE(s)?c4(s):s;i[a]=u4(p,e[a]??{},r,n);continue}let o=e[a];if(o!==void 0&&typeof
o!="function"){i[a]=o;continue}let u=w(s,ne)?s:void 0,c=u?o4(u,n):x.any(),l=typeof o=="function"?o(c):c;r.never(u)||(i[
a]=l,u&&(r.nullable(u)&&(i[a]=i[a].nullable()),r.optional(u)&&(i[a]=i[a].optional())))}return x.object(i)}var Ie,BD,$D,
zD,HD,l4,p4=S(()=>{Fs();Gh();Ie={INT8_MIN:-128,INT8_MAX:127,INT8_UNSIGNED_MAX:255,INT16_MIN:-32768,INT16_MAX:32767,INT1
6_UNSIGNED_MAX:65535,INT24_MIN:-8388608,INT24_MAX:8388607,INT24_UNSIGNED_MAX:16777215,INT32_MIN:-2147483648,INT32_MAX:2
147483647,INT32_UNSIGNED_MAX:4294967295,INT48_MIN:-0x800000000000,INT48_MAX:0x7fffffffffff,INT48_UNSIGNED_MAX:0xfffffff
fffff,INT64_MIN:-9223372036854775808n,INT64_MAX:9223372036854775807n,INT64_UNSIGNED_MAX:18446744073709551615n};BD=x.uni
on([x.string(),x.number(),x.boolean(),x.null()]),$D=x.union([BD,x.record(x.any()),x.array(x.any())]),zD=x.custom(t=>t
instanceof Buffer);HD={never:t=>t?.generated?.type==="always"||t?.generatedIdentity?.type==="always",optional:t=>!t.not
Null||t.notNull&&t.hasDefault,nullable:t=>!t.notNull},l4=(t,e)=>{let r=c4(t);return u4(r,e??{},HD)}});var Wh={};Zs(Wh,{
extensionCommands:()=>Ht,extensionStatus:()=>Kr,insertPromptSchema:()=>bu,loginSchema:()=>XD,prompts:()=>M,registerSche
ma:()=>KD,users:()=>Y});var Y,GD,WD,M,bu,KD,XD,Kr,Ht,wu=S(()=>{"use strict";jh();p4();Fs();Y=$r("users",{id:Qt("id").de
faultRandom().primaryKey(),email:Ge("email").notNull(),passwordHash:Ge("password_hash").notNull(),apiToken:Ge("api_toke
n").notNull(),createdAt:Dt("created_at").defaultNow().notNull(),lastIngestAt:Dt("last_ingest_at")},t=>({emailUniq:Ns("u
sers_email_uniq").on(t.email),tokenUniq:Ns("users_token_uniq").on(t.apiToken)})),GD=x.object({modelGuess:x.string().opt
ional(),language:x.string().optional(),lengthChars:x.number(),lengthTokensEst:x.number(),isEdit:x.boolean(),submitMetho
d:x.string()}).optional().nullable(),WD=x.object({taxonomy:x.object({taskType:x.array(x.string()),intent:x.array(x.stri
ng()),constraints:x.array(x.string()),riskFlags:x.array(x.string())}).optional(),scores:x.object({clarity:x.number(),am
biguity:x.number(),reproducibility:x.number()}).optional(),traits:x.array(x.string()).optional(),suggestions:x.array(x.
string()).optional()}).optional().nullable(),M=$r("prompts",{id:Qt("id").primaryKey().defaultRandom(),userId:Qt("user_i
d").notNull(),createdAt:Dt("created_at").defaultNow().notNull(),lastIngestAt:Dt("last_ingest_at"),site:Ge("site").notNu
ll(),pageUrl:Ge("page_url").notNull(),conversationId:Ge("conversation_id"),promptText:Ge("prompt_text").notNull(),promp
tHash:Ge("prompt_hash").notNull(),deviceId:Ge("device_id").notNull().default("unknown"),clientEventId:Qt("client_event_
id").notNull().defaultRandom(),meta:Oi("meta").$type(),tags:Ge("tags").array(),analysis:Oi("analysis").$type(),isFavori
te:gs("is_favorite").default(!1),isSynced:gs("is_synced").default(!1),deletedAt:Dt("deleted_at")},t=>({deviceEventUniq:
Ns("prompts_device_event_uniq").on(t.deviceId,t.clientEventId),userCreatedIdx:wn("prompts_user_created_idx").on(t.userI
d,t.createdAt),userSiteIdx:wn("prompts_user_site_idx").on(t.userId,t.site),tagsGinIdx:wn("prompts_tags_gin_idx").using(
"gin",t.tags)})),bu=l4(M).omit({id:!0,createdAt:!0,deletedAt:!0,userId:!0}).extend({meta:GD,analysis:WD}),KD=x.object({
email:x.string().email(),password:x.string().min(8)}),XD=x.object({email:x.string().email(),password:x.string().min(8)}
),Kr=$r("extension_status",{id:Qt("id").defaultRandom().primaryKey(),userId:Qt("user_id").notNull(),deviceId:Ge("device
_id").notNull(),pending:Ni("pending").notNull().default(0),failed:Ni("failed").notNull().default(0),sending:Ni("sending
").notNull().default(0),lastRequestId:Ge("last_request_id"),lastSyncAt:Dt("last_sync_at"),lastSyncError:Ge("last_sync_e
rror"),updatedAt:Dt("updated_at").defaultNow().notNull()},t=>({userDeviceUniq:Ns("ext_status_user_device_uniq").on(t.us
erId,t.deviceId),userUpdatedIdx:wn("ext_status_user_updated_idx").on(t.userId,t.updatedAt)})),Ht=$r("extension_commands
",{id:Qt("id").defaultRandom().primaryKey(),userId:Qt("user_id").notNull(),deviceId:Ge("device_id"),command:Ge("command
").notNull(),payload:Oi("payload").$type(),createdAt:Dt("created_at").defaultNow().notNull(),consumedAt:Dt("consumed_at
")},t=>({userCreatedIdx:wn("ext_cmd_user_created_idx").on(t.userId,t.createdAt),userDeviceIdx:wn("ext_cmd_user_device_i
dx").on(t.userId,t.deviceId)}))});var ZD,JD,_e,ie,Su=S(()=>{"use
strict";Q8();Sc();wu();Bs();({Pool:ZD}=Fr);if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL must be set. Did
you forget to provision a database?");JD={connectionString:process.env.DATABASE_URL,max:parseInt(process.env.DB_POOL_MA
X||"10",10),min:parseInt(process.env.DB_POOL_MIN||"2",10),idleTimeoutMillis:parseInt(process.env.DB_POOL_IDLE_TIMEOUT||
"30000",10),connectionTimeoutMillis:parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT||"10000",10)},_e=new
ZD(JD);_e.on("error",t=>{U(`Unexpected error on idle client:
${t?.message||String(t)}`,"db-pool")});ie=du(_e,{schema:Wh})});function Kh(t,e=0,r=100){return
Math.max(e,Math.min(r,t))}function Ui(t){let e=[],r=new Set;for(let n of t){let
i=n.trim();i&&(r.has(i)||(r.add(i),e.push(i)))}return e}function ut(t,e){return e.some(r=>t.includes(r))}function
d4(t){let e=(t||"").trim(),r=e.toLowerCase(),n=[];ut(r,["write code","implement","bug","fix","refactor","typescript","j
avascript","python","react","sql","api"])&&n.push("coding"),ut(r,["explain","what is","difference between","why","how d
oes","teach","tutorial"])&&n.push("study"),ut(r,["summarize","outline","rewrite","edit","polish","proofread"])&&n.push(
"writing"),ut(r,["plan","roadmap","strategy","steps","checklist"])&&n.push("planning"),n.length===0&&n.push("general");
let i=[];(/[?∩╝ƒ]/.test(e)||ut(r,["can you","could you","what","why","how"]))&&i.push("ask"),ut(r,["write","generate","
create","build","make","design","do"])&&i.push("command"),i.length===0&&i.push("statement");let a=[],s=[/\bmust\b[^.\n]
{0,80}/gi,/\bshould\b[^.\n]{0,80}/gi,/\bwithout\b[^.\n]{0,80}/gi,/\binclude\b[^.\n]{0,80}/gi,/\bdo
not\b[^.\n]{0,80}/gi,/\bavoid\b[^.\n]{0,80}/gi];for(let k of s){let E=e.match(k)||[];for(let q of
E)a.push(q.trim())}let o=[];ut(r,["ignore previous","disregard previous","system prompt","reveal your
instructions","jailbreak","bypass","developer message"])&&o.push("prompt-injection"),ut(r,["api
key","password","secret","token","ssh key","credit card"])&&o.push("sensitive-data"),ut(r,["malware","phishing","exploi
t","ransomware","ddos"])&&o.push("harmful-request");let
u=e.length,c=/\n\s*[-*\d+\.]/.test(e),l=ut(r,["context","background","here is","given","assume"])||u>200,p=a.length>0,d
=50;p&&(d+=15),c&&(d+=10),l&&(d+=10),u<30&&(d-=15),u>1200&&(d-=5),o.length>0&&(d-=5);let
f=30;ut(r,["something","anything","whatever","maybe","probably","kind of","a
bit","nice","good","better"])&&(f+=15),p||(f+=10),u<60&&(f+=10),c&&(f-=5);let v=55;l&&(v+=10),p&&(v+=10),ut(r,["exact",
"step-by-step","reproducible","copy-paste","commands"])&&(v+=10),n.includes("coding")&&!ut(r,["typescript","javascript"
,"python","node","react"])&&(v-=10),u<40&&(v-=15),d=Kh(d),f=Kh(f),v=Kh(v);let
b=[];(c||ut(r,["checklist","steps","criteria","definition of done"]))&&b.push("structured"),p&&b.push("constraint-drive
n"),u>500&&b.push("context-rich"),u<80&&b.push("context-light"),o.length>0&&b.push("adversarial");let _=[];return
n.includes("coding")&&!ut(r,["input","output","example","requirements"])&&_.push("Add an input/output example and edge
cases."),p||_.push("Add explicit constraints (format, length, must/avoid)."),l||_.push("Add minimal context (goal,
audience, environment)."),o.includes("prompt-injection")&&_.push("Remove instructions that override system/developer me
ssages."),{taxonomy:{taskType:Ui(n),intent:Ui(i),constraints:Ui(a).slice(0,8),riskFlags:Ui(o)},scores:{clarity:d,ambigu
ity:f,reproducibility:v},traits:Ui(b),suggestions:Ui(_).slice(0,6)}}var f4=S(()=>{"use strict"});var
Xh,be,Zh=S(()=>{"use strict";Su();wu();Gh();f4();Xh=class{async getPrompts(e,r){let n=[ee(M.userId,e),g`${M.deletedAt}
IS NULL`],i=[];if(r?.search&&i.push($c(M.promptText,`%${r.search}%`)),r?.site&&r.site!=="all"&&i.push(ee(M.site,r.site)
),r?.tag&&r.tag!=="all"&&i.push(g`${M.tags} @> ARRAY[${r.tag}]::text[]`),r?.taskType&&r.taskType!=="all"){let
d=JSON.stringify({taxonomy:{taskType:[r.taskType]}});i.push(g`${M.analysis} @>
${d}::jsonb`)}if(r?.intent&&r.intent!=="all"){let
d=JSON.stringify({taxonomy:{intent:[r.intent]}});i.push(g`${M.analysis} @>
${d}::jsonb`)}if(r?.riskFlag&&r.riskFlag!=="all"){let
d=JSON.stringify({taxonomy:{riskFlags:[r.riskFlag]}});i.push(g`${M.analysis} @> ${d}::jsonb`)}let
a=Math.min(Math.max(r?.limit??24,1),200),s=Math.max(r?.offset??0,0),o=[...n,...i],u=Ke(...o),[{count:c}]=await ie.selec
t({count:g`count(*)`}).from(M).where(u),l=r?.sortBy==="clarity"?zr(g`COALESCE((${M.analysis}->'scores'->>'clarity')::nu
meric, 0)`):zr(M.createdAt);return{items:await
ie.select().from(M).where(u).orderBy(l).limit(a).offset(s),total:Number(c??0),limit:a,offset:s}}async
getPrompt(e,r){let[n]=await ie.select().from(M).where(Ke(ee(M.id,r),ee(M.userId,e)));return n}async
createPrompt(e,r){let n=new Date;r.analysis||(r.analysis=d4(r.promptText));let i=await ie.insert(M).values({...r,userId
:e}).onConflictDoNothing({target:[M.deviceId,M.clientEventId]}).returning();if(i.length)return await
ie.update(Y).set({lastIngestAt:n}).where(ee(Y.id,e)),i[0];let a=r.deviceId||"unknown",s=r.clientEventId||"",[o]=await
ie.select().from(M).where(Ke(ee(M.deviceId,a),ee(M.clientEventId,s),ee(M.userId,e)));if(o)return await
ie.update(Y).set({lastIngestAt:n}).where(ee(Y.id,e)),o;let[u]=await
ie.insert(M).values({...r,userId:e}).returning();return await
ie.update(Y).set({lastIngestAt:n}).where(ee(Y.id,e)),u}async upsertExtensionStatus(e,r){let n=new Date;await ie.insert(
Kr).values({userId:e,deviceId:r.deviceId,pending:Math.max(0,Math.floor(r.pending||0)),failed:Math.max(0,Math.floor(r.fa
iled||0)),sending:Math.max(0,Math.floor(r.sending||0)),lastRequestId:r.lastRequestId??null,lastSyncAt:r.lastSyncAt?new
Date(r.lastSyncAt):null,lastSyncError:r.lastSyncError??null,updatedAt:n}).onConflictDoUpdate({target:[Kr.userId,Kr.devi
ceId],set:{pending:Math.max(0,Math.floor(r.pending||0)),failed:Math.max(0,Math.floor(r.failed||0)),sending:Math.max(0,M
ath.floor(r.sending||0)),lastRequestId:r.lastRequestId??null,lastSyncAt:r.lastSyncAt?new
Date(r.lastSyncAt):null,lastSyncError:r.lastSyncError??null,updatedAt:n}})}async getExtensionStatus(e){return(await ie.
select().from(Kr).where(ee(Kr.userId,e)).orderBy(zr(Kr.updatedAt))).map(n=>({deviceId:n.deviceId,pending:n.pending,fail
ed:n.failed,sending:n.sending,lastRequestId:n.lastRequestId??null,lastSyncAt:n.lastSyncAt?n.lastSyncAt.toISOString():nu
ll,lastSyncError:n.lastSyncError??null,updatedAt:n.updatedAt.toISOString()}))}async
enqueueExtensionCommand(e,r,n,i){await
ie.insert(Ht).values({userId:e,deviceId:n??null,command:r,payload:i??null})}async consumeExtensionCommands(e,r){let
n=new Date,i=await ie.select().from(Ht).where(Ke(ee(Ht.userId,e),g`${Ht.consumedAt} IS NULL`,g`(${Ht.deviceId} IS NULL
OR ${Ht.deviceId} = ${r})`)).orderBy(zc(Ht.createdAt)).limit(20);if(!i.length)return[];let a=i.map(s=>s.id);return
await ie.update(Ht).set({consumedAt:n}).where(g`${Ht.id} =
ANY(${a}::uuid[])`),i.map(s=>({id:s.id,command:s.command,payload:s.payload}))}async updatePrompt(e,r,n){let[i]=await
ie.update(M).set(n).where(Ke(ee(M.id,r),ee(M.userId,e))).returning();return i}async deletePrompt(e,r){await
ie.delete(M).where(Ke(ee(M.id,r),ee(M.userId,e)))}async getTags(e){let r=await
ie.select({tags:M.tags}).from(M).where(Ke(ee(M.userId,e),g`${M.deletedAt} IS NULL`)),n=new Set;for(let i of
r)(i.tags??[]).forEach(a=>{typeof a=="string"&&a.trim()&&n.add(a.trim())});return
Array.from(n).sort((i,a)=>i.localeCompare(a))}async getTaxonomy(e){let r=await
ie.select({analysis:M.analysis}).from(M).where(Ke(ee(M.userId,e),g`${M.deletedAt} IS NULL`)),n=new Set,i=new Set,a=new
Set;for(let s of r){let u=s.analysis?.taxonomy;(u?.taskType??[]).forEach(c=>c&&n.add(c)),(u?.intent??[]).forEach(c=>c&&
i.add(c)),(u?.riskFlags??[]).forEach(c=>c&&a.add(c))}return{taskTypes:Array.from(n).sort(),intents:Array.from(i).sort()
,riskFlags:Array.from(a).sort()}}async getAccountStatus(e){let[r]=await
ie.select({lastIngestAt:Y.lastIngestAt}).from(Y).where(ee(Y.id,e)),[n]=await
ie.select({count:g`count(*)`.mapWith(Number)}).from(M).where(Ke(ee(M.userId,e),g`${M.deletedAt} IS
NULL`));return{totalPrompts:n?.count??0,lastIngestAt:r?.lastIngestAt?r.lastIngestAt.toISOString():null}}async
getAnalyticsSummary(e){let r=await ie.select().from(M).where(Ke(ee(M.userId,e),g`${M.deletedAt} IS
NULL`)),n=r.length,i={},a=0,s=new Set;r.forEach(c=>{i[c.site]=(i[c.site]||0)+1,typeof
c.analysis?.scores?.clarity=="number"&&(a+=c.analysis.scores.clarity),c.analysis?.traits?.forEach(l=>s.add(l))});let o=
n>0?Math.round(a/n):0,u=Array.from(s).slice(0,5);return{totalPrompts:n,bySite:i,averageClarity:o,recentTraits:u}}async
createUser(e,r,n){let[i]=await
ie.insert(Y).values({email:e,passwordHash:r,apiToken:n}).returning({id:Y.id,email:Y.email,apiToken:Y.apiToken});return
i}async getUserByEmail(e){let[r]=await
ie.select({id:Y.id,email:Y.email,passwordHash:Y.passwordHash,apiToken:Y.apiToken}).from(Y).where(ee(Y.email,e));return
r}async getUserByToken(e){let[r]=await
ie.select({id:Y.id,email:Y.email,apiToken:Y.apiToken}).from(Y).where(ee(Y.apiToken,e));return r}async
getUserById(e){let[r]=await ie.select({id:Y.id,email:Y.email,apiToken:Y.apiToken}).from(Y).where(ee(Y.id,e));return
r}async rotateUserToken(e,r){let[n]=await
ie.update(Y).set({apiToken:r}).where(ee(Y.id,e)).returning({apiToken:Y.apiToken});return n?.apiToken??r}async
exportUserPromptsJson(e){let r=await ie.select().from(M).where(Ke(ee(M.userId,e),g`${M.deletedAt} IS
NULL`)).orderBy(zr(M.createdAt));return{exportedAt:new Date().toISOString(),prompts:r}}async
exportUserPromptsCsv(e){let r=await ie.select().from(M).where(Ke(ee(M.userId,e),g`${M.deletedAt} IS NULL`)).orderBy(zr(
M.createdAt)),n=["id","createdAt","site","pageUrl","promptText","tags","deviceId","clientEventId"].join(","),i=s=>{let
o=String(s??""),u=/[",\n]/.test(o),c=o.replace(/"/g,'""');return u?`"${c}"`:c},a=r.map(s=>[s.id,s.createdAt?.toISOStrin
g?.()??s.createdAt,s.site,s.pageUrl,s.promptText,(s.tags??[]).join("|"),s.deviceId,s.clientEventId].map(i).join(","));r
eturn[n,...a].join(`










Error: DATABASE_URL must be set. Did you forget to provision a database?
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:70:108948
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:1:225
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:70:112400
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:1:225
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:104:5108
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:1:225
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:195:924
    at C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:1:225
    at Object.<anonymous>
(C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\dist\index.cjs:195:3679)
    at Module._compile (node:internal/modules/cjs/loader:1761:14)

Node.js v24.12.0
Γ¥î Smoke test failed: TypeError: fetch failed
    at node:internal/deps/undici/undici:15845:13
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async waitForHealth
(C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\backend\script\smoke.cjs:19:19)
    at async main
(C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner\SPR_stage20_build\backend\script\smoke.cjs:49:5)
EXIT_CODE: 1
FAIL_STEP: npm run test:smoke
SUMMARY: FAIL


---
# CI RUN (Manual) — 2026-01-11 10:00:54

CWD: C:\Users\Tigri\OneDrive\Documents\GitHub\SelfPromptLearner

ENV: node=v24.12.0

Docker: Docker version 29.1.3, build f52814d


Commands (real):
- Set-Location repo root
- Push-Location SPR_stage20_build
- docker compose up -d
- set DATABASE_URL (postgres://postgres:postgres@localhost:<mapped_port>/postgres)
- npm.cmd ci
- npm.cmd run test:smoke

SUMMARY: PASS (no error block printed)

