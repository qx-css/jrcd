<?php

namespace QxCss\Jrcd\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UpdateBannerSettingsController extends AbstractShowController
{
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }
    
    public function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();
        
        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);
        
        // 更新设置
        $this->settings->set('qx-css.jrcd.enabled', (bool) Arr::get($data, 'enabled', true));
        $this->settings->set('qx-css.jrcd.holiday_mode', Arr::get($data, 'holidayMode', 'auto'));
        $this->settings->set('qx-css.jrcd.custom_banner', Arr::get($data, 'customBanner', ''));
        $this->settings->set('qx-css.jrcd.custom_style', Arr::get($data, 'customStyle', ''));
        
        return ['success' => true];
    }
}