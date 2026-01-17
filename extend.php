<?php

namespace QxCss\Jrcd;

use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;

return [
    // 前台资源
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
    
    // 后台资源
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    
    // 本地化
    (new Extend\Locales(__DIR__.'/locale')),
    
    // 设置序列化
    (new Extend\Settings())
        ->serializeToForum('jrcdEnabled', 'qx-css.jrcd.enabled', 'boolval', true)
        ->serializeToForum('jrcdHolidayMode', 'qx-css.jrcd.holiday_mode', 'strval', 'auto')
        ->serializeToForum('jrcdCustomBanner', 'qx-css.jrcd.custom_banner')
        ->serializeToForum('jrcdCustomStyle', 'qx-css.jrcd.custom_style'),
    
    // API 序列化器
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(function ($serializer, $model, $attributes) {
            $settings = resolve(SettingsRepositoryInterface::class);
            
            $attributes['jrcd'] = [
                'enabled' => (bool) $settings->get('qx-css.jrcd.enabled', true),
                'holidayMode' => $settings->get('qx-css.jrcd.holiday_mode', 'auto'),
                'customBanner' => $settings->get('qx-css.jrcd.custom_banner', ''),
                'customStyle' => $settings->get('qx-css.jrcd.custom_style', ''),
            ];
            
            return $attributes;
        }),
    
    // 添加设置页面
    (new Extend\Routes('api'))
        ->get('/qx-css/jrcd/settings', 'qx-css.jrcd.settings', Api\Controller\GetBannerSettingsController::class)
        ->post('/qx-css/jrcd/settings', 'qx-css.jrcd.save-settings', Api\Controller\UpdateBannerSettingsController::class),
];