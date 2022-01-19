"use strict";(self.webpackChunkrocket=self.webpackChunkrocket||[]).push([[325],{999:(R,b,c)=>{c.d(b,{z:()=>_});class _{constructor(h,a,f){this.constants=h,this.config=a,this.subject=f}get emptyRocketMass(){return this.config.rocketWeight/1e3}get initialWaterVolume0(){return this.config.waterAmount/1e3}get initialWaterMass0(){return this.initialWaterVolume0*this.constants.rhoWater}get pressureTankVolume(){return this.config.tankVolume/1e3}get initialPressure0(){return 1e5*this.config.initialPressure}get initialAirVolume0(){return Math.max(this.pressureTankVolume-this.initialWaterVolume0,0)*Math.pow(this.initialPressure0/this.constants.pAmb,1/this.constants.gammaAir)}get initialAirMass0(){return this.initialAirVolume0*this.constants.rhoAir}get totalMass0(){return this.emptyRocketMass+this.initialWaterMass0+this.initialAirMass0}get nozzleArea(){return Math.PI*Math.pow(this.config.nozzleDiameter/1e3/2,2)}get rocketArea(){return Math.PI*Math.pow(this.config.rocketDiameter/1e3/2,2)}get currentWaterVolume(){return Math.max((this.mass-this.emptyRocketMass-this.initialAirMass0)/this.constants.rhoWater,0)}computeWaterThrust(h,a){const f=this.initialPressure0*Math.pow((this.pressureTankVolume-this.initialWaterVolume0)/(this.pressureTankVolume-this.currentWaterVolume),this.constants.gammaAir);if(f<=this.constants.pAmb)return 0;const E=Math.sqrt(2*(f-this.constants.pAmb)/this.constants.rhoWater),T=this.nozzleArea*E*this.constants.rhoWater,v=T*E;return this.mass-=T*h,a.pressure=f/1e5,a.flowVelocity=E,a.massFlowRate=T,v}computeAirThrust(h,a){const E=this.initialPressure0*Math.pow((this.pressureTankVolume-this.initialWaterVolume0)/(this.pressureTankVolume-this.currentWaterVolume+this.expelledAirMass/this.constants.rhoAir),this.constants.gammaAir);if(E<=this.constants.pAmb)return 0;const T=Math.sqrt(2*(E-this.constants.pAmb)/this.constants.rhoAir),v=this.nozzleArea*T*this.constants.rhoAir,l=v*T;return this.mass-=v*h,this.expelledAirMass+=v*h,a.pressure=E/1e5,a.flowVelocity=T,a.massFlowRate=v,l}get gravityForce(){return this.mass*this.constants.g}get dragForce(){return this.config.dragCoefficient*this.rocketArea*.5*this.constants.rhoAir*Math.pow(this.velocity,2)}init(){this.time=0,this.height=0,this.velocity=0,this.expelledAirMass=0,this.mass=this.totalMass0}tick(h){const a={time:this.time,mass:0,height:0,thrust:0,pressure:0,velocity:0,acceleration:0,flowVelocity:0,massFlowRate:0};let f=0;return this.mass>this.emptyRocketMass+this.initialAirMass0?f=this.computeWaterThrust(h,a):this.emptyRocketMass<this.mass&&this.mass<this.emptyRocketMass+this.initialAirMass0&&(f=this.computeAirThrust(h,a)),a.acceleration=(f-this.gravityForce-this.dragForce)/this.mass,this.velocity+=a.acceleration*h,this.height+=this.velocity*h,a.mass=1e3*this.mass,a.thrust=f,a.height=this.height,a.velocity=this.velocity,a}computeSteps(){const h=[];for(let f=0;f<1e5;f++){const E=this.tick(this.config.timeStep);if(this.subject.next(E),this.time+=this.config.timeStep,h.push(E),E.height<0)return h}return h}searchMaxHeight(h){let a=-1/0;return h.forEach(f=>{a=Math.max(f.height,a)}),a}execute(){this.init();const h=this.computeSteps();return{maxHeight:this.searchMaxHeight(h),duration:this.time}}}},395:(R,b,c)=>{c.d(b,{TQ:()=>_,A:()=>m,JM:()=>h});const _=a("C",void 0,void 0);function m(f){return a("E",void 0,f)}function h(f){return a("N",f,void 0)}function a(f,E,T){return{kind:f,value:E,error:T}}},751:(R,b,c)=>{c.d(b,{y:()=>v});var _=c(934),m=c(921),h=c(822),a=c(635),f=c(416),E=c(576),T=c(806);let v=(()=>{class P{constructor(S){S&&(this._subscribe=S)}lift(S){const D=new P;return D.source=this,D.operator=S,D}subscribe(S,D,M){const O=function w(P){return P&&P instanceof _.Lv||function i(P){return P&&(0,E.m)(P.next)&&(0,E.m)(P.error)&&(0,E.m)(P.complete)}(P)&&(0,m.Nn)(P)}(S)?S:new _.Hp(S,D,M);return(0,T.x)(()=>{const{operator:x,source:I}=this;O.add(x?x.call(O,I):I?this._subscribe(O):this._trySubscribe(O))}),O}_trySubscribe(S){try{return this._subscribe(S)}catch(D){S.error(D)}}forEach(S,D){return new(D=l(D))((M,O)=>{let x;x=this.subscribe(I=>{try{S(I)}catch(U){O(U),null==x||x.unsubscribe()}},O,M)})}_subscribe(S){var D;return null===(D=this.source)||void 0===D?void 0:D.subscribe(S)}[h.L](){return this}pipe(...S){return(0,a.U)(S)(this)}toPromise(S){return new(S=l(S))((D,M)=>{let O;this.subscribe(x=>O=x,x=>M(x),()=>D(O))})}}return P.create=A=>new P(A),P})();function l(P){var A;return null!==(A=null!=P?P:f.v.Promise)&&void 0!==A?A:Promise}},758:(R,b,c)=>{c.d(b,{x:()=>E});var _=c(751),m=c(921),h=c(448),a=c(737),f=c(806);let E=(()=>{class v extends _.y{constructor(){super(),this.closed=!1,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(i){const w=new T(this,this);return w.operator=i,w}_throwIfClosed(){if(this.closed)throw new h.N}next(i){(0,f.x)(()=>{if(this._throwIfClosed(),!this.isStopped){const w=this.observers.slice();for(const P of w)P.next(i)}})}error(i){(0,f.x)(()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=i;const{observers:w}=this;for(;w.length;)w.shift().error(i)}})}complete(){(0,f.x)(()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;const{observers:i}=this;for(;i.length;)i.shift().complete()}})}unsubscribe(){this.isStopped=this.closed=!0,this.observers=null}get observed(){var i;return(null===(i=this.observers)||void 0===i?void 0:i.length)>0}_trySubscribe(i){return this._throwIfClosed(),super._trySubscribe(i)}_subscribe(i){return this._throwIfClosed(),this._checkFinalizedStatuses(i),this._innerSubscribe(i)}_innerSubscribe(i){const{hasError:w,isStopped:P,observers:A}=this;return w||P?m.Lc:(A.push(i),new m.w0(()=>(0,a.P)(A,i)))}_checkFinalizedStatuses(i){const{hasError:w,thrownError:P,isStopped:A}=this;w?i.error(P):A&&i.complete()}asObservable(){const i=new _.y;return i.source=this,i}}return v.create=(l,i)=>new T(l,i),v})();class T extends E{constructor(l,i){super(),this.destination=l,this.source=i}next(l){var i,w;null===(w=null===(i=this.destination)||void 0===i?void 0:i.next)||void 0===w||w.call(i,l)}error(l){var i,w;null===(w=null===(i=this.destination)||void 0===i?void 0:i.error)||void 0===w||w.call(i,l)}complete(){var l,i;null===(i=null===(l=this.destination)||void 0===l?void 0:l.complete)||void 0===i||i.call(l)}_subscribe(l){var i,w;return null!==(w=null===(i=this.source)||void 0===i?void 0:i.subscribe(l))&&void 0!==w?w:m.Lc}}},934:(R,b,c)=>{c.d(b,{Lv:()=>l,Hp:()=>i});var _=c(576),m=c(921),h=c(416),a=c(849),f=c(32),E=c(395),T=c(410),v=c(806);class l extends m.w0{constructor(M){super(),this.isStopped=!1,M?(this.destination=M,(0,m.Nn)(M)&&M.add(this)):this.destination=S}static create(M,O,x){return new i(M,O,x)}next(M){this.isStopped?A((0,E.JM)(M),this):this._next(M)}error(M){this.isStopped?A((0,E.A)(M),this):(this.isStopped=!0,this._error(M))}complete(){this.isStopped?A(E.TQ,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(M){this.destination.next(M)}_error(M){try{this.destination.error(M)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}}class i extends l{constructor(M,O,x){let I;if(super(),(0,_.m)(M))I=M;else if(M){let U;({next:I,error:O,complete:x}=M),this&&h.v.useDeprecatedNextContext?(U=Object.create(M),U.unsubscribe=()=>this.unsubscribe()):U=M,I=null==I?void 0:I.bind(U),O=null==O?void 0:O.bind(U),x=null==x?void 0:x.bind(U)}this.destination={next:I?w(I):f.Z,error:w(null!=O?O:P),complete:x?w(x):f.Z}}}function w(D,M){return(...O)=>{try{D(...O)}catch(x){h.v.useDeprecatedSynchronousErrorHandling?(0,v.O)(x):(0,a.h)(x)}}}function P(D){throw D}function A(D,M){const{onStoppedNotification:O}=h.v;O&&T.z.setTimeout(()=>O(D,M))}const S={closed:!0,next:f.Z,error:P,complete:f.Z}},921:(R,b,c)=>{c.d(b,{w0:()=>a,Lc:()=>f,Nn:()=>E});var _=c(576),m=c(896),h=c(737);class a{constructor(l){this.initialTeardown=l,this.closed=!1,this._parentage=null,this._teardowns=null}unsubscribe(){let l;if(!this.closed){this.closed=!0;const{_parentage:i}=this;if(i)if(this._parentage=null,Array.isArray(i))for(const A of i)A.remove(this);else i.remove(this);const{initialTeardown:w}=this;if((0,_.m)(w))try{w()}catch(A){l=A instanceof m.B?A.errors:[A]}const{_teardowns:P}=this;if(P){this._teardowns=null;for(const A of P)try{T(A)}catch(S){l=null!=l?l:[],S instanceof m.B?l=[...l,...S.errors]:l.push(S)}}if(l)throw new m.B(l)}}add(l){var i;if(l&&l!==this)if(this.closed)T(l);else{if(l instanceof a){if(l.closed||l._hasParent(this))return;l._addParent(this)}(this._teardowns=null!==(i=this._teardowns)&&void 0!==i?i:[]).push(l)}}_hasParent(l){const{_parentage:i}=this;return i===l||Array.isArray(i)&&i.includes(l)}_addParent(l){const{_parentage:i}=this;this._parentage=Array.isArray(i)?(i.push(l),i):i?[i,l]:l}_removeParent(l){const{_parentage:i}=this;i===l?this._parentage=null:Array.isArray(i)&&(0,h.P)(i,l)}remove(l){const{_teardowns:i}=this;i&&(0,h.P)(i,l),l instanceof a&&l._removeParent(this)}}a.EMPTY=(()=>{const v=new a;return v.closed=!0,v})();const f=a.EMPTY;function E(v){return v instanceof a||v&&"closed"in v&&(0,_.m)(v.remove)&&(0,_.m)(v.add)&&(0,_.m)(v.unsubscribe)}function T(v){(0,_.m)(v)?v():v.unsubscribe()}},416:(R,b,c)=>{c.d(b,{v:()=>_});const _={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1}},410:(R,b,c)=>{c.d(b,{z:()=>_});const _={setTimeout(...m){const{delegate:h}=_;return((null==h?void 0:h.setTimeout)||setTimeout)(...m)},clearTimeout(m){const{delegate:h}=_;return((null==h?void 0:h.clearTimeout)||clearTimeout)(m)},delegate:void 0}},822:(R,b,c)=>{c.d(b,{L:()=>_});const _="function"==typeof Symbol&&Symbol.observable||"@@observable"},448:(R,b,c)=>{c.d(b,{N:()=>m});const m=(0,c(888).d)(h=>function(){h(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"})},896:(R,b,c)=>{c.d(b,{B:()=>m});const m=(0,c(888).d)(h=>function(f){h(this),this.message=f?`${f.length} errors occurred during unsubscription:\n${f.map((E,T)=>`${T+1}) ${E.toString()}`).join("\n  ")}`:"",this.name="UnsubscriptionError",this.errors=f})},737:(R,b,c)=>{function _(m,h){if(m){const a=m.indexOf(h);0<=a&&m.splice(a,1)}}c.d(b,{P:()=>_})},888:(R,b,c)=>{function _(m){const a=m(f=>{Error.call(f),f.stack=(new Error).stack});return a.prototype=Object.create(Error.prototype),a.prototype.constructor=a,a}c.d(b,{d:()=>_})},806:(R,b,c)=>{c.d(b,{x:()=>h,O:()=>a});var _=c(416);let m=null;function h(f){if(_.v.useDeprecatedSynchronousErrorHandling){const E=!m;if(E&&(m={errorThrown:!1,error:null}),f(),E){const{errorThrown:T,error:v}=m;if(m=null,T)throw v}}else f()}function a(f){_.v.useDeprecatedSynchronousErrorHandling&&m&&(m.errorThrown=!0,m.error=f)}},671:(R,b,c)=>{function _(m){return m}c.d(b,{y:()=>_})},576:(R,b,c)=>{function _(m){return"function"==typeof m}c.d(b,{m:()=>_})},32:(R,b,c)=>{function _(){}c.d(b,{Z:()=>_})},635:(R,b,c)=>{c.d(b,{U:()=>h});var _=c(671);function h(a){return 0===a.length?_.y:1===a.length?a[0]:function(E){return a.reduce((T,v)=>v(T),E)}}},849:(R,b,c)=>{c.d(b,{h:()=>h});var _=c(416),m=c(410);function h(a){m.z.setTimeout(()=>{const{onUnhandledError:f}=_.v;if(!f)throw a;f(a)})}},655:(R,b,c)=>{function v(t,e,r,n){return new(r||(r=Promise))(function(s,d){function g(C){try{p(n.next(C))}catch(K){d(K)}}function L(C){try{p(n.throw(C))}catch(K){d(K)}}function p(C){C.done?s(C.value):function o(s){return s instanceof r?s:new r(function(d){d(s)})}(C.value).then(g,L)}p((n=n.apply(t,e||[])).next())})}c.d(b,{mG:()=>v})},841:(R,b,c)=>{c.d(b,{Jj:()=>l});const _=Symbol("Comlink.proxy"),m=Symbol("Comlink.endpoint"),h=Symbol("Comlink.releaseProxy"),a=Symbol("Comlink.thrown"),f=u=>"object"==typeof u&&null!==u||"function"==typeof u,v=new Map([["proxy",{canHandle:u=>f(u)&&u[_],serialize(u){const{port1:y,port2:t}=new MessageChannel;return l(u,y),[t,[t]]},deserialize:u=>(u.start(),function P(u,y){return S(u,[],y)}(u))}],["throw",{canHandle:u=>f(u)&&a in u,serialize({value:u}){let y;return y=u instanceof Error?{isError:!0,value:{message:u.message,name:u.name,stack:u.stack}}:{isError:!1,value:u},[y,[]]},deserialize(u){throw u.isError?Object.assign(new Error(u.value.message),u.value):u.value}}]]);function l(u,y=self){y.addEventListener("message",function t(e){if(!e||!e.data)return;const{id:r,type:n,path:o}=Object.assign({path:[]},e.data),s=(e.data.argumentList||[]).map(j);let d;try{const g=o.slice(0,-1).reduce((p,C)=>p[C],u),L=o.reduce((p,C)=>p[C],u);switch(n){case"GET":d=L;break;case"SET":g[o.slice(-1)[0]]=j(e.data.value),d=!0;break;case"APPLY":d=L.apply(g,s);break;case"CONSTRUCT":d=function I(u){return Object.assign(u,{[_]:!0})}(new L(...s));break;case"ENDPOINT":{const{port1:p,port2:C}=new MessageChannel;l(u,C),d=function x(u,y){return O.set(u,y),u}(p,[p])}break;case"RELEASE":d=void 0;break;default:return}}catch(g){d={value:g,[a]:0}}Promise.resolve(d).catch(g=>({value:g,[a]:0})).then(g=>{const[L,p]=k(g);y.postMessage(Object.assign(Object.assign({},L),{id:r}),p),"RELEASE"===n&&(y.removeEventListener("message",t),w(y))})}),y.start&&y.start()}function w(u){(function i(u){return"MessagePort"===u.constructor.name})(u)&&u.close()}function A(u){if(u)throw new Error("Proxy has been released and is not useable")}function S(u,y=[],t=function(){}){let e=!1;const r=new Proxy(t,{get(n,o){if(A(e),o===h)return()=>B(u,{type:"RELEASE",path:y.map(s=>s.toString())}).then(()=>{w(u),e=!0});if("then"===o){if(0===y.length)return{then:()=>r};const s=B(u,{type:"GET",path:y.map(d=>d.toString())}).then(j);return s.then.bind(s)}return S(u,[...y,o])},set(n,o,s){A(e);const[d,g]=k(s);return B(u,{type:"SET",path:[...y,o].map(L=>L.toString()),value:d},g).then(j)},apply(n,o,s){A(e);const d=y[y.length-1];if(d===m)return B(u,{type:"ENDPOINT"}).then(j);if("bind"===d)return S(u,y.slice(0,-1));const[g,L]=M(s);return B(u,{type:"APPLY",path:y.map(p=>p.toString()),argumentList:g},L).then(j)},construct(n,o){A(e);const[s,d]=M(o);return B(u,{type:"CONSTRUCT",path:y.map(g=>g.toString()),argumentList:s},d).then(j)}});return r}function D(u){return Array.prototype.concat.apply([],u)}function M(u){const y=u.map(k);return[y.map(t=>t[0]),D(y.map(t=>t[1]))]}const O=new WeakMap;function k(u){for(const[y,t]of v)if(t.canHandle(u)){const[e,r]=t.serialize(u);return[{type:"HANDLER",name:y,value:e},r]}return[{type:"RAW",value:u},O.get(u)||[]]}function j(u){switch(u.type){case"HANDLER":return v.get(u.name).deserialize(u.value);case"RAW":return u.value}}function B(u,y,t){return new Promise(e=>{const r=function N(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}();u.addEventListener("message",function n(o){!o.data||!o.data.id||o.data.id!==r||(u.removeEventListener("message",n),e(o.data))}),u.start&&u.start(),u.postMessage(Object.assign({id:r},y),t)})}}}]);