import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Page from 'flarum/common/components/Page';

// 节日检测
function getCurrentHoliday() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 简单节日检测
    if (month === 1 && day === 1) return 'newyear'; // 元旦
    if (month === 2 && day === 14) return 'valentine'; // 情人节
    if (month === 10 && day === 1) return 'nationalday'; // 国庆节
    if (month === 10 && day === 31) return 'halloween'; // 万圣节
    if (month === 12 && day === 25) return 'christmas'; // 圣诞节
    
    // 春节（简单判断，实际需计算农历）
    if (month === 1 || month === 2) {
        const lunarDay = getLunarDay(now);
        if (lunarDay >= 1 && lunarDay <= 15) return 'spring';
    }
    
    return 'default';
}

// 简化农历计算
function getLunarDay(date) {
    // 这里简化处理，实际需要完整的农历计算
    return date.getDate();
}

// 添加横幅
function addBanner() {
    const settings = app.forum.attribute('jrcd');
    
    if (!settings || !settings.enabled) {
        removeBanner();
        return;
    }
    
    let holidayClass = 'default';
    let message = '欢迎光临！祝您有愉快的一天！';
    
    if (settings.holidayMode === 'auto') {
        holidayClass = getCurrentHoliday();
        message = getHolidayMessage(holidayClass);
    } else if (settings.holidayMode === 'custom' && settings.customBanner) {
        message = settings.customBanner;
        holidayClass = 'custom';
    } else if (settings.holidayMode !== 'none') {
        holidayClass = settings.holidayMode;
        message = getHolidayMessage(holidayClass);
    }
    
    // 添加样式
    addBannerStyles(settings.customStyle);
    
    // 创建横幅元素
    const bannerId = 'jrcd-banner';
    let banner = document.getElementById(bannerId);
    
    if (!banner) {
        banner = document.createElement('div');
        banner.id = bannerId;
        document.body.insertBefore(banner, document.body.firstChild);
    }
    
    banner.className = `jrcd-banner ${holidayClass}`;
    banner.innerHTML = message;
}

// 获取节日消息
function getHolidayMessage(holiday) {
    const messages = {
        christmas: '🎄 圣诞快乐！愿您和家人度过一个温馨的节日！ 🎅',
        newyear: '🎊 新年快乐！愿新的一年带来更多幸福与成功！ 🎉',
        spring: '🏮 春节快乐！恭喜发财，万事如意！ 🧧',
        valentine: '💖 情人节快乐！愿爱与幸福永远陪伴您！ 🌹',
        halloween: '🎃 万圣节快乐！不给糖就捣蛋！ 👻',
        default: '欢迎光临！祝您有愉快的一天！'
    };
    
    return messages[holiday] || messages.default;
}

// 添加样式
function addBannerStyles(customStyle) {
    const styleId = 'jrcd-banner-styles';
    let style = document.getElementById(styleId);
    
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    
    style.textContent = customStyle;
}

// 移除横幅
function removeBanner() {
    const banner = document.getElementById('jrcd-banner');
    const styles = document.getElementById('jrcd-banner-styles');
    
    if (banner) banner.remove();
    if (styles) styles.remove();
}

// 扩展页面组件
extend(Page.prototype, 'oncreate', function() {
    setTimeout(addBanner, 100);
});

extend(Page.prototype, 'onupdate', function() {
    setTimeout(addBanner, 100);
});