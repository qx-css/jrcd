
import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

export default class JrcdSettingsPage extends ExtensionPage {
    oninit(vnode) {
        super.oninit(vnode);
        
        this.setting = this.setting.bind(this);
        
        this.settings = {
            enabled: this.setting('qx-css.jrcd.enabled', true),
            holidayMode: this.setting('qx-css.jrcd.holiday_mode', 'auto'),
            customBanner: this.setting('qx-css.jrcd.custom_banner', ''),
            customStyle: this.setting('qx-css.jrcd.custom_style', '')
        };
    }
    
    content() {
        return [
            m('.ExtensionPage-settings', [
                m('.Form-group', [
                    m('label', '启用节日横幅功能'),
                    m('input[type=checkbox].FormControl', {
                        checked: this.settings.enabled(),
                        onchange: (e) => {
                            this.settings.enabled(e.target.checked);
                        }
                    })
                ]),
                
                m('.Form-group', [
                    m('label', '横幅显示模式'),
                    m('select.FormControl', {
                        value: this.settings.holidayMode(),
                        onchange: (e) => {
                            this.settings.holidayMode(e.target.value);
                        }
                    }, [
                        m('option', {value: 'auto'}, '自动检测节日'),
                        m('option', {value: 'custom'}, '自定义内容'),
                        m('option', {value: 'none'}, '无节日样式'),
                        m('option', {value: 'christmas'}, '圣诞节主题'),
                        m('option', {value: 'newyear'}, '新年主题'),
                        m('option', {value: 'spring'}, '春节主题'),
                        m('option', {value: 'valentine'}, '情人节主题'),
                        m('option', {value: 'halloween'}, '万圣节主题'),
                        m('option', {value: 'thanksgiving'}, '感恩节主题')
                    ])
                ]),
                
                this.settings.holidayMode() === 'custom' && m('.Form-group', [
                    m('label', '自定义横幅内容'),
                    m('textarea.FormControl', {
                        rows: 4,
                        value: this.settings.customBanner(),
                        oninput: (e) => {
                            this.settings.customBanner(e.target.value);
                        },
                        placeholder: '输入自定义横幅内容，支持HTML代码'
                    })
                ]),
                
                m('.Form-group', [
                    m('label', '自定义CSS样式'),
                    m('textarea.FormControl', {
                        rows: 6,
                        value: this.settings.customStyle(),
                        oninput: (e) => {
                            this.settings.customStyle(e.target.value);
                        },
                        placeholder: '输入自定义CSS样式，例如：\n.jrcd-banner { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; }'
                    })
                ]),
                
                m('.Form-group', [
                    m('button.Button.Button--primary', {
                        onclick: this.saveSettings.bind(this)
                    }, '保存设置')
                ])
            ])
        ];
    }
    
    saveSettings() {
        this.loading = true;
        
        // 保存设置
        const promises = [
            this.settings.enabled.save(),
            this.settings.holidayMode.save(),
            this.settings.customBanner.save(),
            this.settings.customStyle.save()
        ];
        
        Promise.all(promises)
            .then(() => {
                this.loading = false;
                app.alerts.show({type: 'success'}, '设置已保存！');
                m.redraw();
            })
            .catch(() => {
                this.loading = false;
                app.alerts.show({type: 'error'}, '保存失败，请重试！');
                m.redraw();
            });
    }
}

app.initializers.add('qx-css/jrcd', () => {
    app.extensionData
        .for('qx-css-jrcd')
        .registerPage(JrcdSettingsPage);
});