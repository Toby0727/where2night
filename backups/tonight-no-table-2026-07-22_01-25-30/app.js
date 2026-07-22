const venues = [
  {
    id: "sh-abyss",
    city: "上海",
    type: "venue",
    name: "ABYSS Shanghai",
    alias: "ABYSS / Aby'ss",
    address: "TX淮海地下层",
    tagline: "鼠鼠们的地下狂欢",
    positioning: "地下电子音乐与Rave场",
    music: "Hard Techno / Hard Dance / 重型电子",
    crowd: "电子乐与Rave玩家",
    price: "按活动变化",
    dancefloor: "强",
    social: "中",
    newbie: "中低",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "锐舞玩家、喜欢硬核电子乐和连续跳舞的人",
    notFor: "偏好流行热歌、怕闷热拥挤",
    tip: "先看当晚Line-up；提前在小程序买票通常更便宜，但热门场次会售罄",
    tags: ["地下", "Hard Techno", "锐舞", "强舞池", "体力局"],
    risks: ["闷热", "拥挤", "热门票易售罄"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["rave", "dance", "music"],
  },
  {
    id: "sh-kan",
    city: "上海",
    type: "venue",
    name: "坎 KAN·嘻哈现场",
    alias: "砍 / 坎 / KAN",
    address: "茂名南路56号",
    tagline: "嘻哈小厅，抓手指比蹦迪更忙",
    positioning: "小型嘻哈现场与社交场",
    music: "Hip-hop / Trap / R&B",
    crowd: "年轻嘻哈客群",
    price: "待核实",
    dancefloor: "中高",
    social: "高",
    newbie: "中",
    lgbt: "待亲测",
    photo: "中",
    bestFor: "喜欢嘻哈、近距离互动；抓手指的人较多",
    notFor: "纯电子乐玩家、热衷蹦迪的人",
    tip: "确认当晚演出和订台规则",
    tags: ["Hip-hop", "小厅", "抓手指", "近距离", "社交局"],
    risks: ["不适合纯蹦", "规则待确认"],
    status: "名称已初步核对，待亲测校正",
    updated: "2026-07-21",
    traits: ["hiphop", "social", "music"],
  },
  {
    id: "sh-orii",
    city: "上海",
    type: "venue",
    name: "ORii Hub",
    alias: "ORII CLUB",
    address: "淮海中路566/570号二楼，门牌待核实",
    tagline: "K-pop 弹簧舞池，热单一出蹦就完了",
    positioning: "K-pop与Hip-hop商业舞池场",
    music: "K-pop / Hip-hop / Pop / Dance Music",
    crowd: "年轻、社交型客群",
    price: "待核实",
    dancefloor: "高，弹簧舞池",
    social: "高",
    newbie: "中高",
    lgbt: "待亲测",
    photo: "高",
    bestFor: "喜欢熟悉歌曲、社交和跳舞",
    notFor: "怕拥挤的人",
    tip: "先确认主题夜和入场规则",
    tags: ["K-pop", "弹簧舞池", "熟歌", "年轻", "好入门"],
    risks: ["高峰拥挤", "空间紧凑"],
    status: "正式名称和门牌待核实",
    updated: "2026-07-21",
    traits: ["pop", "dance", "social", "newbie"],
  },
  {
    id: "sh-max",
    city: "上海",
    type: "venue",
    name: "MAX Shanghai",
    alias: "MAX CLUB",
    address: "淮海中路98号2-3楼",
    tagline: "大场灯光、卡座社交，穿搭别敷衍",
    positioning: "大型商业EDM与桌台社交场",
    music: "EDM / 嘉宾DJ",
    crowd: "潮流穿搭、桌台社交客群",
    price: "中高，待核实",
    dancefloor: "中高",
    social: "高",
    newbie: "中低",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "商业大场、嘉宾活动、组队社交",
    notFor: "预算有限、只想自由跳舞",
    tip: "确认Dress Code、门票和低消",
    tags: ["EDM", "大场", "卡座", "嘉宾DJ", "穿搭"],
    risks: ["预算偏高", "规则多", "高峰人多"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["commercial", "social", "photo"],
  },
  {
    id: "sh-404",
    city: "上海",
    type: "venue",
    name: "404 Club Not Found",
    alias: "404",
    address: "上海地址冲突，待官方确认",
    tagline: "小场大社交，随机匹配局",
    positioning: "连锁Micro Club与年轻社交派对",
    music: "电子音乐为主，按主题变化",
    crowd: "年轻、互动和社交型客群",
    price: "待核实",
    dancefloor: "中",
    social: "高",
    newbie: "待亲测",
    lgbt: "待亲测",
    photo: "中高",
    bestFor: "小体量互动、主题派对",
    notFor: "追求大场舞美、怕拥挤",
    tip: "地址和营业状态确认后再发布",
    tags: ["Micro Club", "电子", "主题夜", "年轻", "互动"],
    risks: ["地址待确认", "拥挤", "评价分化"],
    status: "地址冲突，暂不公开上线",
    updated: "2026-07-21",
    traits: ["social", "electronic"],
    hiddenByDefault: true,
  },
  {
    id: "sh-ins",
    city: "上海",
    type: "venue",
    name: "INS Land",
    alias: "INS新乐园 / INS复兴",
    address: "复兴公园雁荡路109号",
    tagline: "一栋楼承包整晚，选错楼层像进错副本",
    positioning: "7层夜生活综合体，20多个场所",
    music: "覆盖Hip-hop、EDM、Pop、Techno等",
    crowd: "本地玩家、游客、年轻社交客群",
    price: "按票种和场所变化",
    dancefloor: "多场舞池",
    social: "高",
    newbie: "中高",
    lgbt: "高",
    photo: "强",
    bestFor: "第一次探索上海商业夜生活",
    notFor: "讨厌人多和复杂动线",
    tip: "先选目标楼层，不要无目的乱逛",
    tags: ["夜生活综合体", "多楼层", "多曲风", "可换场", "新手探索"],
    risks: ["人多", "动线复杂", "容易选错楼层"],
    status: "父场所资料已建立",
    updated: "2026-07-21",
    traits: ["newbie", "social", "photo", "commercial"],
  },
  {
    id: "sh-ins-hush",
    city: "上海",
    type: "space",
    parent: "INS Land",
    name: "HUSH",
    alias: "",
    address: "INS 2楼",
    tagline: "说唱浓度拉满，人挤但歌够新",
    positioning: "高人气年轻Hip-hop场",
    music: "Hip-hop / R&B / Trap / Drill / Rage",
    crowd: "年轻、说唱与潮流客群",
    price: "待核实",
    dancefloor: "强但高峰拥挤",
    social: "高",
    newbie: "中",
    lgbt: "待亲测",
    photo: "中高",
    bestFor: "喜欢新说唱和强节奏",
    notFor: "怕拥挤、偏好电子乐",
    tip: "避开最晚高峰或先确认人流",
    tags: ["Hip-hop", "Trap", "R&B", "拥挤", "高能"],
    risks: ["高峰拥挤", "空间密"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["hiphop", "social", "music"],
  },
  {
    id: "sh-ins-radi",
    city: "上海",
    type: "space",
    parent: "INS Land",
    name: "RADi",
    alias: "RADI",
    address: "INS 3楼F317",
    tagline: "畅饮加商业电子，学生党的高能夜",
    positioning: "时尚视觉与商业电子派对场",
    music: "EDM / Techno / Deep House / Tech House，按当晚变化",
    crowd: "年轻、学生及潮流客群",
    price: "畅饮票常见，价格待更新",
    dancefloor: "中，空间偏紧",
    social: "高",
    newbie: "中高",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "年轻电子派对、畅饮和视觉体验",
    notFor: "追求纯地下Techno、怕拥挤",
    tip: "不要只看Techno标签，先查DJ阵容",
    tags: ["EDM", "Tech House", "畅饮", "视觉", "年轻"],
    risks: ["舞池偏小", "曲风看阵容", "拥挤"],
    status: "曲风需按活动更新",
    updated: "2026-07-21",
    traits: ["electronic", "commercial", "photo", "newbie"],
  },
  {
    id: "sh-ins-culture",
    city: "上海",
    type: "space",
    parent: "INS Land",
    name: "Culture Club",
    alias: "CULTURE",
    address: "INS 4楼",
    tagline: "K-pop 和 Pop 的自由舞池，边界感是入场券",
    positioning: "Queer与Queer-friendly包容舞池",
    music: "K-pop / Pop / 复古舞曲，按活动变化",
    crowd: "多元、Queer-friendly客群",
    price: "待核实",
    dancefloor: "强",
    social: "高",
    newbie: "高",
    lgbt: "高",
    photo: "高",
    bestFor: "自由跳舞、K-pop和包容氛围",
    notFor: "把场所当猎奇打卡点的人",
    tip: "尊重边界和场内文化",
    tags: ["LGBTQ+友好", "K-pop", "Pop", "自由舞池", "包容"],
    risks: ["需尊重边界", "曲风随主题变化"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["inclusive", "pop", "dance", "newbie"],
  },
  {
    id: "sh-ins-friends",
    city: "上海",
    type: "space",
    parent: "INS Land",
    name: "FRiENDS",
    alias: "FRIENDS",
    address: "INS内，楼层待核实",
    tagline: "没有 VIP 主角位，舞池里人人是朋友",
    positioning: "弱化VIP桌台的开放大舞池",
    music: "按当晚活动变化",
    crowd: "重视参与和群体互动的客群",
    price: "畅饮模式，价格待核实",
    dancefloor: "强，大舞池",
    social: "高",
    newbie: "高",
    lgbt: "高",
    photo: "中",
    bestFor: "自由跳舞、朋友一起参与",
    notFor: "只想坐卡座聊天",
    tip: "先确认当晚音乐主题",
    tags: ["无VIP", "大舞池", "畅饮", "群体互动", "自由跳"],
    risks: ["没地方久坐", "曲风不固定"],
    status: "楼层和曲风待核实",
    updated: "2026-07-21",
    traits: ["dance", "inclusive", "newbie", "social"],
  },
  {
    id: "sh-ins-lafin",
    city: "上海",
    type: "space",
    parent: "INS Land",
    name: "La Fin",
    alias: "LAFIN / LA FIN",
    address: "INS 6楼",
    tagline: "红灯、卡座、Top 40：精致社交局",
    positioning: "高端精致桌台社交场",
    music: "Hip-hop / Top 40 / Pop",
    crowd: "时尚、卡座和社交客群",
    price: "中高，待核实",
    dancefloor: "中",
    social: "强",
    newbie: "中低",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "有预算的社交局、流行音乐",
    notFor: "预算有限、只想自由跳舞",
    tip: "提前确认低消和入场规则",
    tags: ["Top 40", "Hip-hop", "卡座", "高端商业", "社交"],
    risks: ["低消待确认", "舞池感较弱", "入场规则"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["commercial", "social", "photo"],
  },
  {
    id: "sh-ins-oasis",
    city: "上海",
    type: "space",
    parent: "INS Land",
    name: "OASIS",
    alias: "",
    address: "INS B1",
    tagline: "不只蹦迪，更像掉进一场数字艺术派对",
    positioning: "艺术与数字视觉结合的沉浸主题空间",
    music: "随主题和活动变化",
    crowd: "重视视觉与主题体验的客群",
    price: "待核实",
    dancefloor: "待核实",
    social: "中",
    newbie: "待亲测",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "沉浸式主题、拍照和活动体验",
    notFor: "只按固定曲风选店的人",
    tip: "确认升级后营业形态和当晚主题",
    tags: ["沉浸式", "数字视觉", "主题活动", "拍照", "非传统夜店"],
    risks: ["玩法不固定", "营业形态待确认"],
    status: "升级状态和实际玩法待核实",
    updated: "2026-07-21",
    traits: ["photo", "visual"],
  },
  {
    id: "hz-nonoboom",
    city: "杭州",
    type: "venue",
    name: "NONOBOOM",
    alias: "NONOBOOM国大城市广场店",
    address: "国大城市广场3楼",
    tagline: "卡座组局浓度高，舞池只是其中一环",
    positioning: "年轻商业派对与组局场",
    music: "EDM倾向，稳定曲风待核实",
    crowd: "年轻、组局和卡座客群",
    price: "待核实",
    dancefloor: "中高",
    social: "高",
    newbie: "待亲测",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "商业派对、组局和社交",
    notFor: "排斥营销、追求纯音乐",
    tip: "先确认营业状态和当晚主题",
    tags: ["商业派对", "EDM待确认", "组局", "卡座", "营销多"],
    risks: ["营销多", "营业状态待确认"],
    status: "营业状态和门店关系待核实",
    updated: "2026-07-21",
    traits: ["commercial", "social", "photo"],
  },
  {
    id: "hz-bpm",
    city: "杭州",
    type: "venue",
    name: "BPM Club",
    alias: "BPM",
    address: "保俶路2-1号",
    tagline: "杭州嘻哈小厅：开圈快，社交也快",
    positioning: "老牌Hip-hop小厅",
    music: "Hip-hop为主，活动日可能变化",
    crowd: "年轻、小厅玩家和组局客群",
    price: "待核实",
    dancefloor: "强",
    social: "高",
    newbie: "中",
    lgbt: "待亲测",
    photo: "中",
    bestFor: "Hip-hop、小厅舞池和开圈互动",
    notFor: "怕营销、只想安静坐台",
    tip: "保留低消和入场规则的书面信息",
    tags: ["Hip-hop", "小厅", "开圈", "组局", "年轻"],
    risks: ["营销多", "消费口径不一", "卡颜争议"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["hiphop", "dance", "social"],
  },
  {
    id: "hz-nono-lai-fu",
    city: "杭州",
    type: "venue",
    name: "NONO莱福舞室",
    alias: "NONO Live Ballroom",
    address: "曙光路71号",
    tagline: "没有椅子的体力局，站着跳到散场",
    positioning: "重装后的无座站立舞池夜店",
    music: "高能量流行舞曲 / DJ / 嘉宾演出",
    crowd: "年轻、大学生和舞池客群",
    price: "待核实",
    dancefloor: "强，大舞池",
    social: "高",
    newbie: "高",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "想跳舞、看表演和参与互动",
    notFor: "怕烟味、拥挤和长时间站立",
    tip: "穿轻便鞋并减少易掉配饰",
    tags: ["无座", "大舞池", "嘉宾", "大学生", "体力局"],
    risks: ["烟味", "拥挤", "久站"],
    status: "2026-06重装复业，待用户校正",
    updated: "2026-07-21",
    traits: ["dance", "newbie", "photo", "commercial"],
  },
  {
    id: "hz-798",
    city: "杭州",
    type: "venue",
    name: "IIILLL798 Club",
    alias: "798 / 童锦程798",
    address: "武林广场29号3楼",
    tagline: "短视频热歌现场版，刷到的脸可能就在隔壁",
    positioning: "网红主理人和线上传播导向的社交夜店",
    music: "抖音热歌 / K-pop / 说唱",
    crowd: "年轻、网红打卡和社交客群",
    price: "中端，价格随日期变化",
    dancefloor: "中高",
    social: "强",
    newbie: "中高",
    lgbt: "待亲测",
    photo: "强",
    bestFor: "社交、打卡和熟悉热歌",
    notFor: "只为专业音乐和地下场景",
    tip: "标注价格更新时间和组局规则",
    tags: ["热歌", "K-pop", "说唱", "网红", "打卡社交"],
    risks: ["营销感强", "价格待更新", "规则待确认"],
    status: "已有公开底稿，待亲测校正",
    updated: "2026-07-21",
    traits: ["pop", "social", "photo", "commercial"],
  },
];

const scenes = [
  { id: "newbie", label: "新手第一次", hint: "好入门", traits: ["newbie", "inclusive"] },
  { id: "dance", label: "想蹦迪", hint: "舞池强", traits: ["dance", "rave"] },
  { id: "social", label: "想社交", hint: "互动多", traits: ["social", "commercial"] },
  { id: "photo", label: "想拍照", hint: "出片", traits: ["photo", "visual"] },
  { id: "music", label: "偏爱音乐", hint: "曲风先行", traits: ["music", "hiphop", "electronic"] },
  { id: "any", label: "今晚没想法", hint: "先看看", traits: [] },
];

const glossary = [
  ["组局", "由局头或朋友攒人一起去，消费和座位规则要提前说清。"],
  ["A 卡", "多人平摊卡座费用，最好提前确认包含酒水和人数。"],
  ["卡座", "有座位和低消的区域，适合社交，不一定适合纯跳舞。"],
  ["散台", "相对轻量的桌位，预算和位置通常比卡座低。"],
  ["营销", "负责订台、票务、拉客的人，价格口径需要留痕。"],
  ["局头", "组织一场局的人，可能是玩家，也可能带营销属性。"],
  ["枪手", "被安排带动气氛或吸引客人的人，具体含义随场景变化。"],
  ["DJ", "当晚音乐核心，决定曲风、能量和人群体验。"],
  ["得吃", "夜场语境里的被搭讪或被关注，不适合做公开排名。"],
  ["酒水局", "围绕酒水和社交展开的局，不等于纯舞池体验。"],
];

const quiz = [
  {
    q: "你今晚最想要哪种能量？",
    options: [
      ["音乐越硬越好", "rave"],
      ["熟歌一起唱跳", "pop"],
      ["认识新朋友", "social"],
      ["拍点漂亮照片", "photo"],
    ],
  },
  {
    q: "你对拥挤的接受度？",
    options: [
      ["人多才有感觉", "dance"],
      ["可以，但别失控", "newbie"],
      ["我想轻松移动", "inclusive"],
      ["坐着聊也行", "commercial"],
    ],
  },
  {
    q: "你会先看什么？",
    options: [
      ["DJ 和 Line-up", "music"],
      ["朋友去哪", "social"],
      ["现场好不好看", "visual"],
      ["规则和预算", "newbie"],
    ],
  },
  {
    q: "你更偏爱的声音？",
    options: [
      ["Hard Techno / 电子", "electronic"],
      ["Hip-hop / Trap", "hiphop"],
      ["K-pop / Pop", "pop"],
      ["Top 40 / 热歌", "commercial"],
    ],
  },
  {
    q: "桌台对你重要吗？",
    options: [
      ["不重要，我要舞池", "dance"],
      ["重要，方便社交", "commercial"],
      ["可有可无", "newbie"],
      ["不喜欢被桌台限制", "inclusive"],
    ],
  },
  {
    q: "第一次去陌生场，你最怕？",
    options: [
      ["规则不透明", "newbie"],
      ["音乐不对胃口", "music"],
      ["没人一起玩", "social"],
      ["边界感差", "inclusive"],
    ],
  },
  {
    q: "你理想的散场状态？",
    options: [
      ["跳到没电", "dance"],
      ["认识了人", "social"],
      ["拍到了片", "photo"],
      ["听爽了歌", "music"],
    ],
  },
  {
    q: "今晚穿搭会怎么选？",
    options: [
      ["轻便，方便跳", "dance"],
      ["精致一点", "photo"],
      ["看场子规则", "newbie"],
      ["想怎么穿怎么穿", "inclusive"],
    ],
  },
];

const archetypes = {
  rave: "地下锐舞体质",
  electronic: "电子阵容雷达",
  hiphop: "嘻哈小厅玩家",
  pop: "熟歌舞池玩家",
  social: "社交组局玩家",
  photo: "视觉打卡玩家",
  visual: "沉浸体验玩家",
  commercial: "商业大场玩家",
  dance: "纯蹦体力玩家",
  newbie: "新手友好玩家",
  inclusive: "自由舞池玩家",
  music: "曲风优先玩家",
};

const state = {
  city: "上海",
  scene: "any",
  quizIndex: 0,
  quizScores: {},
};

const accentColors = ["#ff6577", "#d9ff43", "#ffb84d", "#67d4df"];

let lastFocusedElement = null;

function el(selector) {
  return document.querySelector(selector);
}

function scoreVenue(venue, scene) {
  if (scene.id === "any") return 1;
  return scene.traits.reduce((score, trait) => score + (venue.traits.includes(trait) ? 2 : 0), 0);
}

function getVisibleVenues() {
  const scene = scenes.find((item) => item.id === state.scene);
  return venues
    .filter((venue) => venue.city === state.city && !venue.hiddenByDefault)
    .map((venue) => ({ venue, score: scoreVenue(venue, scene) }))
    .filter((item) => state.scene === "any" || item.score > 0)
    .sort((a, b) => b.score - a.score || Number(a.venue.type === "space") - Number(b.venue.type === "space"));
}

function renderScenes() {
  el("#sceneGrid").innerHTML = scenes
    .map(
      (scene) => `
        <button class="scene-button ${scene.id === state.scene ? "active" : ""}" type="button" aria-pressed="${scene.id === state.scene}" data-scene="${scene.id}">
          <strong>${scene.label}</strong>
          <span>${scene.hint}</span>
        </button>
      `,
    )
    .join("");
}

function renderVenues() {
  const items = getVisibleVenues();
  const scene = scenes.find((item) => item.id === state.scene);
  el("#listTitle").textContent = `${state.city} · ${scene.label}`;
  el("#venueCount").textContent = `${items.length} 家`;
  el("#venueList").innerHTML = items
    .map(({ venue }, index) => {
      const accent = accentColors[index % accentColors.length];
      const typeLabel = venue.type === "space" ? venue.parent : "独立/综合体";
      return `
        <article class="venue-card" data-id="${venue.id}" style="--accent: ${accent}">
          <button class="venue-card-hit" type="button" aria-label="查看 ${venue.name} 详情"></button>
          <span class="venue-poster" aria-hidden="true">
            <span class="poster-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="poster-city">${venue.city === "上海" ? "SHANGHAI" : "HANGZHOU"}</span>
          </span>
          <div class="venue-main">
            <p class="kicker">${typeLabel}</p>
            <h3 class="venue-name">${venue.name}</h3>
            <p class="tagline">${venue.tagline}</p>
            <div class="venue-facts">
              <span><i></i>${venue.music}</span>
              <span><i></i>${venue.price}</span>
            </div>
            <div class="tag-strip">${venue.tags.slice(0, 4).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          </div>
          <div class="venue-score">
            <span class="score-badge">${venue.newbie.replace("待亲测", "?")}</span>
            <span class="mini-label">新手友好</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function metric(label, value) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderReviewDraft(venueId) {
  const saved = JSON.parse(localStorage.getItem(`review:${venueId}`) || "null");
  if (!saved) return "";
  return `<div class="pending-review">待审核：${saved.tags.join("、")}｜${saved.text || "暂无短感受"}</div>`;
}

function openSheet(venueId) {
  const venue = venues.find((item) => item.id === venueId);
  if (!venue) return;

  lastFocusedElement = document.activeElement;
  el("#sheetContent").innerHTML = `
    <div class="sheet-title-row">
      <div>
        <p class="kicker">${venue.city}${venue.parent ? ` · ${venue.parent}` : ""}</p>
        <h2 class="sheet-title">${venue.name}</h2>
        <p class="tagline">${venue.tagline}</p>
      </div>
      <button class="icon-button close-sheet" type="button" aria-label="关闭详情" title="关闭">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>
    <div class="detail-tags">${venue.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    <div class="detail-meta">
      <span><strong>地址</strong> ${venue.address}</span>
      <span><strong>资料更新</strong> ${venue.updated}</span>
    </div>
    <div class="detail-grid">
      ${metric("音乐类型", venue.music)}
      ${metric("客群年龄感", venue.crowd)}
      ${metric("消费区间", venue.price)}
      ${metric("舞池参与", venue.dancefloor)}
      ${metric("社交友好", venue.social)}
      ${metric("LGBTQ+ 友好", venue.lgbt)}
      ${metric("拍照出片", venue.photo)}
      ${metric("资料状态", venue.status)}
    </div>
    <div class="guide-pair">
      <div class="detail-block positive">
        <h4>适合谁 / GO IF</h4>
        <p>${venue.bestFor}</p>
      </div>
      <div class="detail-block caution">
        <h4>不适合谁 / SKIP IF</h4>
        <p>${venue.notFor}</p>
      </div>
    </div>
    <div class="detail-block full positive">
      <h4>第一次去 / FIRST-TIMER NOTE</h4>
      <p>${venue.tip}</p>
    </div>
    <div class="detail-block full caution">
      <h4>风险提示 / WATCH OUT</h4>
      <div class="tag-strip">${venue.risks.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </div>
    <div class="detail-block full">
      <h4>打卡评价 / PLAYER NOTE</h4>
      <form class="review-form" data-review="${venue.id}">
        <div class="chip-row">
          ${["音乐对味", "人群舒服", "规则清楚", "太挤了", "想再去"].map((tag) => `<button class="chip-button" type="button" data-chip="${tag}">${tag}</button>`).join("")}
        </div>
        <label class="form-label" for="review-${venue.id}">一句真实感受 <span>80 字以内</span></label>
        <textarea id="review-${venue.id}" maxlength="80" placeholder="例如：歌单很对味，但周五零点后会比较挤。"></textarea>
        <button class="primary-button" type="submit">提交审核</button>
      </form>
      <div class="review-draft" aria-live="polite">${renderReviewDraft(venue.id)}</div>
    </div>
    <p class="detail-footnote">18+ 资料原型。价格、阵容、营业状态和入场规则可能临时变化，请在出发前向场所官方再次确认。</p>
  `;

  el("#sheetBackdrop").classList.remove("hidden");
  el("#detailSheet").removeAttribute("inert");
  el("#detailSheet").classList.add("open");
  el("#detailSheet").setAttribute("aria-hidden", "false");
  el(".app-shell").setAttribute("inert", "");
  document.body.classList.add("sheet-open");
  el(".close-sheet").focus();
}

function closeSheet() {
  el("#sheetBackdrop").classList.add("hidden");
  el("#detailSheet").classList.remove("open");
  el("#detailSheet").setAttribute("aria-hidden", "true");
  el("#detailSheet").setAttribute("inert", "");
  el(".app-shell").removeAttribute("inert");
  document.body.classList.remove("sheet-open");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function renderQuiz() {
  const question = quiz[state.quizIndex];
  el("#quizResult").classList.add("hidden");
  el("#quizOptions").classList.remove("hidden");
  el("#quizQuestion").textContent = question.q;
  el("#quizStep").textContent = String(state.quizIndex + 1).padStart(2, "0");
  el("#quizProgress").style.width = `${(state.quizIndex / quiz.length) * 100}%`;
  el("#quizOptions").innerHTML = question.options
    .map(([label, trait]) => `<button class="option-button" type="button" data-trait="${trait}">${label}</button>`)
    .join("");
}

function finishQuiz() {
  const ranked = Object.entries(state.quizScores).sort((a, b) => b[1] - a[1]);
  const [primary = ["newbie"], secondary = ["social"]] = ranked;
  const matching = venues
    .filter((venue) => venue.city === state.city && !venue.hiddenByDefault)
    .map((venue) => ({
      venue,
      score: venue.traits.reduce((score, trait) => score + (state.quizScores[trait] || 0), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  el("#quizProgress").style.width = "100%";
  el("#quizQuestion").textContent = "你的夜店属性";
  el("#quizOptions").classList.add("hidden");
  el("#quizResult").classList.remove("hidden");
  el("#quizResult").innerHTML = `
    <div class="result-type">
      <span>主属性</span>
      <strong>${archetypes[primary[0]]}</strong>
      <p>副属性：${archetypes[secondary[0]] || "临场发挥玩家"}</p>
    </div>
    <div class="result-picks">
      ${matching
        .map(
          ({ venue }) => `
            <button class="mini-pick" type="button" data-id="${venue.id}">
              <strong>${venue.name}</strong>
              <p>${venue.tagline}</p>
            </button>
          `,
        )
        .join("")}
    </div>
    <button class="primary-button" type="button" id="restartQuiz">重测一次</button>
  `;
}

function renderGlossary() {
  el("#glossaryList").innerHTML = glossary
    .map(([term, desc]) => `<article class="glossary-item"><strong>${term}</strong><p>${desc}</p></article>`)
    .join("");
}

function renderAll() {
  document.querySelectorAll("[data-city]").forEach((button) => {
    const isActive = button.dataset.city === state.city;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  renderScenes();
  renderVenues();
}

document.addEventListener("click", (event) => {
  const cityButton = event.target.closest("[data-city]");
  if (cityButton) {
    state.city = cityButton.dataset.city;
    renderAll();
    return;
  }

  const sceneButton = event.target.closest("[data-scene]");
  if (sceneButton) {
    state.scene = sceneButton.dataset.scene;
    renderAll();
    return;
  }

  const venueCard = event.target.closest(".venue-card, .mini-pick");
  if (venueCard) {
    openSheet(venueCard.dataset.id);
    return;
  }

  if (event.target.closest(".close-sheet") || event.target.id === "sheetBackdrop") {
    closeSheet();
    return;
  }

  const option = event.target.closest("[data-trait]");
  if (option) {
    const trait = option.dataset.trait;
    state.quizScores[trait] = (state.quizScores[trait] || 0) + 1;
    state.quizIndex += 1;
    if (state.quizIndex >= quiz.length) finishQuiz();
    else renderQuiz();
    return;
  }

  if (event.target.id === "restartQuiz") {
    state.quizIndex = 0;
    state.quizScores = {};
    renderQuiz();
    return;
  }

  if (event.target.id === "startQuiz") {
    el("#quiz").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (event.target.id === "resetFilters") {
    state.city = "上海";
    state.scene = "any";
    renderAll();
  }

  const chip = event.target.closest("[data-chip]");
  if (chip) {
    chip.classList.toggle("active");
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-review]");
  if (!form) return;
  event.preventDefault();
  const venueId = form.dataset.review;
  const tags = [...form.querySelectorAll(".chip-button.active")].map((button) => button.dataset.chip);
  const text = form.querySelector("textarea").value.trim();
  localStorage.setItem(`review:${venueId}`, JSON.stringify({ tags, text }));
  form.parentElement.querySelector(".review-draft").innerHTML = renderReviewDraft(venueId);
  form.reset();
  form.querySelectorAll(".chip-button.active").forEach((button) => button.classList.remove("active"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && el("#detailSheet").classList.contains("open")) closeSheet();
});

renderGlossary();
renderQuiz();
renderAll();
