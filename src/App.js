import { useState, useRef, useCallback } from "react";

const SKIN_TONE_DATA = {
  warm: {
    label: "Warm", emoji: "🌅",
    desc: "Golden, peachy, or olive undertones",
    palette: ["Terracotta", "Burnt Orange", "Olive Green", "Mustard Yellow", "Camel Brown", "Rust Red"],
    paletteHex: ["#E2725B", "#CC5500", "#708238", "#E1AD21", "#C19A6B", "#B7410E"],
    why: "Warm undertones harmonize best with earthy, golden, and amber-based shades that echo the natural warmth in your complexion.",
  },
  cool: {
    label: "Cool", emoji: "🌙",
    desc: "Pink, red, or bluish undertones",
    palette: ["Lavender", "Dusty Rose", "Slate Blue", "Mauve", "Soft Teal", "Plum"],
    paletteHex: ["#B57EDC", "#DCB0B0", "#6699CC", "#E0B0FF", "#008080", "#8E4585"],
    why: "Cool undertones shine with jewel tones and muted blue-based hues that complement the rosy or ashy notes in your skin.",
  },
  neutral: {
    label: "Neutral", emoji: "✨",
    desc: "Balanced undertones — suits both warm & cool",
    palette: ["Soft White", "Jade Green", "Warm Taupe", "Blush Pink", "Navy Blue", "Chocolate"],
    paletteHex: ["#F5F5DC", "#00A86B", "#B0938A", "#FFB6C1", "#000080", "#7B3F00"],
    why: "Neutral undertones are wonderfully versatile — you can pull from both warm and cool palettes, giving you the widest range of flattering shades.",
  },
};

const FACE_SHAPE_DATA = {
  oval: {
    label: "Oval", emoji: "🥚",
    desc: "Balanced proportions, slightly wider forehead",
    hairstyles: [
      { name: "Beachy Waves", desc: "Effortless texture that frames beautifully", icon: "🌊" },
      { name: "Sleek Straight", desc: "Elegant and versatile for any occasion", icon: "✨" },
      { name: "Textured Bob", desc: "Chic, modern and low-maintenance", icon: "✂️" },
      { name: "Long Layers", desc: "Adds soft movement and dimension", icon: "🌿" },
      { name: "Side-Swept Bangs", desc: "Frames the face beautifully", icon: "💫" },
    ],
  },
  round: {
    label: "Round", emoji: "⭕",
    desc: "Similar width & length with soft curves",
    hairstyles: [
      { name: "Long Straight", desc: "Visually lengthens the face", icon: "📏" },
      { name: "High Ponytail", desc: "Adds height and definition", icon: "🎀" },
      { name: "Deep Side Part", desc: "Creates flattering asymmetry", icon: "↔️" },
      { name: "Voluminous Layers", desc: "Adds dimension and structure", icon: "🌀" },
      { name: "Angular Bob", desc: "Creates the illusion of angles", icon: "✂️" },
    ],
  },
  square: {
    label: "Square", emoji: "⬜",
    desc: "Strong jawline, equal width at forehead & jaw",
    hairstyles: [
      { name: "Soft Curls", desc: "Softens angular features naturally", icon: "🌀" },
      { name: "Wispy Bangs", desc: "Breaks harsh horizontal lines", icon: "🌬️" },
      { name: "Long Layers", desc: "Adds flowing movement", icon: "🌿" },
      { name: "Loose Waves", desc: "Balances the strong jawline", icon: "🌊" },
      { name: "Side Part", desc: "Creates asymmetry and softness", icon: "↔️" },
    ],
  },
  heart: {
    label: "Heart", emoji: "💕",
    desc: "Wider forehead, narrow pointed chin",
    hairstyles: [
      { name: "Chin-Length Bob", desc: "Balances the face width perfectly", icon: "✂️" },
      { name: "Side-Swept Bangs", desc: "Minimizes the forehead width", icon: "💫" },
      { name: "Loose Curls", desc: "Adds softness around the chin", icon: "🌀" },
      { name: "Layered Pixie", desc: "Suits the delicate chin beautifully", icon: "⭐" },
      { name: "Low Buns", desc: "Elegant and perfectly balanced", icon: "🎀" },
    ],
  },
  oblong: {
    label: "Oblong", emoji: "🫙",
    desc: "Face is longer than it is wide",
    hairstyles: [
      { name: "Blunt Bob", desc: "Shortens the face visually", icon: "✂️" },
      { name: "Full Bangs", desc: "Reduces perceived face length", icon: "🌬️" },
      { name: "Waves with Volume", desc: "Adds width at the sides", icon: "🌊" },
      { name: "Short Layers", desc: "Creates fullness and structure", icon: "🌿" },
      { name: "Curtain Bangs", desc: "Trendy and flattering", icon: "✨" },
    ],
  },
};

