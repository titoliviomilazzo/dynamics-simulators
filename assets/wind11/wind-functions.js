(function(root){
  'use strict';
  const mod=x=>((x%1)+1)%1;
  function gustAt(t,intensity){return 1+intensity*(.23*Math.sin(t*1.7)+.13*Math.sin(t*3.8+.7));}
  function travelAt(t,intensity){return t+intensity*(.23*(1-Math.cos(t*1.7))/1.7+.13*(Math.cos(.7)-Math.cos(t*3.8+.7))/3.8);}
  function gustStyle(t,intensity){
    const pulse=intensity*(.55+.45*Math.pow(Math.sin(t*2.4),2));
    return {pulse,packetWidth:.07+intensity*.62,packetOpacity:intensity*(.48+.28*pulse),pressureOpacity:.04+intensity*(.34+.38*pulse),speedScale:1+intensity*1.8,headScale:1+intensity*1.5};
  }
  function pointAt(t,lane,segment,width,height,speed,intensity,drift){
    const phase=mod(lane*.61803398875+travelAt(t,intensity)*.11*speed-segment*.008);
    const x=(phase-.5)*width*7;
    const y=height*(.07+mod(lane*.381966)*.93)+.14*Math.sin(t*2+lane);
    const rawZ=(mod(lane*.75487766)-.5)*width*3;
    const side=rawZ<0?-1:1,extra=Math.max(0,width*.5+1.1-Math.abs(rawZ));
    const s=Math.max(0,Math.min(1,y/height)),relativeX=x-drift*(1.5*s*s-.5*s*s*s);
    // An obstacle-shaped illustration, not a fluid solver. Finite segments stay outside the box.
    const band=Math.abs(relativeX)<width*.5+.7?1:Math.exp(-Math.pow((Math.abs(relativeX)-width*.5-.7)/(width*.6),2));
    const z=rawZ+side*extra*band;
    return [x,y,z];
  }
  const api={mod,gustAt,travelAt,gustStyle,pointAt};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WindIllustration=api;
})(typeof globalThis!=='undefined'?globalThis:this);
