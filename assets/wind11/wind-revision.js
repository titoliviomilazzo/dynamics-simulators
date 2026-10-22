'use strict';
// Preserve the original model, view switches and charts; add wind illustration separately.
const W=WindIllustration;
let windSceneFX=null,visualTime=0,visualPaused=false,recordingWind=false,lastWindStamp=0;
let windLines,windWake,windPackets,windHeads=[],windPanels=[],windColumns=[],windSkins=[],windGap=0;
const pressureCalm=new THREE.Color(0x0891b2),pressureGust=new THREE.Color(0xf59e0b),packetCount=8,packetSegments=12;
let movieRenderer,movieCamera,exportCharts=[];
const windSegments=9,windLanes=112,originalRebuild=rebuildThreeBuilding,originalAnalysis=updateAnalysis;
const scratchLower=new THREE.Vector3(),scratchUpper=new THREE.Vector3(),scratchDir=new THREE.Vector3(),postUp=new THREE.Vector3(0,1,0);
function releaseGroup(group){if(!group)return;const geo=new Set(),mat=new Set(),tex=new Set();group.traverse(o=>{if(o.geometry)geo.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{mat.add(m);if(m.map)tex.add(m.map);});});geo.forEach(g=>g.dispose());mat.forEach(m=>m.dispose());tex.forEach(t=>t.dispose());}
function prepareWindFX(){
  if(windSceneFX){threeScene.remove(windSceneFX);releaseGroup(windSceneFX);}
  windSceneFX=new THREE.Group();windSceneFX.name='illustrative-wind';threeScene.add(windSceneFX);windHeads=[];windPanels=[];windColumns=[];windSkins=[];
  const positions=new Float32Array(windLanes*(windSegments-1)*6),colors=new Float32Array(positions.length);
  const cyan=new THREE.Color(0x0891b2),pale=new THREE.Color(0x9ddde5);
  for(let i=0;i<windLanes;i++)for(let k=0;k<windSegments-1;k++)for(let endpoint=0;endpoint<2;endpoint++){
    const mix=.18+.75*k/(windSegments-1),index=(i*(windSegments-1)*2+k*2+endpoint)*3;
    colors[index]=pale.r*(1-mix)+cyan.r*mix;colors[index+1]=pale.g*(1-mix)+cyan.g*mix;colors[index+2]=pale.b*(1-mix)+cyan.b*mix;
  }
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.BufferAttribute(positions,3));geom.setAttribute('color',new THREE.BufferAttribute(colors,3));
  windLines=new THREE.LineSegments(geom,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.85}));windLines.frustumCulled=false;windSceneFX.add(windLines);
  const packetGeo=new THREE.BufferGeometry();packetGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(packetCount*(packetSegments-1)*18),3));
  windPackets=new THREE.Mesh(packetGeo,new THREE.MeshBasicMaterial({color:0xf59e0b,transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false}));windPackets.frustumCulled=false;windPackets.name='visible-gust-packets';windSceneFX.add(windPackets);
  const headGeo=new THREE.ConeGeometry(.12,.48,6),headMat=new THREE.MeshBasicMaterial({color:0x0891b2});
  for(let i=0;i<20;i++){const head=new THREE.Mesh(headGeo,headMat);head.rotation.z=-Math.PI/2;windSceneFX.add(head);windHeads.push(head);}
  const wakeGeo=new THREE.BufferGeometry();wakeGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6*24*6),3));
  windWake=new THREE.LineSegments(wakeGeo,new THREE.LineBasicMaterial({color:0x0e7490,transparent:true,opacity:.32}));windWake.frustumCulled=false;windSceneFX.add(windWake);
  const B=bldgWidth*.26,H=stories*floorH*.234,sh=H/stories;
  const maxF=Math.max(...currentFWind),panelGeo=new THREE.PlaneGeometry(B*.92,sh*.86),skinColor=new THREE.Color(0x0891b2);
  floorMeshes.slice(1).forEach((group,i)=>{
    const slab=group.children[0];
    // Keep the original pale slabs, with strong black outlines; blue columns reveal the structure.
    slab.children.forEach(mesh=>{
      if(mesh.isLineSegments){mesh.material.color.setHex(0x0f172a);mesh.material.linewidth=2;}
      if(mesh.isMesh&&mesh.geometry.parameters?.width===.55){mesh.material.color.setHex(0x2563eb);windColumns.push({mesh,story:i,x:mesh.position.x,z:mesh.position.z,height:mesh.geometry.parameters.height});}
      else if(mesh.isMesh&&mesh.geometry.attributes?.position){windSkins.push({mesh,story:i,source:new Float32Array(mesh.geometry.attributes.position.array)});}
    });
    const mat=new THREE.MeshBasicMaterial({color:skinColor.clone(),transparent:true,opacity:.15,side:THREE.DoubleSide,depthWrite:false,depthTest:false});
    const panel=new THREE.Mesh(panelGeo,mat);panel.renderOrder=5;panel.rotation.y=Math.PI/2;panel.userData={story:i,ratio:currentFWind[i]/maxF};windSceneFX.add(panel);windPanels.push(panel);
  });
  if(threeParticles)threeParticles.visible=false;
  fitOriginalCamera();
}
function fitOriginalCamera(camera=threeCamera,aspect){
  if(!camera)return;const H=stories*floorH*.234,B=bldgWidth*.26,a=aspect||threeContainer.clientWidth/(threeContainer.clientHeight||210);
  const target=new THREE.Vector3(.8,H*.48,0),direction=camera.position.clone().sub(threeControls?.target||target).normalize();
  if(direction.length()<.1)direction.set(.64,.4,.86).normalize();
  const vertical=Math.max(H+10,(B*3.4+8)/a),distance=vertical/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.09;
  camera.position.copy(target).addScaledVector(direction,distance);camera.aspect=a;camera.lookAt(target);camera.updateProjectionMatrix();
  if(camera===threeCamera&&threeControls){threeControls.target.copy(target);threeControls.update();}
}
rebuildThreeBuilding=function(){
  floorMeshes.forEach(releaseGroup);releaseGroup(dimensionGroup);releaseGroup(vectorGroup);
  originalRebuild();prepareWindFX();
};
updateAnalysis=function(){originalAnalysis();
  const vw=currentVWind[0],vs=currentVSeismic[0];
  document.getElementById('profileWind').textContent=Math.round(vw).toLocaleString()+' kN';document.getElementById('profileSeismic').textContent=Math.round(vs).toLocaleString()+' kN';
  metricGoverning.textContent='밑면전단력: '+(vw>vs?'풍하중 우세':'지진하중 우세');
};
function lockOriginalFloors(){
  const isWind=animMode!=='seismic',isSeismic=animMode!=='wind',H=stories*floorH*.234,B=bldgWidth*.26,sh=H/stories;
  const load=animMode==='wind'?currentVWind[0]:animMode==='seismic'?currentVSeismic[0]:Math.max(currentVWind[0],currentVSeismic[0]);
  const drift=Math.min(4.5,Math.max(1.2,(load/4500)*3.5));
  const shape=s=>1.5*s*s-.5*s*s*s;windGap=0;
  floorMeshes.forEach((group,index)=>{group.position.x=index?drift*shape(index/stories):0;group.rotation.z=0;});
  for(const col of windColumns){const lowerDx=drift*shape(col.story/stories),upperDx=drift*shape((col.story+1)/stories),dx=lowerDx-upperDx;
    scratchLower.set(col.x+dx,-sh,col.z);scratchUpper.set(col.x,0,col.z);col.mesh.position.copy(scratchLower).add(scratchUpper).multiplyScalar(.5);scratchDir.subVectors(scratchUpper,scratchLower);col.mesh.scale.y=scratchDir.length()/col.height;col.mesh.quaternion.setFromUnitVectors(postUp,scratchDir.normalize());col.mesh.updateMatrix();
    scratchLower.set(0,-col.height/2,0).applyMatrix4(col.mesh.matrix);scratchUpper.set(0,col.height/2,0).applyMatrix4(col.mesh.matrix);
    windGap=Math.max(windGap,Math.hypot(scratchLower.x-col.x-dx,scratchLower.y+sh,scratchLower.z-col.z),Math.hypot(scratchUpper.x-col.x,scratchUpper.y,scratchUpper.z-col.z));
  }
  for(const skin of windSkins){
    const p=skin.mesh.geometry.attributes.position,delta=drift*(shape(skin.story/stories)-shape((skin.story+1)/stories));
    for(let i=0;i<p.count;i++){const j=i*3,depth=Math.max(0,Math.min(1,-(skin.source[j+1]+skin.mesh.position.y)/sh));p.array[j]=skin.source[j]+delta*depth;}p.needsUpdate=true;skin.mesh.geometry.computeVertexNormals();
  }
  windPanels.forEach(panel=>{const s=(panel.userData.story+.5)/stories;panel.position.set(-B/2+drift*shape(s)-.05,s*H,0);});
  // Vector arrows follow the same floor positions, using the original static force magnitudes.
  vectorGroup?.children.forEach(arrow=>{if(arrow.userData.baseX===undefined)arrow.userData.baseX=arrow.position.x;arrow.position.x=arrow.userData.baseX+drift*shape(arrow.position.y/H);});
  windSceneFX.visible=isWind&&activeView==='B';
  return {H,B,drift,isWind,isSeismic};
}
function updateWindIllustration(){
  if(!threeRenderer||!windSceneFX||activeView!=='B')return;
  const scene=lockOriginalFloors(),intensity=Number(document.getElementById('gust').value)/100;
  const gust=W.gustAt(visualTime,intensity),style=W.gustStyle(visualTime,intensity),effectSpeed=V0/36*style.speedScale,p=windLines.geometry.attributes.position;let cursor=0;
  for(let lane=0;lane<windLanes;lane++)for(let k=0;k<windSegments-1;k++){
    const a=W.pointAt(visualTime,lane,k,scene.B,scene.H,effectSpeed,intensity,scene.drift);
    let b=W.pointAt(visualTime,lane,k+1,scene.B,scene.H,effectSpeed,intensity,scene.drift);
    if(Math.abs(a[0]-b[0])>scene.B)b=a; // A particle wrapping upstream never draws a line across the building.
    for(const v of [a,b]){p.array[cursor++]=v[0];p.array[cursor++]=v[1];p.array[cursor++]=v[2];}
  }p.needsUpdate=true;
  windHeads.forEach((head,i)=>{const v=W.pointAt(visualTime,i*5,0,scene.B,scene.H,effectSpeed,intensity,scene.drift);head.position.set(v[0],v[1],v[2]);head.scale.setScalar(style.headScale);});
  windLines.material.opacity=.45+.45*intensity;
  const packet=windPackets.geometry.attributes.position;cursor=0;
  for(let lane=0;lane<packetCount;lane++)for(let k=0;k<packetSegments-1;k++){
    const a=W.pointAt(visualTime,lane*13+7,k*4,scene.B,scene.H,effectSpeed,intensity,scene.drift);
    let b=W.pointAt(visualTime,lane*13+7,(k+1)*4,scene.B,scene.H,effectSpeed,intensity,scene.drift);
    if(Math.abs(a[0]-b[0])>scene.B)b=a;
    const half=style.packetWidth*.5;
    for(const [point,sign] of [[a,-1],[b,-1],[a,1],[a,1],[b,-1],[b,1]]){packet.array[cursor++]=point[0];packet.array[cursor++]=point[1]+sign*half;packet.array[cursor++]=point[2];}
  }packet.needsUpdate=true;windPackets.visible=intensity>.02;windPackets.material.opacity=style.packetOpacity;
  windPanels.forEach(panel=>{panel.material.color.copy(pressureCalm).lerp(pressureGust,intensity);panel.material.opacity=style.pressureOpacity*panel.userData.ratio;});
  const w=windWake.geometry.attributes.position;cursor=0;
  for(let ring=0;ring<6;ring++)for(let k=0;k<24;k++)for(let endpoint=0;endpoint<2;endpoint++){
    const theta=(k+endpoint)/24*Math.PI*2+visualTime*(ring%2?-1:1)*1.3,radius=scene.B*(.12+.07*W.mod(ring*.35+visualTime*.16));
    w.array[cursor++]=scene.B*.7+scene.drift+W.mod(ring*.27+visualTime*.15)*scene.B*2.2;
    w.array[cursor++]=scene.H*(.2+(ring%3)*.28)+radius*Math.sin(theta)*.55;
    w.array[cursor++]=(ring%2?1:-1)*scene.B*.66+radius*Math.cos(theta);
  }w.needsUpdate=true;
  document.getElementById('windState').textContent=scene.isWind?(intensity<.03?'일정풍 · 가는 청록 기류만 표시':`돌풍 ${Math.round(intensity*100)}% · 주황 띠 = 돌풍 묶음 · 외벽 주황색 = 압력 강조`):'지진하중 보기 · 풍 프로파일은 비교용으로 유지';
  threeContainer.dataset.time=visualTime.toFixed(3);threeContainer.dataset.windVisible=String(windSceneFX.visible);threeContainer.dataset.endpointGap=windGap.toExponential(3);threeContainer.dataset.gust=gust.toFixed(4);
  threeContainer.dataset.gustPackets=String(windPackets.visible&&windSceneFX.visible);threeContainer.dataset.gustPressureOpacity=style.pressureOpacity.toFixed(3);
  if(beaconMesh)beaconMesh.material.color.setRGB(.8+.2*Math.sin(visualTime*5),.08,.08);
  threeControls.update();threeRenderer.render(threeScene,threeCamera);
}
updateThreeAnimation=updateWindIllustration;
const originalResize=handleResize;
handleResize=function(){originalResize();fitOriginalCamera();};
// Keep original canvas chart layout and labels, while rendering at least DPR 2.
const originalProfile=drawProfile;
drawProfile=function(canvas,ctx,...args){
  const nativeDPR=window.devicePixelRatio||1,targetDPR=Math.max(2,nativeDPR);
  if(canvas.width!==Math.round(canvas.clientWidth*targetDPR)||canvas.height!==Math.round(canvas.clientHeight*targetDPR)){canvas.width=Math.round(canvas.clientWidth*targetDPR);canvas.height=Math.round(canvas.clientHeight*targetDPR);}
  // Original renderer sets DPR itself; the context adapter adjusts only the pixel scale.
  const originalScale=ctx.scale.bind(ctx);ctx.scale=(x,y)=>originalScale(x*targetDPR/nativeDPR,y*targetDPR/nativeDPR);
  try{originalProfile(canvas,ctx,...args);}finally{delete ctx.scale;}
};
function renderOriginal(){
  animTime=visualTime;
  if(activeView==='B')updateWindIllustration();else drawCADBuilding();
  drawProfile(forceCanvas,forceCtx,currentHArr,currentFWind,currentFSeismic,'층별 횡하중 Fi [kN]',100,'force');
  drawProfile(shearCanvas,shearCtx,currentHArr,currentVWind,currentVSeismic,'층전단력 Vx [kN]',500,'shear');
}
animate=function(stamp){
  const now=stamp||performance.now();if(lastWindStamp&&!visualPaused&&!recordingWind)visualTime+=Math.min(.08,(now-lastWindStamp)/1000);lastWindStamp=now;
  renderOriginal();animId=requestAnimationFrame(animate);
};
document.getElementById('pauseWind').addEventListener('click',()=>{visualPaused=!visualPaused;document.getElementById('pauseWind').textContent=visualPaused?'재생':'일시정지';});
document.getElementById('gust').addEventListener('input',event=>{document.getElementById('gustValue').textContent=event.target.value+'%';renderOriginal();});
document.getElementById('enlarge').addEventListener('click',()=>{document.body.classList.toggle('large');document.getElementById('enlarge').textContent=document.body.classList.contains('large')?'수업 화면':'장면 확대';handleResize();});
function frameForExport(){
  if(!movieRenderer){movieRenderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});movieRenderer.setPixelRatio(1);movieRenderer.setSize(590,680,false);movieCamera=threeCamera.clone();
    for(let i=0;i<2;i++){const c=document.createElement('canvas');c.className='offscreen-chart';document.body.appendChild(c);exportCharts.push(c);}}
  const canvas=document.getElementById('movieCanvas'),ctx=canvas.getContext('2d');ctx.fillStyle='#faf8f5';ctx.fillRect(0,0,1920,1080);
  ctx.fillStyle='#0f172a';ctx.font='700 39px "Malgun Gothic",sans-serif';ctx.fillText('풍하중 vs 지진하중 · 건물과 하중 프로파일',58,90);
  ctx.font='22px "Malgun Gothic",sans-serif';ctx.fillStyle='#475569';ctx.fillText(`${stories}층 · 높이 ${(stories*floorH).toFixed(1)} m · 폭 ${bldgWidth.toFixed(0)} m · 기본 풍속 ${V0.toFixed(0)} m/s`,58,137);
  ctx.fillStyle='#fff';ctx.fillRect(38,180,610,720);ctx.fillRect(663,180,600,720);ctx.fillRect(1278,180,600,720);
  movieCamera.copy(threeCamera);fitOriginalCamera(movieCamera,590/680);movieRenderer.render(threeScene,movieCamera);ctx.drawImage(movieRenderer.domElement,48,193,590,680);
  drawProfile(exportCharts[0],exportCharts[0].getContext('2d'),currentHArr,currentFWind,currentFSeismic,'층별 횡하중 Fi [kN]',100,'force');
  drawProfile(exportCharts[1],exportCharts[1].getContext('2d'),currentHArr,currentVWind,currentVSeismic,'층전단력 Vx [kN]',500,'shear');
  ctx.drawImage(exportCharts[0],683,200,560,680);ctx.drawImage(exportCharts[1],1298,200,560,680);
  ctx.fillStyle='#e1f2f5';ctx.fillRect(38,925,1840,68);ctx.fillStyle='#155e75';ctx.font='700 23px "Malgun Gothic",sans-serif';ctx.fillText('바람의 흐름 → 외벽 압력 → 층별 횡하중 → 기초까지 누적되는 전단력',62,968);
  ctx.fillStyle='#64748b';ctx.font='17px "Malgun Gothic",sans-serif';ctx.fillText('기류·돌풍과 변형은 설명용 시각화 · CFD/동적 응답해석 아님 · 프로파일은 기존 교육용 간이 산정식',58,1034);return canvas;
}
function saveWindBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.getElementById('savePNG').addEventListener('click',()=>frameForExport().toBlob(blob=>{if(blob)saveWindBlob(blob,'wind-profile-v3.png');}));
document.getElementById('saveVideo').addEventListener('click',()=>{
  if(recordingWind)return;const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(x=>typeof MediaRecorder!=='undefined'&&MediaRecorder.isTypeSupported(x));if(!mime){document.getElementById('windState').textContent='이 브라우저는 영상 저장을 지원하지 않습니다.';return;}
  const previous={visualTime,visualPaused},canvas=frameForExport(),stream=canvas.captureStream(30),parts=[],recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:10000000});recordingWind=true;
  document.querySelectorAll('button,input,select').forEach(el=>el.disabled=true);recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());saveWindBlob(new Blob(parts,{type:mime}),'wind-profile-v3-12s.webm');recordingWind=false;visualTime=previous.visualTime;visualPaused=previous.visualPaused;document.querySelectorAll('button,input,select').forEach(el=>el.disabled=false);document.getElementById('saveVideo').textContent='12초 영상 저장';};
  visualTime=0;renderOriginal();frameForExport();recorder.start();const start=performance.now();let last=-1;
  function next(now){const frame=Math.min(360,Math.floor((now-start)*.03));if(frame!==last){visualTime=frame/30;renderOriginal();frameForExport();last=frame;}document.getElementById('saveVideo').textContent=`저장 중 ${(frame/30).toFixed(0)} / 12초`;if(frame===360)recorder.stop();else requestAnimationFrame(next);}requestAnimationFrame(next);
});
window.addEventListener('load',()=>{const q=new URLSearchParams(location.search);if(q.has('t')){visualTime=Math.max(0,Number(q.get('t'))||0);visualPaused=true;document.getElementById('pauseWind').textContent='재생';}if(q.get('large')==='1'){document.body.classList.add('large');document.getElementById('enlarge').textContent='수업 화면';handleResize();}document.body.dataset.revision='original-plus-wind-v3';renderOriginal();});