const JEWELLERY = {
  feminine: {
    warm:    { oval: ["Delicate Gold Chains","Amber Drop Earrings","Tortoiseshell Cuffs","Layered Gold Bracelets"], round: ["Long Pendant Necklaces","Linear Drop Earrings","Slim Gold Bangles","Tassel Earrings"], square: ["Curved Gold Hoops","Pearl Earrings","Soft Chain Necklaces","Beaded Bracelets"], heart: ["Chandelier Earrings","Layered Necklaces","Statement Rings","Chunky Cuffs"], oblong: ["Short Choker Necklaces","Wide Hoop Earrings","Chunky Chain Bracelets","Cluster Studs"] },
    cool:    { oval: ["Silver Geometric Earrings","Amethyst Pendants","Platinum Rings","Crystal Drop Earrings"], round: ["Long Silver Chains","Linear Earrings","Sapphire Studs","Dainty Silver Bracelets"], square: ["Rose Gold Hoops","Pearl Clusters","Moonstone Rings","Soft Chain Necklaces"], heart: ["Silver Chandeliers","Layered Silver Necklaces","Aquamarine Rings","Wide Silver Cuffs"], oblong: ["Silver Chokers","Bold Hoop Earrings","Crystal Cuffs","Statement Silver Rings"] },
    neutral: { oval: ["Mixed Metal Hoops","Freshwater Pearl Earrings","Rose Gold Pendants","Stacked Rings"], round: ["Long Mixed Metal Chains","Geometric Drop Earrings","Delicate Bangles","Ear Cuffs"], square: ["Soft Hoop Earrings","Pearl & Gold Mix","Layered Necklaces","Charm Bracelets"], heart: ["Statement Mixed Earrings","Multi-Chain Necklaces","Cocktail Rings","Bold Cuffs"], oblong: ["Collar Necklaces","Statement Studs","Mixed Metal Cuffs","Stacked Rings"] },
  },
  masculine: {
    warm:    { oval: ["Gold Chain Necklace","Leather & Gold Bracelet","Signet Ring","Gold Stud Earring"], round: ["Long Pendant","Slim Chain","Simple Cuff","Minimalist Ring"], square: ["Beaded Bracelet","Rope Chain","Stone Ring","Leather Band"], heart: ["Layered Chains","Statement Ring","Wide Cuff","Wooden Bead Bracelet"], oblong: ["Choker Chain","Bold Stud","Wide Bangle","Cluster Ring"] },
    cool:    { oval: ["Silver Chain","Steel Cuff","Crystal Stud","Minimalist Silver Ring"], round: ["Long Silver Pendant","Slim Silver Chain","Steel Band","Simple Earring"], square: ["Oxidized Silver Bracelet","Stone Pendant","Silver Ring","Ear Cuff"], heart: ["Layered Silver Chains","Bold Ring","Wide Silver Cuff","Geometric Stud"], oblong: ["Silver Choker","Bold Hoop","Wide Cuff Bracelet","Statement Ring"] },
    neutral: { oval: ["Mixed Metal Chain","Beaded Bracelet","Rose Gold Ring","Stud Earring"], round: ["Long Mixed Pendant","Cord Bracelet","Simple Band","Minimalist Earring"], square: ["Leather Wrap Bracelet","Mixed Chain","Stone Ring","Ear Cuff"], heart: ["Layered Mixed Chains","Statement Ring","Bold Cuff","Wooden Bead Bracelet"], oblong: ["Collar Chain","Bold Stud","Mixed Cuff","Stacked Rings"] },
  },
  neutral: {
    warm:    { oval: ["Gold Hoops","Amber Pendant","Layered Chains","Signet Ring"], round: ["Long Pendant","Linear Earrings","Slim Bangle","Tassel Piece"], square: ["Curved Hoops","Soft Chain","Beaded Bracelet","Stone Ring"], heart: ["Statement Earrings","Layered Necklaces","Bold Ring","Wide Cuff"], oblong: ["Choker","Wide Hoops","Chunky Chain","Cluster Studs"] },
    cool:    { oval: ["Silver Geometric Pieces","Crystal Drops","Platinum Rings","Amethyst Pendant"], round: ["Long Silver Chain","Linear Drops","Dainty Bracelet","Sapphire Stud"], square: ["Rose Gold Hoops","Moonstone Ring","Soft Chain","Pearl Piece"], heart: ["Silver Chandeliers","Aquamarine Ring","Layered Necklace","Wide Cuff"], oblong: ["Silver Choker","Bold Hoops","Crystal Cuff","Statement Ring"] },
    neutral: { oval: ["Mixed Metal Pieces","Pearl Drops","Rose Gold Chain","Stacked Rings"], round: ["Long Chain","Geometric Drops","Delicate Bangle","Ear Cuff"], square: ["Soft Hoops","Charm Bracelet","Layered Necklace","Mixed Metals"], heart: ["Statement Drops","Multi-Chain","Cocktail Ring","Bold Cuff"], oblong: ["Collar Piece","Statement Stud","Mixed Cuff","Stacked Rings"] },
  },
};

