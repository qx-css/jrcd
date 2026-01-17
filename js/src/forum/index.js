import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Page from 'flarum/common/components/Page';

// 节日检测函数
function getCurrentHoliday() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    
    // 春节计算 (简化版)
    const springFestival = new Date(year, 1, 5 + Math.floor((year - 2000) * 0.2422 + 20.42));
    
    // 节日映射
    if (month === 1 && day === 1) return 'newyear'; // 元旦
    if (month === 2 && day === 14) return 'valentine'; // 情人节
    if (Math.abs(now - springFestival) < 86400000 * 7) return 'spring'; // 春节前后一周
    if (month === 10 && day === 31) return 'halloween'; // 万圣节
    if (month === 11 && day === 4) return 'thanksgiving'; // 感恩节 (简化)
    if (month === 12 && day === 25) return 'christmas'; // 圣诞节
    if (month === 12 && day >= 20 && day <= 31) return 'newyear_eve'; // 新年倒计时
    
    return 'none';
}

// 节日消息和样式
const holidayConfig = {
    christmas: {
        message: '🎄 圣诞快乐！愿您和家人度过一个温馨的节日！ 🎅',
        style: `
            .jrcd-banner.christmas {
                background: linear-gradient(45deg, #d32f2f, #388e3c);
                color: white;
                border: 3px dashed #ffd54f;
            }
            .jrcd-banner.christmas:before {
                content: '🎄';
                margin-right: 10px;
            }
            .jrcd-banner.christmas:after {
                content: '🎅';
                margin-left: 10px;
            }
        `
    },
    newyear: {
        message: '🎊 新年快乐！愿新的一年带来更多幸福与成功！ 🎉',
        style: `
            .jrcd-banner.newyear {
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
                color: white;
                animation: newyear-shine 2s infinite;
            }
            @keyframes newyear-shine {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
            }
        `
    },
    spring: {
        message: '🏮 春节快乐！恭喜发财，万事如意！ 🧧',
        style: `
            .jrcd-banner.spring {
                background: linear-gradient(45deg, #d32f2f, #f57c00);
                color: #ffd700;
                font-family: "Microsoft YaHei", sans-serif;
            }
            .jrcd-banner.spring:before,
            .jrcd-banner.spring:after {
                content: '🏮';
                margin: 0 10px;
            }
        `
    },
    valentine: {
        message: '💖 情人节快乐！愿爱与幸福永远陪伴您！ 🌹',
        style: `
            .jrcd-banner.valentine {
                background: linear-gradient(45deg, #e91e63, #f48fb1);
                color: white;
                border: 2px solid #ff4081;
            }
        `
    },
    halloween: {
        message: '🎃 万圣节快乐！不给糖就捣蛋！ 👻',
        style: `
            .jrcd-banner.halloween {
                background: linear-gradient(45deg, #8e24aa, #ff9800);
                color: #ffeb3b;
                font-weight: bold;
            }
        `
    },
    default: {
        message: '欢迎光临！祝您有愉快的一天！',
        style: `
            .jrcd-banner.default {
                background: linear-gradient(45deg, #2196f3, #21cbf3);
                color: white;
            }
        `
    }
};

// 添加横幅到页面
function addBannerToPage() {
    if (!app.forum.attribute('jrcdBanner')?.enabled) return;
    
    const bannerData = app.forum.attribute('jrcdBanner');
    const holidayMode = bannerData.holidayMode;
    
    let bannerConfig;
    let message;
    
    if (holidayMode === 'auto') {
        const currentHoliday = getCurrentHoliday();
        bannerConfig = holidayConfig[currentHoliday] || holidayConfig.default;
        message = bannerConfig.message;
    } else if (holidayMode === 'custom' && bannerData.customBanner) {
        message = bannerData.customBanner;
        bannerConfig = holidayConfig.default;
    } else if (holidayConfig[holidayMode]) {
        bannerConfig = holidayConfig[holidayMode];
        message = bannerConfig.message;
    } else {
        bannerConfig = holidayConfig.default;
        message = bannerConfig.message;
    }
    
    // 添加样式
    const styleId = 'jrcd-banner-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    
    let customStyle = bannerData.customStyle || '';
    if (holidayMode !== 'custom' && bannerConfig.style) {
        customStyle += bannerConfig.style;
    }
    
    styleEl.textContent = `
        .jrcd-banner {
            padding: 15px 20px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .jrcd-banner:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        ${customStyle}
    `;
    
    // 添加横幅元素
    const bannerId = 'jrcd-banner';
    let bannerEl = document.getElementById(bannerId);
    if (!bannerEl) {
        bannerEl = document.createElement('div');
        bannerEl.id = bannerId;
        bannerEl.className = `jrcd-banner ${holidayMode}`;
        bannerEl.innerHTML = message;
        
        const header = document.querySelector('.App-header, header');
        if (header) {
            header.parentNode.insertBefore(bannerEl, header.nextSibling);
        } else {
            document.body.insertBefore(bannerEl, document.body.firstChild);
        }
    } else {
        bannerEl.className = `jrcd-banner ${holidayMode}`;
        bannerEl.innerHTML = message;
    }
}

// 扩展页面组件
extend(Page.prototype, 'oncreate', function() {
    setTimeout(addBannerToPage, 100);
});

extend(Page.prototype, 'onupdate', function() {
    setTimeout(addBannerToPage, 100);
});