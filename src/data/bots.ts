export interface CommandOption {
  key: string;
  label: string;
  type: "select" | "input" | "boolean";
  choices?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface Command {
  name: string;
  label?: string; // Display label for the command
  usage?: string; // The technical usage string (optional for README items)
  options?: CommandOption[];
  description: string;
  images?: string[]; // Showcase image paths
  examples?: string[];
  links?: { label: string; url: string; secondary?: boolean }[];
}

export interface CommandCategory {
  name: string;
  commands: Command[];
}

export interface BotData {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  description: string;
  categories: CommandCategory[];
}

/**
 * 機器人顯示順序排列
 * 在此陣列中調整 ID 的順序即可改變側邊欄的顯示順序
 */
const BOT_ORDER = [
  "hsr-discord-bot",
  "zzz",
  "endfield",
  "nikke",
  "ba-discord-bot",
  "ff14",
  "Outo",
  "Haneko",
  "animeguess",
];

const BOTS_DATA: BotData[] = [
  {
    id: "endfield",
    name: "終末地小助手",
    icon: "/bots/endfield/pfp.png",
    banner: "/bots/endfield/banner.jpg",
    description:
      "為《明日方舟：終末地》玩家提供的便捷工具，包含自動簽到、角色查詢及新聞推播。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🤖 終末地小助手 | 全方位指南",
            description: `歡迎嘗試「終末地小助手」！這是一個為管理員量身打造的自動化工具。

## 🚀 快速開始
您可以透過上方的分類切換來查看所有功能的詳細指令與參數設定。

## 🔑 如何綁定帳號
在使用大部分功能之前，您需要先進行帳號綁定。使用 /login 指令並選擇登入方式。我們強烈建議使用「帳號密碼登入」以獲得最穩定的體驗。

## 📅 自動簽到邏輯
機器人會在您預設的時間（預設每日上午 8 點）自動嘗試進行網頁簽到。您可以透過 /daily setup 來自定義時間、通知管道與自動負載平衡。

## 🛡️ 隱私與安全
您的帳號資訊（如 Cookie 或 Token）會以加密方式儲存。開發團隊無法讀取您的明文密碼，且您可以隨時使用 /login 的解除綁定功能來刪除所有資料。

## 🌐 社群與連結
想要將機器人加入您的伺服器，或是在使用上遇到問題嗎？歡迎透過下方的連結與我們聯繫。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=1463410818791116831",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "帳號管理",
        commands: [
          {
            name: "/login",
            label: "帳號登入與管理",
            usage: "/login action:[action] account:[account]",
            options: [
              {
                key: "action",
                label: "動作",
                type: "select",
                choices: [
                  { label: "帳號密碼登入", value: "email" },
                  { label: "輸入 Cookie 登入", value: "cookie" },
                  { label: "檢視已綁定帳號", value: "list" },
                  { label: "解除帳號綁定", value: "unbind" },
                  { label: "如何獲取 Cookie", value: "help" },
                ],
                required: true,
              },
            ],
            description:
              "綁定或管理您的終末地帳號。支援多帳號切換（最多 5 個）與自動憑證同步。",
          },
        ],
      },
      {
        name: "每日簽到",
        commands: [
          {
            name: "/daily claim",
            label: "手動簽到",
            usage: "/daily claim",
            description: "手動為您的所有帳號執行網頁簽到領獎。",
            images: ["bots/endfield/daily-check.png"],
          },
          {
            name: "/daily check",
            label: "簽到狀態",
            usage: "/daily check",
            description: "查看當前的簽到歷史與今日獎勵領取情形。",
            images: ["bots/endfield/daily-check.png"],
          },
          {
            name: "/daily setup",
            label: "自動簽到設定",
            usage: "/daily setup time:[time] notify:[notify] ...",
            options: [
              {
                key: "time",
                label: "時間",
                type: "select",
                choices: Array.from({ length: 24 }, (_, i) => ({
                  label: `${i}:00`,
                  value: i.toString(),
                })),
                required: false,
              },
            ],
            description: "設定每日自動簽到的時間與通知管道。",
          },
        ],
      },
      {
        name: "角色與探索",
        commands: [
          {
            name: "/profile",
            label: "個人看板",
            usage: "/profile user:[user]",
            description:
              "查看您的管理員名片，包含等級、成就以及詳細的幹員展櫃。",
            images: [
              "bots/endfield/profile.webp",
              "bots/endfield/profile-char.webp",
            ],
          },
          {
            name: "/gacha",
            label: "尋訪資訊",
            usage: "/gacha",
            description: "獲取當前進行中的角色與武器尋訪池詳細機率與內容。",
            images: ["bots/endfield/gacha.png"],
          },
        ],
      },
      {
        name: "新聞與管理",
        commands: [
          {
            name: "/news bind",
            label: "頻道訂閱",
            usage: "/news bind",
            description: "（管理員）將當前頻道設定為終末地官方新聞的接收頻道。",
            images: ["bots/endfield/notify.png"],
          },
          {
            name: "/move-daily-notify",
            label: "遷移通知頻道",
            usage: "/move-daily-notify channel:[channel]",
            description:
              "（管理員）批次將伺服器內所有使用者的自動簽到通知遷移至新頻道。",
          },
        ],
      },
    ],
  },
  {
    id: "animeguess",
    name: "哈基米角色猜猜吧",
    icon: "/bots/animeguess/pfp.webp",
    description:
      "一個可以讓你在 Discord 上透過 AI 對話猜二次元角色的有趣機器人。機器人會以角色的語氣回覆你，挑戰你的動漫知識！",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🎮 二次元角色猜猜吧 | 挑戰您的動漫知識",
            description: `歡迎挑戰！這是一個結合 AI 角色扮演與問答的有趣遊戲。
            
## 🚀 如何啟動遊戲
- **直接互動**：只需在頻道中 **@機器人 <要說的話>**。
- **隨機召喚**：機器人會隨機化身為一名動漫角色，並以其獨有的語氣回覆您。

## 🔍 遊戲規則與數據
- **判斷與提示**：當您在對話中打出正確的角色名稱，機器人會判定您獲勝！
- **全球競爭**：透過 \`/stats\` 查看您的勝率與紀錄，並在 \`/leaderboard\` 挑戰全球排名。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/api/oauth2/authorize?client_id=1130327421111001158&permissions=8&scope=bot%20applications.commands",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "數據查詢",
        commands: [
          {
            name: "/stats",
            usage: "/stats",
            description:
              "查看您個人的遊戲統計數據，包含猜對次數、總遊戲次數、勝率以及最近猜對的角色清單。",
          },
          {
            name: "/leaderboard",
            usage: "/leaderboard",
            description: "查看全局排名與伺服器排名，競爭動漫知識之巔！",
          },
        ],
      },
    ],
  },
  {
    id: "ba-discord-bot",
    name: "Arona",
    icon: "/bots/ba/pfp.png",
    banner: "/bots/ba/banner.png",
    description:
      "專為《蔚藍檔案》玩家設計的 Discord 工具，提供學生資料查詢、模擬抽卡及新聞推播功能。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "📝 彩奈的指導手冊 | 舒曼希爾控制室後勤系統",
            description: `歡迎來到夏萊，老師！本機器人連動「阿羅娜」的高端演算能力，為您的教育工作提供數據支援。
            
## 👩‍🎓 學生情報資料庫 (Student Database)
即時檢索全校學生的戰鬥紀錄：
- **詳細技能與倍率**：包含 EX 技能在內的完整倍率與冷卻時間。
- **成長模擬**：自定義等級、星級、愛用品狀態以計算最終屬性。
- **專武與光環**：詳細的固有技能與學園光環加成分析。

## 🎫 招募模擬系統 (Gacha Simulator)
- **實時卡池同步**：支援日服、國際服、國服最新的 PU 活動。
- **天井預測**：紀錄您的模擬抽卡點數，分析招募成功率。

## 🎨 戰略繪圖板 (Tactical Builder)
- **隊伍展示圖**：自動繪製包含角色頭像、技能等級與備註的精美編隊圖。

## � 全自動通訊錄 (Notification)
- **活動預警**：自動推播官網最新的維護公告、活動更新與開發預告。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/api/oauth2/authorize?client_id=1028212108740923412&permissions=8&scope=bot%20applications.commands",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "學生資訊",
        commands: [
          {
            name: "/student",
            label: "學生資料查詢",
            usage:
              "/student student:[student] ex_skill_level:[ex_skill_level] character_level:[character_level] ...",
            options: [
              {
                key: "student",
                label: "學生",
                type: "input",
                placeholder: "學生名稱或 ID",
                required: true,
              },
              {
                key: "ex_skill_level",
                label: "EX 技能等級",
                type: "input",
                placeholder: "1-5 (預設 5)",
                required: false,
              },
              {
                key: "character_level",
                label: "角色等級",
                type: "input",
                placeholder: "1-100 (預設 90)",
                required: false,
              },
              {
                key: "star_grade",
                label: "星級",
                type: "input",
                placeholder: "1-9星 (預設 9)",
                required: false,
              },
              {
                key: "weapon_level",
                label: "武器等級",
                type: "input",
                placeholder: "1-60 (預設 60)",
                required: false,
              },
            ],
            description:
              "查看學生的詳細技能、面板、裝備、愛用品與專武資訊。可自定義各項等級以模擬數值。",
            images: ["bots/ba/student.png"],
          },
          {
            name: "/builder",
            label: "隊伍展示圖",
            usage:
              "/builder main1:[main1] team_name:[team_name] note:[note] ...",
            options: [
              {
                key: "main1",
                label: "主角色1",
                type: "input",
                placeholder: "必填角色",
                required: true,
              },
              {
                key: "team_name",
                label: "隊伍名稱",
                type: "input",
                placeholder: "例如: 總力戰-大決戰",
                required: false,
              },
              {
                key: "note",
                label: "備註",
                type: "input",
                placeholder: "隊伍說明",
                required: false,
              },
            ],
            description:
              "繪製一個精美的隊伍展示圖片，包含主隊員與支援隊員，並可自定義隊伍名稱與背景。",
            images: ["bots/ba/teambuild.png"],
          },
        ],
      },
      {
        name: "抽卡模擬",
        commands: [
          {
            name: "/pull",
            label: "抽卡模擬",
            usage: "/pull target:[target]",
            options: [
              {
                key: "target",
                label: "目標角色",
                type: "input",
                placeholder: "角色名稱或 ID (留空使用當前第一位 PU)",
                required: false,
              },
            ],
            description:
              "進行 10 抽模擬，包含抽卡動畫與統計結果，並可累積招募點數（天井）。",
            images: ["bots/ba/pull.png"],
          },
          {
            name: "/gacha",
            label: "當前池",
            usage: "/gacha server:[server]",
            options: [
              {
                key: "server",
                label: "伺服器",
                type: "select",
                choices: [
                  { label: "日服", value: "Jp" },
                  { label: "國際服", value: "Global" },
                  { label: "國服", value: "Cn" },
                ],
                required: true,
              },
            ],
            description: "繪製並查看目前各伺服器正在進行中的招募活動資訊。",
            images: ["bots/ba/gacha.png"],
          },
        ],
      },
      {
        name: "系統設定",
        commands: [
          {
            name: "/notification setup",
            label: "設定通知",
            usage: "/notification setup type:[type] channel:[channel]",
            options: [
              {
                key: "type",
                label: "類型",
                type: "select",
                choices: [
                  { label: "📢 公告", value: "announcement" },
                  { label: "📝 更新日誌", value: "update" },
                  { label: "🎉 最新活動", value: "event" },
                  { label: "🔔 全部類型", value: "all" },
                ],
                required: true,
              },
              {
                key: "channel",
                label: "頻道",
                type: "input",
                placeholder: "選擇要設定的頻道 (#頻道)",
                required: false,
              },
            ],
            description:
              "設定蔚藍檔案官方論壇的即時通知。當有新公告或活動時，彩奈會在此頻道發送通知。",
            images: ["bots/ba/notify.png"],
          },
          {
            name: "/notification status",
            label: "查看通知狀態",
            usage: "/notification status",
            description: "查看當前伺服器已設定的通知項目與對應頻道。",
          },
          {
            name: "/notification remove",
            label: "移除通知設定",
            usage: "/notification remove type:[type]",
            options: [
              {
                key: "type",
                label: "類型",
                type: "select",
                choices: [
                  { label: "📢 公告", value: "announcement" },
                  { label: "📝 更新日誌", value: "update" },
                  { label: "🎉 最新活動", value: "event" },
                  { label: "🗑️ 全部類型", value: "all" },
                ],
                required: true,
              },
            ],
            description: "移除指定類型的官方論壇通知設定。",
          },
        ],
      },
    ],
  },
  {
    id: "ff14",
    name: "塔塔露",
    icon: "/bots/ff14/pfp.webp",
    banner: "/bots/ff14/banner.png",
    description:
      "《最終幻想14》玩家的貼身助手，包含物品查詢、官方新聞訂閱及維護通知。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "⚔️ 光之戰士冒險手札 | 塔塔露的後勤支援",
            description: `歡迎來到艾歐澤亞，冒險者！我是塔塔露，將在您的冒險途中提供最堅實的物資與情報支援。
            
## � 物品與交易板查詢 (Item & Market)
再也不用切換視窗！直接在 Discord 查詢：
- **物品百科**：包含屬性、配方、商店售價與獲取途徑。
- **即時物價**：串接交易板數據，分析當前艾歐澤亞的市場走向。

## 📰 曉之通訊 (News & Maintenance)
- **官方新聞同步**：自動推播官網最新的活動、特惠與開發進度。
- **維護預警**：即時發送伺服器停機更新公告，幫助您規劃冒險時程。

## 🆔 冒險者身分驗證 (Lodestone Bind)
- **角色聯動**：透過 Lodestone 驗證技術，將您的 Discord 帳號與遊戲角色綁定，解鎖更多專屬功能！`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=1006747370060533760",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "冒險查詢",
        commands: [
          {
            name: "/item",
            label: "物品查詢",
            usage: "/item name:[name]",
            options: [
              {
                key: "name",
                label: "物品名稱",
                type: "input",
                placeholder: "輸入物品名稱",
                required: true,
              },
            ],
            description:
              "查詢艾歐澤亞的物品屬性、配方、獲取來源以及目前的交易板行情。",
          },
        ],
      },
      {
        name: "新聞推播",
        commands: [
          {
            name: "/news bind",
            label: "訂閱公告",
            usage: "/news bind",
            description:
              "（管理員）在當前頻道接收 FFXIV 官方新聞、活動與維護通知。",
            images: ["bots/ff14/notify.png"],
          },
          {
            name: "/news unbind",
            label: "取消預約",
            usage: "/news unbind",
            description: "（管理員）停止在當前伺服器發送官方推播消息。",
          },
        ],
      },
    ],
  },
  {
    id: "hsr-discord-bot",
    name: "星鐵小助手",
    icon: "/bots/hsr/pfp.webp",
    banner: "/bots/hsr/banner.png",
    description:
      "銀河冒險必備工具，提供自動簽到、角色展櫃查詢、實時便簽與躍遷模擬機能。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🌠 開拓者手冊 | 第一時間掌握星際情報",
            description: `歡迎登上星穹列車，開拓者！本機器人為您的銀河冒險提供全方位的技術支援與數據分析。
            
## 📋 實時便簽 (Real-time Note)
無需開啟遊戲，即可即時查看：
- **開拓力 (Stamina)**：當前數值與預計回滿時間。
- **委託任務**：即時追蹤小組委託的完成狀況。
- **每日/週常進度**：包含模擬宇宙、無名勳禮與每日實練。

## 🎭 角色展櫃 (Character Showcase)
生成精美的角色面板圖，包含：
- **屬性與技能**：詳細的基礎數值與倍率。
- **遺器評分**：由 AI 演算出的遺器詞條價值分析。
- **光錐資訊**：當前配備的光錐詳情。

## 📅 躍遷分析 (Warp Analytics)
- **保底進度**：自動計算距離下次小/大保底的抽數。
- **歐氣曲線**：視覺化您的抽卡運氣趨勢圖。
- **數據匯出**：支援匯出標準格式以備份您的躍遷歷史。

## 🛡️ 帳號安全與連網
您的存取憑證（Cookie）會經過本地 AES 加密儲存。您可以隨時使用 \`/account\` 進行管理或徹底登出刪除。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=895191125512581171",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "日常與帳號",
        commands: [
          {
            name: "/daily",
            label: "自動簽到設定",
            usage: "/daily action:[action]",
            options: [
              {
                key: "action",
                label: "動作",
                type: "select",
                choices: [
                  { label: "查看狀態", value: "check" },
                  { label: "立即簽到", value: "claim" },
                ],
                defaultValue: "check",
                required: true,
              },
            ],
            images: ["bots/hsr/daily.png"],
            description:
              "管理米遊社《崩壞：星穹鐵道》每日簽到，支持自動領取報酬。",
          },
          {
            name: "/note",
            label: "實時便簽",
            usage: "/note",
            description: "即時顯示開拓力回滿時間、當前委託進度與週常進度。",
            images: ["bots/hsr/note.png"],
          },
          {
            name: "/account",
            label: "帳號聯動",
            usage: "/account action:[action]",
            options: [
              {
                key: "action",
                label: "動作",
                type: "select",
                choices: [
                  { label: "帳號登入", value: "login" },
                  { label: "帳號登出", value: "logout" },
                ],
                required: true,
              },
            ],
            description: "將您的 DC 帳號與米遊社通行證綁定，以獲取動態數據。",
          },
          {
            name: "/redeem",
            label: "兌換碼",
            usage: "/redeem code:[code] user:[user]",
            options: [
              {
                key: "code",
                label: "禮包碼",
                type: "input",
                placeholder: "輸入要兌換的代碼",
                required: true,
              },
            ],
            description: "手動或批次兌換遊戲內獎勵代碼。",
          },
        ],
      },
      {
        name: "忘卻與戰績",
        commands: [
          {
            name: "/forgottenhall",
            label: "深淵挑戰紀錄",
            usage: "/forgottenhall mode:[mode] time:[time] user:[user]",
            options: [
              {
                key: "mode",
                label: "模式",
                type: "select",
                choices: [
                  { label: "渾沌回憶", value: "normal" },
                  { label: "虛構敘事", value: "story" },
                  { label: "末日幻影", value: "shadow" },
                  { label: "異相仲裁", value: "peak" },
                ],
                required: true,
              },
            ],
            description:
              "查看並繪製忘卻之庭、虛構敘事、末日幻影及異相仲裁的詳細通關配隊。支援歷史回顧與好友比較。",
            images: [
              "bots/hsr/memory.png",
              "bots/hsr/story.png",
              "bots/hsr/boss.png",
              "bots/hsr/ano.png",
            ],
          },
          {
            name: "/profile",
            label: "角色展櫃",
            usage: "/profile",
            description: "生成精美的個人戰績看板與角色詳細面板圖。",
            images: ["bots/hsr/profile.png", "bots/hsr/profile-char.png"],
          },
          {
            name: "/leaderboard",
            label: "遺器排行榜",
            usage: "/leaderboard category:[category]",
            description:
              "參與使用過 profile 指令的玩家進行遺器評分排名，看看您的角色強度如何！",
            images: ["bots/hsr/leaderboard.png"],
          },
        ],
      },
      {
        name: "躍遷與圖鑑",
        commands: [
          {
            name: "/warp log",
            label: "躍遷紀錄",
            usage: "/warp log",
            description:
              "分析您的躍遷數據，生成機率統計、保底進度與歐氣曲線圖。",
            images: ["bots/hsr/warp-log.png"],
          },
          {
            name: "/warp simulator",
            label: "躍遷模擬器",
            usage: "/warp simulator pool:[pool]",
            options: [
              {
                key: "pool",
                label: "抽卡池",
                type: "select",
                choices: [
                  { label: "限定角色池", value: "character" },
                  { label: "限定光錐池", value: "weapon" },
                  { label: "常駐群星池", value: "standard" },
                ],
                required: true,
              },
            ],
            description: "體驗最新的活動躍遷池，測試您的手氣！",
            images: ["bots/hsr/warp-sim.png"],
          },
          {
            name: "/atlas character",
            label: "角色圖鑑",
            usage: "/atlas character name:[name]",
            options: [
              {
                key: "name",
                label: "角色名稱",
                type: "input",
                placeholder: "輸入角色名稱",
                required: true,
              },
            ],
            description: "查詢角色的詳細數值、星魂效果與技能倍率。",
            images: ["bots/hsr/atlas.png"],
          },
        ],
      },
      {
        name: "其他管理",
        commands: [
          {
            name: "/clear",
            label: "清除緩存",
            usage: "/clear",
            description: "清除與您帳號相關的臨時緩存數據（例如展櫃圖片）。",
          },
        ],
      },
    ],
  },
  {
    id: "zzz",
    name: "Corin",
    icon: "/bots/zzz/pfp.webp",
    banner: "/bots/zzz/banner.png",
    description:
      "新艾利都生存必備，提供自動簽到、實時便簽、信號搜索紀錄與代理人檔案查詢。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🔌 繩匠指南 | 新艾利都生存法則",
            description: `歡迎來到新艾利都，繩匠！本機器人為您的空洞探索提供專業的後勤保障。
            
## � 實時情報 (Real-time Notes)
隨時掌握法路特街與六分街的動態：
- **電量追蹤**：即時查看電量恢復，提醒您準時進入空洞。
- **派遣進度**：追蹤代理人在各區域的採集狀況。
- **零號空洞**：查看本週的調查點數與獎勵領取進度。

## � 代理人檔案與數據
- **詳細屬性**：查看包含影畫、核心技在內的完整代理人數據。
- **驅動碟評估**：分析裝備組件的屬性收益。
- **戰績名片**：生成專屬的繩匠執照，分享您的榮譽。

## 🎰 信號紀錄分析
- **歐氣統計**：分析您在「獨家頻道」與「常駐頻道」的信號頻率。
- **機率預測**：視覺化您的搜索數據，管理預算。

## 🎁 自動化福利
- **禮包碼全自動兌換**：當官方釋出新代碼時，Corin 會自動嘗試為您兌換並發送通知！
- **每日簽到**：全自動完成米遊社每日簽到，累計菲林。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=1170366976162537543",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "日常與帳號",
        commands: [
          {
            name: "/daily",
            label: "自動簽到設定",
            usage: "/daily action:[action]",
            options: [
              {
                key: "action",
                label: "動作",
                type: "select",
                choices: [
                  { label: "查看狀態", value: "check" },
                  { label: "立即簽到", value: "claim" },
                ],
                defaultValue: "check",
                required: true,
              },
            ],
            description: "管理米遊社《絕區零》每日簽到，支持自動化排程。",
          },
          {
            name: "/note",
            label: "實時便簽",
            usage: "/note",
            description: "即時顯示電量上限、派遣剩餘時間與週常獎勵進度。",
            images: ["bots/zzz/note.png"],
          },
          {
            name: "/account",
            label: "帳號設定",
            usage: "/account options:[options]",
            options: [
              {
                key: "options",
                label: "選項",
                type: "select",
                choices: [
                  { label: "如何設定帳號", value: "HowToSetUpAccount" },
                  { label: "設定 UID", value: "SetUserID" },
                  { label: "設定 Cookie", value: "SetUserCookie" },
                  { label: "檢視已設定帳號", value: "ViewAccount" },
                  { label: "刪除已設定帳號", value: "DeleteAccount" },
                ],
                required: true,
              },
            ],
            description:
              "綁定與管理多個米遊社帳號，支援 Cookie 同步與 UID 設定。",
          },
          {
            name: "/codes",
            label: "禮包兌換",
            usage: "/codes subcommand:[subcommand] ...",
            description: "查看可用兌換碼、手動兌換或設定全自動禮包兌換功能。",
          },
        ],
      },
      {
        name: "代理人與名片",
        commands: [
          {
            name: "/profile",
            label: "個人名片",
            usage: "/profile user:[user] account:[account]",
            options: [
              {
                key: "user",
                label: "使用者",
                type: "input",
                placeholder: "@使用者",
                required: false,
              },
              {
                key: "account",
                label: "帳號",
                type: "input",
                placeholder: "帳號",
                required: false,
              },
            ],
            description: "生成並導出您的繩匠戰績、角色展櫃與詳細代理人檔案。",
            images: ["bots/zzz/profile.png", "bots/zzz/profile-char.png"],
          },
          {
            name: "/shiyudefense",
            label: "式輿防衛戰",
            usage:
              "/shiyudefense schedule:[schedule] user:[user] account:[account]",
            options: [
              {
                key: "schedule",
                label: "期數",
                type: "select",
                choices: [
                  { label: "本期", value: "1" },
                  { label: "上期", value: "2" },
                ],
                required: false,
              },
              {
                key: "user",
                label: "使用者",
                type: "input",
                placeholder: "@使用者",
                required: false,
              },
              {
                key: "account",
                label: "帳號",
                type: "input",
                placeholder: "帳號",
                required: false,
              },
            ],
            description: "查詢您在式輿防衛戰的進度、通關隊伍與星級評分。",
            images: ["bots/zzz/shiyudefense.png"],
          },
          {
            name: "/deadlyassault",
            label: "危局強襲戰",
            usage:
              "/deadlyassault schedule:[schedule] user:[user] account:[account]",
            options: [
              {
                key: "schedule",
                label: "期數",
                type: "select",
                choices: [
                  { label: "本期", value: "1" },
                  { label: "上期", value: "2" },
                ],
                required: false,
              },
              {
                key: "user",
                label: "使用者",
                type: "input",
                placeholder: "@使用者",
                required: false,
              },
              {
                key: "account",
                label: "帳號",
                type: "input",
                placeholder: "帳號",
                required: false,
              },
            ],
            description: "查看您在危局強襲戰的詳細戰鬥數據與歷史紀錄。",
            images: ["bots/zzz/deadlyassault.png"],
          },
        ],
      },
      {
        name: "信號與資訊",
        commands: [
          {
            name: "/signal log",
            label: "調頻紀錄",
            usage: "/signal log options:[options]",
            options: [
              {
                key: "options",
                label: "選項",
                type: "select",
                choices: [
                  { label: "如何取得連結", value: "how" },
                  { label: "查詢紀錄", value: "query" },
                ],
                required: true,
              },
            ],
            description: "分析您的調頻（抽卡）歷史，生成機率統計與歐氣曲線圖。",
            images: ["bots/zzz/signal-log.png"],
          },
          {
            name: "/news",
            label: "官方新聞",
            usage: "/news",
            description: "即時獲取新艾利都的官方公告、活動與開發資訊。",
          },
          {
            name: "/locale",
            label: "語言設定",
            usage: "/locale",
            description: "切換機器人的回應語言（支援繁中、英語、越南語等）。",
          },
        ],
      },
    ],
  },
  {
    id: "nikke",
    name: "Shifty",
    icon: "/bots/nikke/pfp.webp",
    banner: "/bots/nikke/banner.png",
    description:
      "《勝利女神：妮姬》專業助手，包含角色數值查詢、隊伍模擬、自動化提醒與伺服器公告。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🔫 指揮官作戰手冊 | 方舟後勤支援頻道",
            description: `歡迎回到方舟，指揮官！我是 Shifty，將為您的地面奪還作戰提供詳盡的戰術數據。
            
## 📊 妮姬戰術檔案 (Nikke Profile)
- **完整數據庫**：包含全角色的基礎數值、技能成長曲線與穿透特效分析。
- **裝備建議**：根據當前版本熱度推薦最優的企業裝備與詞條選擇。

## 🛡️ 智能組隊系統 (Team Builder)
- **Burst 快排分析**：自動計算您的編隊在不同戰鬥環境（推圖、攔截戰、競技場）下的 Burst 能量充填效率。
- **角色連動建議**：分析妮姬間的技能補足，推薦最適合的輔助與輸出組合。

## 📅 公告推播系統 (Notifications)
- **維修與活動追蹤**：全自動監控官方公告，第一時間通知您相關更新與禮包資訊。
- **戰績同步**：綁定官方論壇憑證，即時查看個人無限之塔與迷失地區進度。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=1368793547133816903",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "資料查詢",
        commands: [
          {
            name: "/character",
            label: "妮姬資訊",
            usage: "/character name:[name]",
            options: [
              {
                key: "name",
                label: "妮姬名稱",
                type: "input",
                placeholder: "輸入名稱（支援模糊配對）",
                required: true,
              },
            ],
            description: "查詢妮姬的詳細數值、全技能倍率、穿透效果與推薦裝備。",
            images: [
              "bots/nikke/profile-char.png",
              "bots/nikke/profile-all.png",
            ],
          },
          {
            name: "/team build",
            label: "智能組隊",
            usage: "/team build pool:[pool] stage:[stage]",
            options: [
              {
                key: "pool",
                label: "角色池",
                type: "select",
                choices: [
                  { label: "全妮姬", value: "all" },
                  { label: "個人持有", value: "owned" },
                ],
                required: true,
              },
            ],
            description:
              "利用大數據分析為您推薦最優的妮姬組隊方案，支援 Burst 能量輪轉分析。",
            images: ["bots/nikke/teambuild.png"],
          },
        ],
      },
      {
        name: "帳號聯動",
        commands: [
          {
            name: "/cookie",
            label: "綁定 Cookie",
            usage: "/cookie value:[value]",
            description:
              "綁定官方論壇 Cookie 以獲取您的即時戰績（如：無限之塔進度）。",
          },
          {
            name: "/profile",
            label: "指揮官名片",
            usage: "/profile",
            description: "生成並導出您的精美指揮官名片看板。",
            images: ["bots/nikke/profile.png"],
          },
        ],
      },
      {
        name: "系統推播",
        commands: [
          {
            name: "/notification setup",
            label: "設定推播",
            usage: "/notification setup channel:[channel]",
            options: [
              {
                key: "channel",
                label: "目標頻道",
                type: "input",
                placeholder: "#頻道",
                required: true,
              },
            ],
            description:
              "（管理員）在指定頻道同步《勝利女神：妮姬》官方最新公告與維修資訊。",
            images: ["bots/nikke/notify.png"],
          },
          {
            name: "/notification status",
            label: "推播狀態",
            usage: "/notification status",
            description: "查看目前伺服器內所有妮姬相關通知的設定詳情。",
          },
        ],
      },
    ],
  },
  {
    id: "Haneko",
    name: "Haneko",
    icon: "/bots/haneko/pfp.webp",
    banner: "/bots/haneko/banner.png",
    description:
      "多功能社交與娛樂機器人，提供 NSFW 內容查詢、隊伍管理與各類實用的 Discord 互動功能。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🐱 Haneko 貓貓指南 | 您的 Discord 萬能助手",
            description: `喵！我是 Haneko，一隻熱愛社交與內容分享的萬能貓貓。
            
## 🔞 紳士內容探索 (Gentleman Content)
極速存取全球最大的成人內容庫：
- **精確搜尋**：支援透過 Tag、作者、作品或角色進行多維度過濾。
- **隨機探索**：由 AI 決定您今日的驚喜。
- **個人收藏夾**：將喜愛的內容加入稍後觀看，支援跨伺服器同步。

## ⚔️ 團隊協作與管理 (Team System)
- **權限共享**：您可以將其他好友加入您的「團隊」，讓他們共同管理與檢視您的收藏清單。
- **NSFW 安全鎖**：由伺服器管理員掌控，確保在合適的頻道開啟相關功能。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=998934498274181132",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "社交與內容",
        commands: [
          {
            name: "/nhentai random",
            label: "隨機本子",
            usage: "/nhentai random",
            description: "隨機從 nhentai 抽取一本本子。",
          },
          {
            name: "/nhentai search",
            label: "搜尋本子",
            usage: "/nhentai search query:[query] filter:[filter]",
            options: [
              {
                key: "query",
                label: "搜尋關鍵字",
                type: "input",
                placeholder: "輸入關鍵字",
                required: true,
              },
              {
                key: "filter",
                label: "篩選方式",
                type: "select",
                choices: [
                  { label: "標籤 (tag)", value: "tag" },
                  { label: "作者 (artist)", value: "artist" },
                  { label: "角色 (character)", value: "character" },
                  { label: "作品 (parodies)", value: "parodies" },
                ],
                required: false,
              },
            ],
            description:
              "搜尋 nhentai 上的內容，並可指定標籤、作者或作品進行精確篩選。",
          },
          {
            name: "/nhentai get",
            label: "指定番號",
            usage: "/nhentai get query:[id]",
            options: [
              {
                key: "query",
                label: "番號",
                type: "input",
                placeholder: "例如: 123456",
                required: true,
              },
            ],
            description: "直接透過 6 位數番號獲取指定的本子內容。",
          },
          {
            name: "/nhentai explore",
            label: "探索",
            usage: "/nhentai explore",
            description: "查看目前的熱門或推薦本子清單。",
          },
          {
            name: "/list",
            label: "收藏列表",
            usage: "/list category:[category] visible:[visible]",
            options: [
              {
                key: "category",
                label: "類別",
                type: "select",
                choices: [
                  { label: "🕓 稍後觀看", value: "watchlater" },
                  { label: "💖 收藏夾", value: "favorite" },
                ],
                required: true,
              },
              {
                key: "visible",
                label: "公開顯示",
                type: "select",
                choices: [
                  { label: "是", value: "True" },
                  { label: "否 (僅限自己)", value: "False" },
                ],
                required: false,
              },
            ],
            description:
              "查看並導航您個人的稍後觀看或收藏清單。可選擇是否讓頻道內其他人看到。",
          },
          {
            name: "/nsfw",
            label: "NSFW 權限開關",
            usage: "/nsfw",
            description:
              "（管理員）切換機器人在非 NSFW 頻道是否允許執行成人內容指令。啟用後需在有權限的情況下操作。",
          },
        ],
      },
      {
        name: "隊伍管理",
        commands: [
          {
            name: "/team add",
            label: "新增團隊成員",
            usage: "/team add user:[user]",
            options: [
              {
                key: "user",
                label: "使用者",
                type: "input",
                placeholder: "@使用者",
                required: true,
              },
            ],
            description: "授權其他使用者操作您的收藏清單與導航功能。",
          },
          {
            name: "/team remove",
            label: "移除團隊成員",
            usage: "/team remove user:[user]",
            options: [
              {
                key: "user",
                label: "使用者",
                type: "input",
                placeholder: "@使用者",
                required: true,
              },
            ],
            description: "移除已授權的使用者，使其無法再操作您的內容。",
          },
          {
            name: "/team list",
            label: "查看團隊",
            usage: "/team list",
            description: "列出所有目前有權限操作您內容的人員清單。",
          },
        ],
      },
    ],
  },
  {
    id: "Outo",
    name: "Outo",
    icon: "/bots/outo/pfp.webp",
    banner: "/bots/outo/banner.png",
    description:
      "專注於問答遊戲與測驗的實體機器人，包含詞庫管理、自動化 Quiz 邏輯與歷史戰績紀錄。",
    categories: [
      {
        name: "使用手冊 (README)",
        commands: [
          {
            name: "🧠 Outo 智慧測驗系統 | 讓伺服器充滿互動",
            description: `歡迎使用 Outo！我們致力於將您的聊天頻道變成一個有趣的競技場。
            
## 📝 完全自定義詞庫 (Custom Dictionary)
- **觸發回覆**：自定義關鍵字與隨機回覆內容，讓機器人說話更有靈魂。
- **日誌追蹤**：詳細記錄每一次詞庫的變更，確保內容管理透明。

## 🏆 問答遊戲 (Dynamic Quiz)
- **AI 即時題目生成**：分析頻道歷史對話，自動生成專屬於您群組的「友情大會考」！
- **排名與積分**：自動統計分數，競爭伺服器的智慧之王。`,
            images: [],
            links: [
              {
                label: "邀請機器人",
                url: "https://discord.com/oauth2/authorize?client_id=1369294751618039808",
              },
              {
                label: "加入支持伺服器",
                url: "https://discord.gg/mPCEATJDve",
                secondary: true,
              },
            ],
          },
        ],
      },
      {
        name: "問答遊戲",
        commands: [
          {
            name: "/quiz",
            label: "友情大會考",
            usage:
              "/quiz mode:[mode] amount:[amount] description:[description] ...",
            options: [
              {
                key: "mode",
                label: "模式",
                type: "select",
                choices: [
                  { label: "👤 單人挑戰", value: "single" },
                  { label: "👥 多人大會考", value: "multi" },
                ],
                required: true,
              },
              {
                key: "amount",
                label: "題目數量",
                type: "input",
                placeholder: "10-100 (預設自動)",
                required: false,
              },
              {
                key: "description",
                label: "主題說明",
                type: "input",
                placeholder: "例如: 關於成員 A 的糗事",
                required: false,
              },
            ],
            description:
              "利用 AI 分析頻道歷史紀錄並生成專屬的問答大賽！支持多人即時競猜與排名系統。",
          },
          {
            name: "/list",
            label: "詞彙列表",
            usage: "/list visible:[visible]",
            options: [
              {
                key: "visible",
                label: "公開顯示",
                type: "select",
                choices: [
                  { label: "是", value: "True" },
                  { label: "否 (僅限自己)", value: "False" },
                ],
                required: false,
              },
            ],
            description: "查看伺服器目前已設定的所有觸發詞清單。",
          },
        ],
      },
      {
        name: "詞庫管理",
        commands: [
          {
            name: "/add",
            label: "添加詞彙",
            usage: "/add",
            description:
              "開啟彈窗填寫觸發詞、回覆內容、觸發方式與機率等詳細設定。",
          },
          {
            name: "/edit",
            label: "編輯詞彙",
            usage: "/edit trigger:[trigger]",
            options: [
              {
                key: "trigger",
                label: "要編輯的觸發詞",
                type: "input",
                placeholder: "輸入現有的觸發詞",
                required: true,
              },
            ],
            description: "修改已存在的詞彙設定，支援自動完成搜尋功能。",
          },
          {
            name: "/remove",
            label: "刪除詞彙",
            usage: "/remove trigger:[trigger]",
            options: [
              {
                key: "trigger",
                label: "要刪除的詞彙",
                type: "input",
                placeholder: "輸入要刪除的詞彙",
                required: true,
              },
            ],
            description: "從伺服器詞庫中永久移除指定的觸發詞紀錄。",
          },
          {
            name: "/logs",
            label: "動作日誌",
            usage: "/logs page:[page] visible:[visible]",
            options: [
              {
                key: "page",
                label: "頁數",
                type: "input",
                placeholder: "1",
                required: false,
              },
            ],
            description:
              "查看伺服器詞庫的變更紀錄，包含誰在何時新增、修改或刪除了哪些內容。",
          },
        ],
      },
    ],
  },
];

/**
 * 根據 BOT_ORDER 進行排序並導出
 */
export const BOTS: BotData[] = [...BOTS_DATA].sort((a, b) => {
  const indexA = BOT_ORDER.indexOf(a.id);
  const indexB = BOT_ORDER.indexOf(b.id);

  // 如果 ID 不在 BOT_ORDER 中，則排到最後面
  const finalIndexA = indexA === -1 ? 999 : indexA;
  const finalIndexB = indexB === -1 ? 999 : indexB;

  return finalIndexA - finalIndexB;
});