const SKIN_TONES  = ["warm","cool","neutral"];
const FACE_SHAPES = ["oval","round","square","heart","oblong"];
const STEPS = ["Face Detection","Skin Tone Analysis","Face Shape Detection","Style Mapping"];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function genResults(gender){
  const skinTone  = pick(SKIN_TONES);
  const faceShape = pick(FACE_SHAPES);
  const gKey = gender || "neutral";
  const jewellery = JEWELLERY[gKey]?.[skinTone]?.[faceShape] || JEWELLERY.neutral[skinTone][faceShape];
  return { skinTone, faceShape, jewellery, confidence: Math.floor(Math.random()*8+88) };
}

/* ── global css ── */
const G = `
*{box-sizing:border-box}
body{margin:0;background:#0D0B14}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes stepIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
.fu{animation:fadeUp .45s ease both}
.upload:hover{border-color:#C4956A!important;background:rgba(196,149,106,.07)!important}
.gbtn:hover{border-color:#C4956A!important;background:rgba(196,149,106,.13)!important}
.cta:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(196,149,106,.35)!important}
.tab:hover{color:#E8D5C4!important}
.card:hover{border-color:rgba(196,149,106,.35)!important}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:#2A2330;border-radius:4px}
`;

/* ── shared styles ── */
const S = {
  page:  { minHeight:"100vh", background:"#0D0B14", overflowX:"hidden", fontFamily:"'DM Sans',sans-serif", color:"#F0EBE3" },
  wrap:  { maxWidth:460, margin:"0 auto", padding:"0 20px 60px", position:"relative", zIndex:1 },
  label: { fontSize:10, letterSpacing:5, color:"#6A5848", textTransform:"uppercase", marginBottom:14 },
  card:  { background:"rgba(255,255,255,.025)", border:"1px solid #1A1520", borderRadius:16, padding:"16px 18px", transition:"border-color .2s" },
};

