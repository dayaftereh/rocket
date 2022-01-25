(()=>{"use strict";var t,w={820:(t,i,n)=>{var h=n(841),r=n(655),u=n(758),c=n(999);class f{constructor(s,o,p){this.constants=s,this.config=o,this.subject=p}get waterAmountMinimum(){return Math.min(this.config.waterAmountMinimum,this.config.base.tankVolume)}get waterAmountMaximum(){return Math.min(this.config.waterAmountMaximum,this.config.base.tankVolume)}get nozzleSteps(){const s=this.config.nozzleDiameterMaximum-this.config.nozzleDiameterMinimum;return Math.abs(s)<.001?1:Math.ceil(s/this.config.nozzleDiameterStep)+1}get waterAmountSteps(){const s=this.waterAmountMaximum-this.waterAmountMinimum;return Math.abs(s)<.001?1:Math.ceil(s/this.config.waterAmountStep)+1}get singleRunCount(){return this.waterAmountSteps*this.nozzleSteps}createSingleSimulationConfig(s,o){return Object.assign({},this.config.base,{waterAmount:s,nozzleDiameter:o})}compute(s,o){const p=this.createSingleSimulationConfig(s,o),v=new u.x,l=new c.z(this.constants,p,v).execute();return{config:p,duration:l.duration,maxHeight:l.maxHeight}}execute(){const s=[];let o=this.config.nozzleDiameterMinimum;const p=this.singleRunCount;for(let m=0;m<this.nozzleSteps;m++){let l=this.waterAmountMinimum;for(let b=0;b<this.waterAmountSteps;b++){const d=this.compute(l,o);d.progress=(m*this.waterAmountSteps+b)/p,s.push(d),this.subject.next(d),l=Math.min(l+this.config.waterAmountStep,this.waterAmountMaximum)}o+=this.config.nozzleDiameterStep}return s.sort((m,l)=>l.maxHeight-m.maxHeight).slice(0,this.config.limit)}}h.Jj(class a{constructor(){this.subject=new u.x}compute(s,o){return(0,r.mG)(this,void 0,void 0,function*(){return new f(s,o,this.subject).execute()})}subscribe(s){return(0,r.mG)(this,void 0,void 0,function*(){this.subject.subscribe(o=>(0,r.mG)(this,void 0,void 0,function*(){s&&(yield s(o))}))})}})}},x={};function e(t){var i=x[t];if(void 0!==i)return i.exports;var n=x[t]={exports:{}};return w[t](n,n.exports,e),n.exports}e.m=w,e.x=()=>{var t=e.O(void 0,[518,670],()=>e(820));return e.O(t)},t=[],e.O=(i,n,h,r)=>{if(!n){var c=1/0;for(u=0;u<t.length;u++){for(var[n,h,r]=t[u],f=!0,a=0;a<n.length;a++)(!1&r||c>=r)&&Object.keys(e.O).every(m=>e.O[m](n[a]))?n.splice(a--,1):(f=!1,r<c&&(c=r));if(f){t.splice(u--,1);var g=h();void 0!==g&&(i=g)}}return i}r=r||0;for(var u=t.length;u>0&&t[u-1][2]>r;u--)t[u]=t[u-1];t[u]=[n,h,r]},e.d=(t,i)=>{for(var n in i)e.o(i,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:i[n]})},e.f={},e.e=t=>Promise.all(Object.keys(e.f).reduce((i,n)=>(e.f[n](t,i),i),[])),e.u=t=>t+"."+{518:"6f5d7958135167b4",670:"e9d9f95380952d64"}[t]+".js",e.miniCssF=t=>{},e.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),(()=>{var t;e.tu=i=>(void 0===t&&(t={createScriptURL:n=>n},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(t=trustedTypes.createPolicy("angular#bundler",t))),t.createScriptURL(i))})(),e.p="",(()=>{var t={571:1};e.f.i=(r,u)=>{t[r]||importScripts(e.tu(e.p+e.u(r)))};var n=self.webpackChunkrocket=self.webpackChunkrocket||[],h=n.push.bind(n);n.push=r=>{var[u,c,f]=r;for(var a in c)e.o(c,a)&&(e.m[a]=c[a]);for(f&&f(e);u.length;)t[u.pop()]=1;h(r)}})(),(()=>{var t=e.x;e.x=()=>Promise.all([e.e(518),e.e(670)]).then(t)})(),e.x()})();