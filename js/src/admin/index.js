import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import SettingsPage from 'flarum/admin/components/SettingsPage';

app.initializers.add('qx-css/jrcd', () => {
    app.extensionData
        .for('qx-css-jrcd')
        .registerSetting({
            setting: 'qx-css.jrcd.enabled',
            label: '启用节日横幅',
            type: 'boolean',
            default: true
        })
        .registerSetting({
            setting: 'qx-css.jrcd.holiday_mode',
            label: '横幅模式',
            type: 'select',
            options: {
                auto: '自动检测节日',
                custom: '自定义内容',
                none: '无节日样式',
                christmas: '圣诞节主题',
                newyear: '新年主题',
                spring: '春节主题',
                valentine: '情人节主题',
                halloween: '万圣节主题',
                thanksgiving: '感恩节主题'
            },
            default: 'auto'
        })
        .registerSetting({
            setting: 'qx-css.jrcd.custom_banner',
            label: '自定义横幅内容',
            type: 'textarea',
            placeholder: '输入HTML内容...'
        })
        .registerSetting({
            setting: 'qx-css.jrcd.custom_style',
            label: '自定义CSS样式',
            type: 'textarea',
            placeholder: '输入CSS样式...'
        });
});