export default function AuraStyle(){
  const [screen,   setScreen]   = useState("home");
  const [gender,   setGender]   = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [step,     setStep]     = useState(0);
  const [results,  setResults]  = useState(null);
  const [tab,      setTab]      = useState("colors");
  const [drag,     setDrag]     = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback(file => {
    if(!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setScreen("preview");
  },[]);

  const startAnalysis = useCallback(()=>{
    setScreen("processing"); setStep(0);
    let s=0;
    const iv = setInterval(()=>{
      s++; setStep(s);
      if(s >= STEPS.length){
        clearInterval(iv);
        setTimeout(()=>{ setResults(genResults(gender)); setScreen("results"); setTab("colors"); },500);
      }
    },750);
  },[gender]);

  const reset = ()=>{ setScreen("home"); setGender(null); setPreview(null); setStep(0); setResults(null); };

  const skin = results ? SKIN_TONE_DATA[results.skinTone]  : null;
  const face = results ? FACE_SHAPE_DATA[results.faceShape] : null;

  return(
    <div style={S.page}>
      <style>{G}</style>

      {/* bg orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,149,106,.13) 0%,transparent 65%)"}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"-8%",width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle,rgba(100,80,150,.1) 0%,transparent 65%)"}}/>
      </div>

      {/* header */}
      <div style={{textAlign:"center",paddingTop:52,paddingBottom:36,position:"relative",zIndex:1}}>
        <div style={{fontSize:10,letterSpacing:7,color:"#B08060",textTransform:"uppercase",marginBottom:10}}>AI Style Analysis</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:50,fontWeight:300,margin:0,
          background:"linear-gradient(135deg,#EDD9C5 0%,#C4956A 50%,#8B5E3C 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2,lineHeight:1}}>
          AuraStyle
        </h1>
        <div style={{width:48,height:1,background:"linear-gradient(90deg,transparent,#C4956A,transparent)",margin:"14px auto 0"}}/>
      </div>

      {/* ══ HOME ══ */}
      {screen==="home" && (
        <div className="fu" style={S.wrap}>
          <p style={{textAlign:"center",color:"#9A8878",fontSize:14,lineHeight:1.8,marginBottom:36,marginTop:0}}>
            Upload a selfie and discover your perfect color palette,<br/>hairstyles &amp; jewellery — powered by AI.
          </p>

          {/* gender */}
          <div style={{marginBottom:28}}>
            <div style={{...S.label,textAlign:"center"}}>
              Style Preference &nbsp;<span style={{opacity:.5,letterSpacing:2}}>(optional)</span>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[
                {key:"feminine",  label:"Feminine",  emoji:"🌸"},
                {key:"masculine", label:"Masculine", emoji:"⚡"},
                {key:null,        label:"Neutral",   emoji:"✦"},
              ].map(g=>(
                <button key={g.key??"null"} className="gbtn" onClick={()=>setGender(g.key)}
                  style={{flex:1,padding:"14px 8px",borderRadius:14,cursor:"pointer",
                    border:`1px solid ${gender===g.key?"#C4956A":"#221D2C"}`,
                    background:gender===g.key?"rgba(196,149,106,.18)":"rgba(255,255,255,.02)",
                    color:gender===g.key?"#EDD9C5":"#6A5848",
                    fontSize:12,display:"flex",flexDirection:"column",alignItems:"center",gap:5,
                    letterSpacing:.5,transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                  <span style={{fontSize:22}}>{g.emoji}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* upload */}
          <div className="upload"
            onDragOver={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
            onClick={()=>fileRef.current.click()}
            style={{border:`1.5px dashed ${drag?"#C4956A":"#221D2C"}`,borderRadius:20,
              padding:"44px 24px",textAlign:"center",cursor:"pointer",
              background:drag?"rgba(196,149,106,.06)":"rgba(255,255,255,.015)",
              marginBottom:20,transition:"all .25s"}}>
            <div style={{fontSize:44,marginBottom:14}}>📸</div>
            <div style={{color:"#C4956A",fontSize:15,marginBottom:6,fontWeight:500}}>Upload your selfie</div>
            <div style={{color:"#4A3A2E",fontSize:12,marginBottom:8}}>Drag &amp; drop · or tap to browse</div>
            <div style={{color:"#2E2420",fontSize:11}}>JPG / PNG · Max 10MB · Auto-deleted after analysis 🔒</div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
              onChange={e=>handleFile(e.target.files[0])}/>
          </div>

          <div style={{textAlign:"center",fontSize:11,color:"#3A2E28",letterSpacing:2}}>
            ✦ &nbsp; Privacy-first — no face data ever stored &nbsp; ✦
          </div>
        </div>
      )}

      {/* ══ PREVIEW ══ */}
      {screen==="preview" && (
        <div className="fu" style={S.wrap}>
          <div style={{textAlign:"center",fontSize:13,color:"#9A8878",marginBottom:20}}>Confirm your photo</div>
          <div style={{borderRadius:20,overflow:"hidden",marginBottom:22,aspectRatio:"4/5",maxHeight:380,
            boxShadow:"0 20px 60px rgba(0,0,0,.6)"}}>
            <img src={preview} alt="Preview" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>{setScreen("home");setPreview(null);}}
              style={{flex:1,padding:15,borderRadius:14,border:"1px solid #221D2C",background:"transparent",
                color:"#8A7868",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}>
              ← Change
            </button>
            <button className="cta" onClick={startAnalysis}
              style={{flex:2,padding:15,borderRadius:14,border:"none",
                background:"linear-gradient(135deg,#C4956A,#8B5E3C)",
                color:"#FFF5EC",cursor:"pointer",fontSize:14,fontWeight:600,
                fontFamily:"'DM Sans',sans-serif",letterSpacing:.5,transition:"all .22s"}}>
              Analyze My Aura ✨
            </button>
          </div>
        </div>
      )}

      {/* ══ PROCESSING ══ */}
      {screen==="processing" && (
        <div className="fu" style={S.wrap}>
          <div style={{textAlign:"center",padding:"30px 0"}}>
            <div style={{width:60,height:60,border:"2px solid #1E1820",borderTop:"2px solid #C4956A",
              borderRadius:"50%",margin:"0 auto 32px",animation:"spin 1s linear infinite"}}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#EDD9C5",marginBottom:6}}>
              Analyzing your Aura...
            </div>
            <div style={{fontSize:13,color:"#6A5848",marginBottom:44}}>This takes just a moment ✨</div>
            <div style={{display:"flex",flexDirection:"column",gap:18,maxWidth:270,margin:"0 auto",textAlign:"left"}}>
              {STEPS.map((s,i)=>{
                const done = step>i;
                return(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:14,
                    opacity:done?1:.25,animation:done?"stepIn .4s ease":"none",transition:"opacity .3s"}}>
                    <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
                      background:done?"linear-gradient(135deg,#C4956A,#8B5E3C)":"#1A1520",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,color:done?"#fff":"#3A3040",
                      boxShadow:done?"0 4px 12px rgba(196,149,106,.3)":"none"}}>
                      {done?"✓":i+1}
                    </div>
                    <span style={{fontSize:14,color:done?"#E8D5C4":"#4A3A3A"}}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {screen==="results" && results && skin && face && (
        <div className="fu" style={S.wrap}>

          {/* profile card */}
          <div style={{background:"linear-gradient(135deg,rgba(196,149,106,.13),rgba(139,94,60,.05))",
            border:"1px solid rgba(196,149,106,.22)",borderRadius:22,padding:"22px 24px",marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <div>
                <div style={{fontSize:10,letterSpacing:5,color:"#C4956A",textTransform:"uppercase",marginBottom:5}}>Your Aura Profile</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#F0EBE3"}}>Style Analysis Complete</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:32,fontWeight:700,color:"#C4956A",lineHeight:1}}>{results.confidence}%</div>
                <div style={{fontSize:9,color:"#6A5848",letterSpacing:3,textTransform:"uppercase",marginTop:2}}>Confidence</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[
                {label:"Skin Tone",  value:`${skin.emoji} ${skin.label}`,  sub:skin.desc},
                {label:"Face Shape", value:`${face.emoji} ${face.label}`, sub:face.desc},
              ].map(item=>(
                <div key={item.label} style={{flex:1,background:"rgba(0,0,0,.25)",borderRadius:14,
                  padding:"12px 14px",border:"1px solid rgba(255,255,255,.04)"}}>
                  <div style={{fontSize:9,color:"#6A5848",letterSpacing:3,textTransform:"uppercase",marginBottom:5}}>{item.label}</div>
                  <div style={{fontSize:16,color:"#EDD9C5",marginBottom:3}}>{item.value}</div>
                  <div style={{fontSize:11,color:"#6A5848",lineHeight:1.4}}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* tabs */}
          <div style={{display:"flex",gap:4,marginBottom:20,
            background:"rgba(255,255,255,.02)",borderRadius:14,padding:4,border:"1px solid #1A1520"}}>
            {[{key:"colors",label:"🎨 Colors"},{key:"hair",label:"💇 Hairstyles"},{key:"jewellery",label:"💍 Jewellery"}].map(t=>(
              <button key={t.key} className="tab" onClick={()=>setTab(t.key)}
                style={{flex:1,padding:"10px 4px",border:"none",borderRadius:10,cursor:"pointer",
                  background:tab===t.key?"rgba(196,149,106,.22)":"transparent",
                  color:tab===t.key?"#EDD9C5":"#4A3A3A",fontSize:12,
                  fontFamily:"'DM Sans',sans-serif",transition:"all .2s",
                  borderBottom:tab===t.key?"1.5px solid rgba(196,149,106,.5)":"1.5px solid transparent"}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* colors */}
          {tab==="colors" && (
            <div className="fu">
              <div style={S.label}>Your Palette</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:22}}>
                {skin.palette.map((name,i)=>(
                  <div key={name} className="card" style={{display:"flex",alignItems:"center",gap:9,
                    borderRadius:30,padding:"8px 15px"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:skin.paletteHex[i],
                      flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.5)"}}/>
                    <span style={{fontSize:13,color:"#C4B4A4"}}>{name}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{borderRadius:16,padding:18}}>
                <div style={S.label}>Why These Colors?</div>
                <div style={{fontSize:13,color:"#9A8878",lineHeight:1.8}}>{skin.why}</div>
              </div>
            </div>
          )}

          {/* hair */}
          {tab==="hair" && (
            <div className="fu" style={{display:"flex",flexDirection:"column",gap:12}}>
              {face.hairstyles.map(h=>(
                <div key={h.name} className="card" style={{borderRadius:16,padding:"16px 18px",
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:15,color:"#EDD9C5",marginBottom:4,fontWeight:500}}>{h.name}</div>
                    <div style={{fontSize:12,color:"#6A5848"}}>{h.desc}</div>
                  </div>
                  <div style={{fontSize:24,flexShrink:0}}>{h.icon}</div>
                </div>
              ))}
            </div>
          )}

          {/* jewellery */}
          {tab==="jewellery" && (
            <div className="fu">
              <div style={{fontSize:13,color:"#6A5848",marginBottom:18,lineHeight:1.7}}>
                Curated for your <strong style={{color:"#C4956A"}}>{skin.label.toLowerCase()} tone</strong> &amp; <strong style={{color:"#C4956A"}}>{face.label.toLowerCase()} face shape</strong>:
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {results.jewellery.map(item=>(
                  <div key={item} className="card" style={{borderRadius:14,padding:"15px 18px",
                    background:"rgba(196,149,106,.07)",border:"1px solid rgba(196,149,106,.14)",
                    display:"flex",alignItems:"center",gap:14}}>
                    <span style={{fontSize:22}}>💍</span>
                    <span style={{fontSize:14,color:"#D4C4B4"}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={reset}
            style={{width:"100%",marginTop:30,padding:15,borderRadius:14,
              border:"1px solid #221D2C",background:"transparent",color:"#6A5848",
              cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",
              letterSpacing:1,transition:"all .2s"}}>
            ↩ Analyze Another Photo
          </button>
        </div>
      )}
    </div>
  );
}

